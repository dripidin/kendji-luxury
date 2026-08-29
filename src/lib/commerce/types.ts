export type PaymentMethod = "COD";

export type PaymentStatus = "UNPAID" | "CONFIRMED" | "COLLECTED" | "REFUNDED";

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  wilaya: string;
  commune: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface CourierService {
  name: string;
  dispatchOrder: (order: Order) => Promise<string>;
  trackOrder: (trackingCode: string) => Promise<unknown>;
}
