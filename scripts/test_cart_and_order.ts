import { validateAndNormalizeAlgerianPhone } from '../src/lib/validation/algerian-phone';
import { getWilayas, getWilayaByCode, getCommunesByWilayaCode, validateWilayaAndCommune, getDeliveryFee } from '../src/lib/algeria-cities';
import { createCodOrder } from '../src/lib/actions/order';
import { getAllProducts } from '../src/lib/catalog';

console.log("==================================================");
console.log("PHASE 10: CART & COD ORDER FLOW AUTOMATED TESTS");
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
// 1. Phone Validation & Normalization Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 1] Algerian Phone Validation & Normalization");

const validPhones = [
  { input: "0550123456", expected: "0550123456" },
  { input: "0661 23 45 67", expected: "0661234567" },
  { input: "+213 770 99 88 77", expected: "0770998877" },
  { input: "00213560112233", expected: "0560112233" },
  { input: "06-98-76-54-32", expected: "0698765432" }
];

validPhones.forEach(({ input, expected }) => {
  const res = validateAndNormalizeAlgerianPhone(input);
  assert(res.isValid && res.normalized === expected, `Phone '${input}' normalized to '${expected}'`);
});

const invalidPhones = [
  "0123456789", // Invalid operator prefix 01
  "12345", // Too short
  "+33612345678", // French number
  "abcdefghij", // Non-digits
  "" // Empty
];

invalidPhones.forEach(input => {
  const res = validateAndNormalizeAlgerianPhone(input);
  assert(!res.isValid, `Invalid phone '${input}' correctly rejected`);
});

// ----------------------------------------------------
// 2. Algerian Geography & Wilaya/Commune Tests
// ----------------------------------------------------
console.log("\n[TEST GROUP 2] Algerian 58 Wilayas & Dependent Communes");

const wilayas = getWilayas();
assert(wilayas.length === 58, `Exact count of Algerian Wilayas is 58 (received ${wilayas.length})`);

// Test Wilaya 16 (Alger)
const alger = getWilayaByCode("16");
assert(Boolean(alger && alger.name === "Alger"), "Wilaya 16 resolved as Alger");
const algerCommunes = getCommunesByWilayaCode("16");
assert(algerCommunes.includes("Hydra") && algerCommunes.includes("Bab Ezzouar"), "Alger contains Hydra and Bab Ezzouar");

// Test Wilaya 31 (Oran)
const oran = getWilayaByCode("31");
assert(Boolean(oran && oran.name === "Oran"), "Wilaya 31 resolved as Oran");

// Test Delivery Fee Calculation
const algerDomicile = getDeliveryFee("16", "DOMICILE");
const algerDesk = getDeliveryFee("16", "STOP_DESK");
assert(algerDomicile === 500 && algerDesk === 300, `Alger delivery fees: Domicile=${algerDomicile} DA, StopDesk=${algerDesk} DA`);

const adrarDomicile = getDeliveryFee("01", "DOMICILE");
assert(adrarDomicile === 1200, `Adrar (South) delivery fee: Domicile=${adrarDomicile} DA`);

// Test Validation
assert(validateWilayaAndCommune("16", "Hydra"), "Hydra is valid in Alger");
assert(!validateWilayaAndCommune("05", "Hydra"), "Hydra is invalid in Batna");

// ----------------------------------------------------
// 3. Server-Side Price Authority & Order Creation
// ----------------------------------------------------
console.log("\n[TEST GROUP 3] Server-Side Price Authority & Order Creation");

async function runOrderTests() {
  const catalog = getAllProducts();
  const cloverSet = catalog.find(p => p.id === "KDL-CLV-SET-01")!; // 1500 DA
  const swanBracelet = catalog.find(p => p.id === "KDL-SWAN-BRAC-01")!; // 900 DA

  // Scenario A: Standard valid single-item COD order
  const orderA = await createCodOrder({
    customer: {
      fullName: "Yasmine Mansouri",
      phone: "0550123456",
      email: "yasmine@example.com"
    },
    delivery: {
      wilaya: "16",
      commune: "Hydra",
      address: "12 Rue des Oliviers",
      deliveryMethod: "DOMICILE"
    },
    items: [
      { productId: cloverSet.id, variantId: "v-black", quantity: 1 }
    ],
    idempotencyToken: "test_tok_A_" + Date.now()
  });

  assert(orderA.success === true, "Valid order A processed successfully");
  assert(orderA.subtotal === 1500, `Authoritative subtotal matches product price (1,500 DA, got ${orderA.subtotal})`);
  assert(orderA.deliveryFee === 500, `Authoritative Alger delivery fee is 500 DA (got ${orderA.deliveryFee})`);
  assert(orderA.total === 2000, `Total is 2,000 DA (1500 + 500, got ${orderA.total})`);
  assert(Boolean(orderA.orderNumber && orderA.orderNumber.startsWith("KJ-2026-")), `Order number format is KJ-2026-XXXX (got ${orderA.orderNumber})`);

  // Scenario B: Multi-item order with quantity > 1
  const orderB = await createCodOrder({
    customer: {
      fullName: "Karim Haddad",
      phone: "+213 661 88 99 00"
    },
    delivery: {
      wilaya: "31",
      commune: "Bir El Djir",
      address: "Résidence El Bahia, Bât 4",
      deliveryMethod: "STOP_DESK"
    },
    items: [
      { productId: cloverSet.id, variantId: "v-gold", quantity: 2 }, // 2 * 1500 = 3000
      { productId: swanBracelet.id, variantId: "v-silver", quantity: 1 } // 1 * 900 = 900
    ],
    idempotencyToken: "test_tok_B_" + Date.now()
  });

  assert(orderB.success === true, "Multi-item order B processed successfully");
  assert(orderB.subtotal === 3900, `Subtotal (2x1500 + 1x900) is 3,900 DA (got ${orderB.subtotal})`);
  assert(orderB.deliveryFee === 400, `Oran StopDesk fee is 400 DA (got ${orderB.deliveryFee})`);
  assert(orderB.total === 4300, `Total is 4,300 DA (got ${orderB.total})`);

  // Scenario C: Duplicate submission / Idempotency protection
  const sharedToken = "duplicate_token_" + Date.now();
  const orderC1 = await createCodOrder({
    customer: { fullName: "Amina Belkacem", phone: "0770112233" },
    delivery: { wilaya: "16", commune: "Alger Centre", address: "Place Audin", deliveryMethod: "DOMICILE" },
    items: [{ productId: cloverSet.id, quantity: 1 }],
    idempotencyToken: sharedToken
  });

  const orderC2 = await createCodOrder({
    customer: { fullName: "Amina Belkacem", phone: "0770112233" },
    delivery: { wilaya: "16", commune: "Alger Centre", address: "Place Audin", deliveryMethod: "DOMICILE" },
    items: [{ productId: cloverSet.id, quantity: 1 }],
    idempotencyToken: sharedToken
  });

  assert(orderC1.success === true, "First submission succeeded");
  assert(Boolean(orderC2.success === false && orderC2.error?.includes("déjà en cours")), "Duplicate submission with same token was blocked");

  // Scenario D: Invalid input handling (invalid phone, missing commune)
  const invalidOrder = await createCodOrder({
    customer: { fullName: "Test", phone: "12345" },
    delivery: { wilaya: "16", commune: "UnknownCity", address: "Rue Test", deliveryMethod: "DOMICILE" },
    items: [{ productId: cloverSet.id, quantity: 1 }]
  });
  assert(invalidOrder.success === false, "Invalid phone order correctly rejected");

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log("==================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runOrderTests().catch(err => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
