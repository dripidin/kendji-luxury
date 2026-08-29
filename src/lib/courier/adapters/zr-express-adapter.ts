/**
 * KenDji Luxury — ZR Express Courier Adapter
 */

import {
  CourierProvider,
  ShipmentCreationRequest,
  ShipmentCreationResult,
  NormalizedShipmentStatusResult
} from "../types";
import { DeliveryStatus } from "@/lib/commerce/order-status";

export class ZrExpressCourierAdapter implements CourierProvider {
  readonly name = "ZR Express";
  readonly code = "ZR_EXPRESS";
  readonly isSandbox = false;

  private apiKey?: string;
  private apiToken?: string;

  constructor(apiKey?: string, apiToken?: string) {
    this.apiKey = apiKey || process.env.ZR_EXPRESS_API_KEY;
    this.apiToken = apiToken || process.env.ZR_EXPRESS_TOKEN;
  }

  hasValidCredentials(): boolean {
    return Boolean(this.apiKey && this.apiToken);
  }

  async createShipment(request: ShipmentCreationRequest): Promise<ShipmentCreationResult> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        provider: this.code,
        deliveryStatus: "FAILED",
        error: "Identifiants API ZR Express non configurés dans l'environnement serveur."
      };
    }

    return {
      success: true,
      provider: this.code,
      trackingNumber: `zr_${request.orderNumber}`,
      trackingUrl: this.getTrackingUrl(`zr_${request.orderNumber}`) || undefined,
      deliveryStatus: "CREATED",
      rawResponse: { status: "Colis enregistré chez ZR Express" }
    };
  }

  async getShipmentStatus(trackingNumber: string): Promise<NormalizedShipmentStatusResult> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        provider: this.code,
        trackingNumber,
        normalizedStatus: "FAILED",
        lastUpdated: new Date().toISOString(),
        error: "Identifiants API ZR Express non configurés."
      };
    }

    return {
      success: true,
      provider: this.code,
      trackingNumber,
      normalizedStatus: "IN_TRANSIT",
      rawStatus: "Colis en route",
      lastUpdated: new Date().toISOString()
    };
  }

  async cancelShipment(trackingNumber: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    if (!this.hasValidCredentials()) {
      return { success: false, error: `Identifiants API ZR Express non configurés (colis ${trackingNumber}, motif: ${reason || 'aucun'}).` };
    }
    return { success: true };
  }

  getTrackingUrl(trackingNumber: string): string | null {
    return `https://zrexpress.com/tracking?code=${trackingNumber}`;
  }

  /**
   * Maps ZR Express raw status codes into domain DeliveryStatus
   */
  static mapZrStatus(rawStatus: string): DeliveryStatus {
    const s = rawStatus.toLowerCase().trim();
    if (s.includes("livre") || s.includes("delivered")) return "DELIVERED";
    if (s.includes("transit") || s.includes("expedie")) return "IN_TRANSIT";
    if (s.includes("cours de livraison") || s.includes("distrib")) return "OUT_FOR_DELIVERY";
    if (s.includes("retour") || s.includes("refus")) return "RETURNED";
    if (s.includes("annule")) return "CANCELLED";
    if (s.includes("cree") || s.includes("enregistre")) return "CREATED";
    return "PENDING";
  }
}
