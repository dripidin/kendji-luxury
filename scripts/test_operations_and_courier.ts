import { isValidOrderStatusTransition, getAllowedNextTransitions, OrderStatus } from '../src/lib/commerce/order-status';
import { recordTimelineEvent, getOrderTimelineEvents } from '../src/lib/commerce/order-timeline';
import { getAllInventory, adjustStock, validateItemsStockAvailability } from '../src/lib/commerce/inventory';
import { getActiveCourierProvider } from '../src/lib/courier/factory';
import { MockCourierAdapter } from '../src/lib/courier/adapters/mock-adapter';
import { YalidineCourierAdapter } from '../src/lib/courier/adapters/yalidine-adapter';
import { ZrExpressCourierAdapter } from '../src/lib/courier/adapters/zr-express-adapter';
import { calculateReconciliationStatus, reconcileCodOrder } from '../src/lib/commerce/cod-reconciliation';

console.log("==================================================");
console.log("PHASE 11: ORDER OPERATIONS, INVENTORY & COURIER TESTS");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    testsFailed++;
  }
}

// ----------------------------------------------------
// 1. Order Status State Machine Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 1] Order Status State Machine & Transitions");

assert(isValidOrderStatusTransition("PENDING", "CONFIRMED"), "PENDING -> CONFIRMED is valid");
assert(isValidOrderStatusTransition("CONFIRMED", "PREPARING"), "CONFIRMED -> PREPARING is valid");
assert(isValidOrderStatusTransition("PREPARING", "READY_TO_SHIP"), "PREPARING -> READY_TO_SHIP is valid");
assert(isValidOrderStatusTransition("READY_TO_SHIP", "SHIPPED"), "READY_TO_SHIP -> SHIPPED is valid");
assert(isValidOrderStatusTransition("SHIPPED", "DELIVERED"), "SHIPPED -> DELIVERED is valid");
assert(isValidOrderStatusTransition("SHIPPED", "RETURNED"), "SHIPPED -> RETURNED is valid");
assert(isValidOrderStatusTransition("PENDING", "CANCELLED"), "PENDING -> CANCELLED is valid");

// Invalid transitions
assert(!isValidOrderStatusTransition("DELIVERED", "PENDING"), "DELIVERED -> PENDING correctly rejected");
assert(!isValidOrderStatusTransition("CANCELLED", "SHIPPED"), "CANCELLED -> SHIPPED correctly rejected");
assert(!isValidOrderStatusTransition("RETURNED", "CONFIRMED"), "RETURNED -> CONFIRMED correctly rejected");
assert(!isValidOrderStatusTransition("PENDING", "DELIVERED"), "Direct PENDING -> DELIVERED jump correctly rejected");

// Allowed next transitions
const pendingNext = getAllowedNextTransitions("PENDING");
assert(pendingNext.includes("CONFIRMED") && pendingNext.includes("CANCELLED"), "PENDING allows CONFIRMED and CANCELLED");

// ----------------------------------------------------
// 2. Order Audit Timeline Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 2] Order Audit Timeline & Event Logging");

const testOrderId = "ord_test_" + Date.now();
const event1 = recordTimelineEvent(testOrderId, "ORDER_CREATED", "SYSTEM", { description: "Commande passée par le client" });
const event2 = recordTimelineEvent(testOrderId, "ORDER_CONFIRMED", "OPERATOR_SARAH", { description: "Adresse Hydra confirmée par téléphone" });
const event3 = recordTimelineEvent(testOrderId, "SHIPMENT_CREATED", "OPERATOR_SARAH", { trackingNumber: "KJ-TRK-16-998877" });

const timeline = getOrderTimelineEvents(testOrderId);
assert(timeline.length === 3, `Timeline contains 3 logged events (received ${timeline.length})`);
assert(timeline[0].eventType === "ORDER_CREATED" && timeline[0].actor === "SYSTEM", "Event 1 logged correctly");
assert(timeline[1].eventType === "ORDER_CONFIRMED" && timeline[1].actor === "OPERATOR_SARAH", "Event 2 logged with operator attribution");
assert(timeline[2].trackingNumber === "KJ-TRK-16-998877", "Event 3 contains tracking number");

// ----------------------------------------------------
// 3. Lightweight Inventory Management Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 3] Inventory & Stock Management");

const inventory = getAllInventory();
assert(inventory.length >= 25, `Inventory covers at least 25 catalog items (found ${inventory.length})`);

// Test manual adjustment
const adjusted = adjustStock("KDL-CLV-SET-01", "v-gold", 5);
assert(adjusted.stockQuantity === 5 && adjusted.stockStatus === "IN_STOCK", "Stock manually set to 5 units IN_STOCK");

// Test zero quantity auto out-of-stock
const depleted = adjustStock("KDL-CLV-SET-01", "v-silver", 0);
assert(depleted.stockQuantity === 0 && depleted.stockStatus === "OUT_OF_STOCK", "Stock set to 0 auto-switches to OUT_OF_STOCK");

// Test stock availability check
const availCheck = validateItemsStockAvailability([
  { productId: "KDL-CLV-SET-01", variantId: "v-gold", quantity: 2 }
]);
assert(availCheck.isAvailable, "Requested 2 units of available stock passed validation");

const unavailCheck = validateItemsStockAvailability([
  { productId: "KDL-CLV-SET-01", variantId: "v-silver", quantity: 1 }
]);
assert(!unavailCheck.isAvailable && unavailCheck.insufficientItems.length === 1, "Requested 1 unit of out-of-stock item failed validation");

// ----------------------------------------------------
// 4. Courier Abstraction & Adapters Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 4] Provider-Neutral Courier Abstraction & Normalization");

async function runCourierTests() {
  const mockAdapter = new MockCourierAdapter();

  // Test Mock Courier Shipment Creation
  const shipment = await mockAdapter.createShipment({
    orderId: "ord_1001",
    orderNumber: "KJ-2026-9911",
    customer: {
      fullName: "Yasmine Mansouri",
      phone: "0550123456",
      wilaya: "16",
      commune: "Hydra",
      address: "12 Rue des Oliviers"
    },
    items: [{ name: "Parure Trèfle", quantity: 1, unitPrice: 3500 }],
    codAmountToCollect: 3500,
    deliveryMethod: "DOMICILE"
  });

  assert(shipment.success === true, "Mock courier shipment created successfully");
  assert(Boolean(shipment.trackingNumber && shipment.trackingNumber.startsWith("KJ-TRK-16-")), `Tracking number format is KJ-TRK-16-XXXX (got ${shipment.trackingNumber})`);
  assert(shipment.deliveryStatus === "CREATED", "Initial delivery status is CREATED");

  // Test Idempotency: creating shipment for same order returns existing tracking
  const duplicateShipment = await mockAdapter.createShipment({
    orderId: "ord_1001",
    orderNumber: "KJ-2026-9911",
    customer: { fullName: "Yasmine Mansouri", phone: "0550123456", wilaya: "16", commune: "Hydra", address: "12 Rue" },
    items: [],
    codAmountToCollect: 3500,
    deliveryMethod: "DOMICILE"
  });
  assert(duplicateShipment.trackingNumber === shipment.trackingNumber, "Duplicate shipment creation returns existing tracking number (Idempotent)");

  // Test Status Normalization (Yalidine)
  assert(YalidineCourierAdapter.mapYalidineStatus("Livré au client") === "DELIVERED", "Yalidine 'Livré au client' mapped to DELIVERED");
  assert(YalidineCourierAdapter.mapYalidineStatus("Colis en transit vers centre") === "IN_TRANSIT", "Yalidine 'Colis en transit' mapped to IN_TRANSIT");
  assert(YalidineCourierAdapter.mapYalidineStatus("Échec - Colis retourné") === "RETURNED", "Yalidine 'Colis retourné' mapped to RETURNED");

  // Test Status Normalization (ZR Express)
  assert(ZrExpressCourierAdapter.mapZrStatus("Colis livre") === "DELIVERED", "ZR Express 'Colis livre' mapped to DELIVERED");
  assert(ZrExpressCourierAdapter.mapZrStatus("En cours de livraison") === "OUT_FOR_DELIVERY", "ZR Express 'En cours de livraison' mapped to OUT_FOR_DELIVERY");

  // Test Factory Provider Fallback
  const activeProvider = getActiveCourierProvider();
  assert(activeProvider.code === "MOCK_EXPRESS", "Factory falls back safely to MOCK_EXPRESS when external credentials are unconfigured");

  // ----------------------------------------------------
  // 5. COD Reconciliation Tests
  // ----------------------------------------------------
  console.log("\n[TEST GROUP 5] COD Cash Collection & Reconciliation");

  // Exact collection
  const exactReconciled = calculateReconciliationStatus(3500, 3500, true);
  assert(exactReconciled.status === "RECONCILED" && exactReconciled.difference === 0, "Exact collection (3,500 == 3,500) gives status RECONCILED");

  // Discrepancy (collected less than expected)
  const discrepancyLess = calculateReconciliationStatus(3500, 3000, true);
  assert(discrepancyLess.status === "DISCREPANCY" && discrepancyLess.difference === -500, "Under-collection (3,000 vs 3,500) gives DISCREPANCY of -500 DA");

  // Full COD order reconciliation record
  const recRecord = reconcileCodOrder("ord_rec_1", "KJ-2026-1234", 4500, 4500, {
    reconciledBy: "ADMIN_FINANCE",
    notes: "Bordereau Yalidine vérifié"
  });
  assert(recRecord.status === "RECONCILED" && recRecord.reconciledBy === "ADMIN_FINANCE", "COD reconciliation record persisted with operator note");

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log("==================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runCourierTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
