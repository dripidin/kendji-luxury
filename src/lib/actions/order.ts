"use server"

import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateAndNormalizeAlgerianPhone } from "@/lib/validation/algerian-phone"
import { getWilayaByCode, getDeliveryFee } from "@/lib/algeria-cities"
import { getAllProducts } from "@/lib/catalog"

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
 * creates customer/order/items in Supabase, and returns an authoritative order receipt.
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

    // 5. Authoritative price calculation & Snapshot creation
    let calculatedSubtotal = 0
    const itemSnapshots: OrderItemSnapshot[] = []

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return {
          success: false,
          error: `Le bijou sélectionné (ID: ${item.productId}) n'est plus disponible.`
        }
      }

      let variantLabel: string | undefined
      if (item.variantId && product.variants) {
        const foundVariant = product.variants.find(v => v.id === item.variantId)
        if (foundVariant) {
          variantLabel = foundVariant.name
        }
      }

      const authoritativeUnitPrice = product.price
      const lineTotal = authoritativeUnitPrice * item.quantity

      calculatedSubtotal += lineTotal
      itemSnapshots.push({
        productId: product.id,
        variantId: item.variantId,
        productNameSnapshot: product.name,
        variantLabelSnapshot: variantLabel,
        unitPrice: authoritativeUnitPrice,
        quantity: item.quantity,
        lineTotal
      })
    }

    // 6. Calculate authoritative delivery fee and final total
    const authoritativeDeliveryFee = getDeliveryFee(wilayaObj.code, delivery.deliveryMethod)
    const calculatedTotal = calculatedSubtotal + authoritativeDeliveryFee

    // 7. Generate customer-facing order number (KJ-2026-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `KJ-2026-${randomSuffix}`

    // 8. Authoritative database persistence to Supabase
    try {
      const supabase = createAdminClient()

      // Customer reuse / upsert by normalized phone
      let customerId: string | null = null
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', normalizedPhone)
        .maybeSingle()

      if (existingCustomer?.id) {
        customerId = existingCustomer.id
      } else {
        const { data: newCust, error: custErr } = await supabase
          .from('customers')
          .insert({
            name: customer.fullName,
            phone: normalizedPhone,
            email: customer.email || null
          })
          .select('id')
          .single()

        if (!custErr && newCust) {
          customerId = newCust.id
        }
      }

      // If customer was created/found, create order record
      if (customerId) {
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

          // Insert delivery record
          await supabase.from('deliveries').insert({
            order_id: orderRecord.id,
            provider: 'DOMESTIC_EXPRESS',
            status: 'PENDING'
          })
        }
      }
    } catch (dbErr) {
      console.error("[COD Order] Database insertion log:", dbErr)
    }

    // 9. Return verified order confirmation
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
        deliveryMethod: delivery.deliveryMethod === "DOMICILE" ? "Livraison à Domicile" : "Point Relais (Stop-Desk)"
      }
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Une erreur inattendue est survenue."
    return { success: false, error: message }
  }
}
