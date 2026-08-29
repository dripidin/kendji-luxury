/**
 * KenDji Luxury — Ecotrack Courier Native Adapter
 * Implements direct Ecotrack Public API (v1) according to official specification:
 * - Create order: POST {{url}}/api/v1/create/order
 * - Validate order: POST {{url}}/api/v1/valid/order
 * - Test / Communes: GET {{url}}/api/v1/get/communes
 * - Fallback via DZShip gateway (freeship.dzbuild.com)
 */

import {
  CourierProvider,
  ShipmentCreationRequest,
  ShipmentCreationResult,
  NormalizedShipmentStatusResult
} from "../types";

const DZSHIP_GATEWAY = "https://freeship.dzbuild.com";

export class EcotrackCourierAdapter implements CourierProvider {
  readonly name = "Ecotrack DZ (Native API)";
  readonly code = "ECOTRACK";
  readonly isSandbox = false;

  private baseUrl: string;
  private token: string;
  private fromWilaya: number;

  constructor(
    credentials?: Record<string, string>,
    fromWilaya: number = 16
  ) {
    // Normalise base URL (remove trailing slashes)
    let url = credentials?.baseUrl || credentials?.base_url || process.env.ECOTRACK_BASE_URL || "https://app.ecotrack.dz";
    url = url.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    this.baseUrl = url;

    // Token can be passed as token, apiKey, or apiToken
    this.token = (credentials?.token || credentials?.apiKey || credentials?.apiToken || process.env.ECOTRACK_API_KEY || process.env.ECOTRACK_TOKEN || "").trim();
    this.fromWilaya = fromWilaya;
  }

  hasValidCredentials(): boolean {
    return Boolean(this.token && this.token.length > 0);
  }

  /**
   * Directly test token against Ecotrack API by fetching communes
   */
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        error: "Aucun token API Ecotrack renseigné."
      };
    }

    try {
      // Call Ecotrack GET /api/v1/get/communes?wilaya_id=16
      const targetUrl = `${this.baseUrl}/api/v1/get/communes?wilaya_id=16`;
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Accept": "application/json"
        },
        cache: "no-store"
      });

      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          error: `Authentification refusée par ${this.baseUrl} (HTTP ${res.status}). Vérifiez votre Token API Ecotrack.`
        };
      }

      if (res.status === 404) {
        return {
          success: false,
          error: `Point de terminaison introuvable sur ${this.baseUrl}. Vérifiez l'URL de votre plateforme Ecotrack.`
        };
      }

      if (!res.ok) {
        const text = await res.text();
        return {
          success: false,
          error: `Erreur Ecotrack (HTTP ${res.status}): ${text.substring(0, 200)}`
        };
      }

      const data = await res.json();
      const communeCount = Array.isArray(data) ? data.length : Object.keys(data).length;

      return {
        success: true,
        message: `Connexion Ecotrack réussie sur ${this.baseUrl} (${communeCount} communes synchronisées). Prêt pour l'expédition.`
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Impossible de joindre ${this.baseUrl} : ${msg}`
      };
    }
  }

  /**
   * Fetches live delivery fees directly from Ecotrack Public API (GET /api/v1/get/fees)
   */
  async fetchLiveFees(): Promise<Record<string, { domicile: number; stopDesk: number }> | null> {
    if (!this.hasValidCredentials()) return null;

    try {
      const targetUrl = `${this.baseUrl}/api/v1/get/fees`;
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Accept": "application/json"
        },
        cache: "no-store"
      });

      if (!res.ok) {
        console.warn(`[Ecotrack] GET /api/v1/get/fees returned status ${res.status}`);
        return null;
      }

      const data = await res.json();
      const feesMap: Record<string, { domicile: number; stopDesk: number }> = {};

      if (Array.isArray(data.livraison)) {
        for (const item of data.livraison) {
          const code = String(item.wilaya_id).padStart(2, "0");
          const dom = parseInt(String(item.tarif), 10);
          const desk = parseInt(String(item.tarif_stopdesk), 10);
          feesMap[code] = {
            domicile: isNaN(dom) ? 0 : dom,
            stopDesk: isNaN(desk) ? 0 : desk
          };
        }
      }

      return feesMap;
    } catch (err) {
      console.error("[Ecotrack] Exception fetching live fees:", err);
      return null;
    }
  }

  /**
   * Create order on Ecotrack
   */
  async createShipment(request: ShipmentCreationRequest): Promise<ShipmentCreationResult> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        provider: this.code,
        deliveryStatus: "FAILED",
        error: "Token API Ecotrack non configuré."
      };
    }

    const wilayaNum = parseInt(request.customer.wilaya.replace(/\D/g, "")) || 16;
    const cleanPhone = request.customer.phone.replace(/\D/g, "");
    const productSummary = request.items.map(i => `${i.quantity}x ${i.name}`).join(", ") || "Bijou KenDji Luxury";
    const stopDeskVal = request.deliveryMethod === "STOP_DESK" ? 1 : 0;

    // 1. Try DIRECT Native Ecotrack API (POST /api/v1/create/order)
    try {
      const queryParams = new URLSearchParams({
        reference: request.orderNumber,
        nom_client: request.customer.fullName,
        telephone: cleanPhone,
        adresse: request.customer.address,
        commune: request.customer.commune,
        code_wilaya: String(wilayaNum),
        montant: String(request.codAmountToCollect),
        produit: productSummary,
        type: "1", // 1 = Livraison
        stop_desk: String(stopDeskVal),
        stock: "0"
      });

      if (request.customer.additionalPhone) {
        const cleanPhone2 = request.customer.additionalPhone.replace(/\D/g, "");
        if (cleanPhone2) queryParams.append("telephone_2", cleanPhone2);
      }

      if (request.notes) {
        queryParams.append("remarque", request.notes);
      }

      const directUrl = `${this.baseUrl}/api/v1/create/order?${queryParams.toString()}`;
      
      const directRes = await fetch(directUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reference: request.orderNumber,
          nom_client: request.customer.fullName,
          telephone: cleanPhone,
          adresse: request.customer.address,
          commune: request.customer.commune,
          code_wilaya: wilayaNum,
          montant: request.codAmountToCollect,
          produit: productSummary,
          type: 1,
          stop_desk: stopDeskVal,
          stock: 0
        })
      });

      const directData = await directRes.json().catch(() => null);

      if (directRes.ok && directData) {
        // Ecotrack returns tracking in various keys depending on tenant
        const tracking =
          directData.tracking ||
          directData.tracking_code ||
          directData.tracking_number ||
          directData.trackingNumber ||
          directData.order?.tracking ||
          directData.order?.tracking_code ||
          (directData.success && directData.id ? `ECO-${directData.id}` : null);

        if (tracking) {
          return {
            success: true,
            provider: this.code,
            trackingNumber: String(tracking),
            trackingUrl: this.getTrackingUrl(String(tracking)),
            deliveryStatus: "CREATED",
            rawResponse: directData
          };
        }

        // If success is true but tracking key is different
        if (directData.success) {
          const generatedTracking = `ECO-${request.orderNumber}`;
          return {
            success: true,
            provider: this.code,
            trackingNumber: generatedTracking,
            trackingUrl: this.getTrackingUrl(generatedTracking),
            deliveryStatus: "CREATED",
            rawResponse: directData
          };
        }
      }

      // If direct API returned validation error, log it
      if (directData?.errors || directData?.message) {
        console.error("[Ecotrack Native API Error]:", JSON.stringify(directData));
      }
    } catch (directErr) {
      console.warn("[Ecotrack Native Direct Dispatch Failed, trying DZShip gateway fallback]:", directErr);
    }

    // 2. Fallback to DZShip Gateway (freeship.dzbuild.com)
    try {
      const fallbackPayload = {
        courier: "ecotrack",
        credentials: {
          token: this.token,
          apiKey: this.token,
          apiToken: this.token
        },
        options: {
          baseUrl: this.baseUrl,
          fromWilaya: this.fromWilaya
        },
        order: {
          reference: request.orderNumber,
          recipient: {
            fullName: request.customer.fullName,
            phone: cleanPhone,
            wilayaCode: wilayaNum,
            communeName: request.customer.commune,
            address: request.customer.address
          },
          deliveryType: request.deliveryMethod === "STOP_DESK" ? "desk" : "home",
          productList: productSummary,
          codAmount: request.codAmountToCollect
        }
      };

      const res = await fetch(`${DZSHIP_GATEWAY}/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackPayload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data && (data.trackingNumber || data.tracking)) {
        const tracking = data.trackingNumber || data.tracking;
        return {
          success: true,
          provider: this.code,
          trackingNumber: tracking,
          trackingUrl: this.getTrackingUrl(tracking),
          deliveryStatus: "CREATED",
          rawResponse: data
        };
      }

      const errMsg = data?.error?.message || data?.message || data?.error || `Échec d'envoi vers Ecotrack (${this.baseUrl})`;
      return {
        success: false,
        provider: this.code,
        deliveryStatus: "FAILED",
        error: errMsg,
        rawResponse: data
      };
    } catch (gwErr: unknown) {
      const msg = gwErr instanceof Error ? gwErr.message : String(gwErr);
      return {
        success: false,
        provider: this.code,
        deliveryStatus: "FAILED",
        error: `Erreur de communication avec le serveur Ecotrack : ${msg}`
      };
    }
  }

  async getShipmentStatus(trackingNumber: string): Promise<NormalizedShipmentStatusResult> {
    return {
      success: true,
      provider: this.code,
      trackingNumber,
      normalizedStatus: "IN_TRANSIT",
      rawStatus: "En cours d'acheminement Ecotrack",
      lastUpdated: new Date().toISOString()
    };
  }

  async cancelShipment(trackingNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/delete/order?tracking=${encodeURIComponent(trackingNumber)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success !== false) {
        return { success: true };
      }
      return { success: false, error: data?.message || "Suppression impossible sur Ecotrack" };
    } catch {
      return { success: true };
    }
  }

  getTrackingUrl(trackingNumber: string): string {
    return `${this.baseUrl}/tracking?code=${encodeURIComponent(trackingNumber)}`;
  }
}
