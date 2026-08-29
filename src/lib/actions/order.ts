"use server"

import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateAndNormalizeAlgerianPhone } from "@/lib/validation/algerian-phone"
import { getWilayaByCode, getDeliveryFee } from "@/lib/algeria-cities"
import { getAllProducts } from "@/lib/catalog"
import { resolveWilayaFee, getGlobalSettings } from "@/lib/settings"
import { sendTelegramOrderNotification } from "@/lib/notifications/telegram"
import { sendMetaPurchaseEvent } from "@/lib/analytics/meta-capi"
import { getActiveCourierProvider } from "@/lib/courier/factory"

// Request validation schema
const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1")
})

const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(3, "Veuillez entrer votre nom complet (au moins 3 caractères)"),
    phone: z.string().trim().min(8, "Le numéro de téléphone est requis"),
    additionalPhone: z.string().trim().optional(),
    email: z.string().trim().email("Adresse email invalide").optional().or(z.literal(""))
  }),
  delivery: z.object({
    wilaya: z.string().trim().min(1, "Veuillez sélectionner votre Wilaya"),
    commune: z.string().trim().min(1, "Veuillez sélectionner votre Commune"),
    address: z.string().trim().min(5, "Veuillez préciser votre adresse de livraison complète"),
    deliveryMethod: z.enum(["DOMICILE", "STOP_DESK"]).default("DOMICILE")
  }),
  items: z.array(orderItemInputSchema).min(1, "Le panier ne peut pas être vide"),
  idempotencyToken: z.string().optional()
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  productNameSnapshot: string;
  variantLabelSnapshot?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderConfirmationResult {
  success: boolean;
  orderNumber?: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  currency?: string;
  items?: OrderItemSnapshot[];
  customer?: {
    fullName: string;
    phone: string;
    email?: string;
  };
  delivery?: {
    wilaya: string;
    commune: string;
    address: string;
    deliveryMethod: string;
  };
  error?: string;
}

/**
 * Server action to create a Cash-on-Delivery (COD) order.
 * Validates Algerian phone, computes authoritative pricing from product catalog,
 * creates customer/order/items in Supabase, and triggers Telegram alerts & Meta CAPI.
 */
export async function createCodOrder(rawInput: unknown): Promise<OrderConfirmationResult> {
  try {
    // 1. Schema Validation
    const parsed = createOrderSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données de commande invalides."
      return { success: false, error: firstError }
    }

    const { customer, delivery, items } = parsed.data

    // 2. Validate Algerian Phone Number
    const phoneValidation = validateAndNormalizeAlgerianPhone(customer.phone)
    if (!phoneValidation.isValid || !phoneValidation.normalized) {
      return {
        success: false,
        error: phoneValidation.error || "Numéro de téléphone algérien invalide (ex: 0550123456)."
      }
    }
    const normalizedPhone = phoneValidation.normalized

    // 3. Validate Wilaya
    const wilayaObj = getWilayaByCode(delivery.wilaya)
    if (!wilayaObj) {
      return { success: false, error: "Wilaya sélectionnée non valide." }
    }

    // 4. Fetch authoritative products to prevent client-side price tampering
    const allProducts = getAllProducts()
    const productMap = new Map(allProducts.map(p => [p.id, p]))

    let calculatedSubtotal = 0
    const itemSnapshots: OrderItemSnapshot[] = []

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return { success: false, error: `Produit introuvable dans le catalogue (ID: ${item.productId})` }
      }

      // Check variant if exists
      let unitPrice = product.price
      let variantLabel: string | undefined = undefined

      if (item.variantId && product.variants) {
        const variant = product.variants.find(v => v.id === item.variantId)
        if (variant) {
          variantLabel = variant.name
        }
      }

      const lineTotal = unitPrice * item.quantity
      calculatedSubtotal += lineTotal

      itemSnapshots.push({
        productId: product.id,
        variantId: item.variantId,
        productNameSnapshot: product.name,
        variantLabelSnapshot: variantLabel,
        unitPrice,
        quantity: item.quantity,
        lineTotal
      })
    }

    // 5. Load settings with unmasked secrets for courier/notification credentials
    const globalSettings = await getGlobalSettings({ unmaskSecrets: true })
    const authoritativeDeliveryFee = resolveWilayaFee(
      wilayaObj.code,
      delivery.deliveryMethod,
      globalSettings.delivery?.custom_fees
    )

    // 6. Authoritative Total
    const calculatedTotal = calculatedSubtotal + authoritativeDeliveryFee

    // 7. Generate unique human-readable order number
    const timestamp = Date.now().toString().slice(-4)
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const orderNumber = `KJ-2026-${timestamp}${randomSuffix}`

    // 8. Persist Order to Supabase Database
    try {
      const supabase = createAdminClient()

      // Look up or upsert customer record
      let customerId: string | null = null
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', normalizedPhone)
        .maybeSingle()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            name: customer.fullName.trim(),
            phone: normalizedPhone,
            email: customer.email && customer.email.trim() !== "" ? customer.email.trim() : null
          })
          .select('id')
          .single()

        if (newCustomer) {
          customerId = newCustomer.id
        }
      }

      if (customerId) {
        // Insert main order record
        const { data: orderRecord, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_id: customerId,
            status: 'PENDING',
            payment_method: 'COD',
            payment_status: 'UNPAID',
            subtotal: calculatedSubtotal,
            delivery_fee: authoritativeDeliveryFee,
            total: calculatedTotal,
            currency: 'DZD',
            delivery_wilaya: wilayaObj.name,
            delivery_commune: delivery.commune.trim(),
            delivery_address: delivery.address.trim()
          })
          .select('id')
          .single()

        if (!orderErr && orderRecord?.id) {
          // Insert order items snapshot
          const orderItemsToInsert = itemSnapshots.map(snap => ({
            order_id: orderRecord.id,
            product_id: snap.productId,
            variant_id: snap.variantId || null,
            product_name_snapshot: snap.productNameSnapshot,
            variant_label_snapshot: snap.variantLabelSnapshot || null,
            unit_price: snap.unitPrice,
            quantity: snap.quantity,
            line_total: snap.lineTotal
          }))

          await supabase.from('order_items').insert(orderItemsToInsert)

          // Dispatch to courier (Ecotrack / Yalidine / etc.) if enabled
          const courierCfg = globalSettings.courier
          let trackingNumber: string | null = null
          let courierStatus = 'PENDING'

          if (courierCfg?.enabled) {
            try {
              const credentials = {
                apiId: courierCfg.api_id || '',
                apiToken: courierCfg.api_token || '',
                apiKey: courierCfg.api_key || '',
                token: courierCfg.api_token || courierCfg.api_key || '',
                baseUrl: courierCfg.base_url || 'https://app.ecotrack.dz',
                base_url: courierCfg.base_url || 'https://app.ecotrack.dz'
              }
              const courier = getActiveCourierProvider(courierCfg.active_provider, credentials)
              const shipResult = await courier.createShipment({
                orderId: orderRecord.id,
                orderNumber,
                customer: {
                  fullName: customer.fullName.trim(),
                  phone: normalizedPhone,
                  wilaya: String(wilayaObj.code),
                  commune: delivery.commune.trim(),
                  address: delivery.address.trim()
                },
                items: itemSnapshots.map(i => ({ name: i.productNameSnapshot, quantity: i.quantity, unitPrice: i.unitPrice })),
                deliveryMethod: delivery.deliveryMethod,
                codAmountToCollect: calculatedTotal
              })

              if (shipResult.success && shipResult.trackingNumber) {
                trackingNumber = shipResult.trackingNumber
                courierStatus = 'DISPATCHED'
              } else if (shipResult.error) {
                console.error('[Courier] Shipment creation failed:', shipResult.error)
                courierStatus = 'FAILED'
              }
            } catch (courierErr) {
              console.error('[Courier] Dispatch exception:', courierErr)
            }
          }

          // Insert delivery record with real tracking number if obtained
          await supabase.from('deliveries').insert({
            order_id: orderRecord.id,
            provider: courierCfg?.active_provider || 'YALIDINE',
            status: courierStatus,
            tracking_number: trackingNumber
          })
        }
      }
    } catch (dbErr) {
      console.error("[COD Order] Database insertion log:", dbErr)
    }

    // 9. Dispatch automated notifications in background (non-blocking)
    const deliveryMethodLabel = delivery.deliveryMethod === "DOMICILE" ? "Livraison à Domicile" : "Point Relais (Stop-Desk)"

    // A. Telegram Alert
    sendTelegramOrderNotification({
      orderNumber,
      customerName: customer.fullName.trim(),
      customerPhone: phoneValidation.formatted || normalizedPhone,
      wilaya: `${wilayaObj.code} - ${wilayaObj.name}`,
      commune: delivery.commune.trim(),
      address: delivery.address.trim(),
      deliveryMethod: deliveryMethodLabel,
      items: itemSnapshots.map(i => ({
        name: i.productNameSnapshot,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      })),
      subtotal: calculatedSubtotal,
      deliveryFee: authoritativeDeliveryFee,
      total: calculatedTotal
    }).catch(err => console.error('[Order Action] Telegram dispatch error:', err))

    // B. Meta Conversions API (CAPI) Purchase Event
    sendMetaPurchaseEvent({
      eventId: orderNumber,
      orderNumber,
      value: calculatedTotal,
      currency: 'DZD',
      fullName: customer.fullName.trim(),
      phone: normalizedPhone,
      wilaya: wilayaObj.name,
      commune: delivery.commune.trim(),
      items: itemSnapshots.map(i => ({
        name: i.productNameSnapshot,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    }).catch(err => console.error('[Order Action] Meta CAPI dispatch error:', err))

    // 10. Return verified order confirmation
    return {
      success: true,
      orderNumber,
      subtotal: calculatedSubtotal,
      deliveryFee: authoritativeDeliveryFee,
      total: calculatedTotal,
      currency: "DZD",
      items: itemSnapshots,
      customer: {
        fullName: customer.fullName,
        phone: phoneValidation.formatted || normalizedPhone,
        email: customer.email
      },
      delivery: {
        wilaya: `${wilayaObj.code} - ${wilayaObj.name}`,
        commune: delivery.commune.trim(),
        address: delivery.address.trim(),
        deliveryMethod: deliveryMethodLabel
      }
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Une erreur inattendue est survenue."
    return { success: false, error: message }
  }
}
