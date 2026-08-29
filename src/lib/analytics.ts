/**
 * Lightweight Analytics Event Hooks
 * 
 * Safe, platform-agnostic client hooks for standard e-commerce events.
 */

export type AnalyticsEvent = 
  | 'add_to_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'purchase';

export interface AnalyticsPayload {
  currency?: string;
  value?: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_variant?: string;
    price?: number;
    quantity: number;
  }>;
  order_id?: string;
  wilaya?: string;
  [key: string]: unknown;
}

export function trackEvent(eventName: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') return;

  try {
    // Dispatch standard browser CustomEvent for tag managers or future pixel listeners
    const event = new CustomEvent(`kendji:${eventName}`, { detail: payload });
    window.dispatchEvent(event);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, payload);
    }
  } catch {
    // Fail silently without interrupting UI
  }
}
