/**
 * KenDji Luxury — COD Cash Collection & Reconciliation Engine
 */

export type CodReconciliationStatus = "PENDING" | "COLLECTED" | "RECONCILED" | "DISCREPANCY";

export interface CodReconciliationRecord {
  orderId: string;
  orderNumber: string;
  expectedAmount: number; // In DZD (from authoritative order total)
  collectedAmount: number; // In DZD (reported by courier / bank transfer)
  difference: number; // collectedAmount - expectedAmount
  status: CodReconciliationStatus;
  reconciledAt?: string;
  reconciledBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const inMemoryReconciliationStore: Map<string, CodReconciliationRecord> = new Map();

/**
 * Calculates reconciliation status and discrepancy
 */
export function calculateReconciliationStatus(
  expectedAmount: number,
  collectedAmount: number,
  isFormallyReconciled: boolean = false
): { status: CodReconciliationStatus; difference: number } {
  const difference = collectedAmount - expectedAmount;

  if (collectedAmount === 0 && !isFormallyReconciled) {
    return { status: "PENDING", difference: -expectedAmount };
  }

  if (difference !== 0) {
    return { status: "DISCREPANCY", difference };
  }

  if (isFormallyReconciled) {
    return { status: "RECONCILED", difference: 0 };
  }

  return { status: "COLLECTED", difference: 0 };
}

/**
 * Reconciles or updates a COD order cash collection record
 */
export function reconcileCodOrder(
  orderId: string,
  orderNumber: string,
  expectedAmount: number,
  collectedAmount: number,
  options?: {
    isReconciled?: boolean;
    reconciledBy?: string;
    notes?: string;
  }
): CodReconciliationRecord {
  const { status, difference } = calculateReconciliationStatus(
    expectedAmount,
    collectedAmount,
    options?.isReconciled ?? true
  );

  const record: CodReconciliationRecord = {
    orderId,
    orderNumber,
    expectedAmount,
    collectedAmount,
    difference,
    status,
    reconciledAt: (options?.isReconciled ?? true) ? new Date().toISOString() : undefined,
    reconciledBy: options?.reconciledBy || "ADMIN_OPERATOR",
    notes: options?.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inMemoryReconciliationStore.set(orderId, record);
  return record;
}

/**
 * Retrieves the COD reconciliation record for an order
 */
export function getCodReconciliation(orderId: string): CodReconciliationRecord | null {
  return inMemoryReconciliationStore.get(orderId) || null;
}
