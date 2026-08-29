import { extractVariants } from './import_catalog_utils';

const testCases = [
  {
    name: "Explicit numbered",
    input: `Variant 1: Rose\nVariant 2: White\nVariant 3: Black`,
    expected: ["Rose", "White", "Black"]
  },
  {
    name: "Parenthetical",
    input: `Color variants (White, Black, Full Gold)`,
    expected: ["White", "Black", "Full Gold"]
  },
  {
    name: "Natural language count",
    input: `shows 3 color variants of the same bracelet design`,
    expected: "unresolved"
  },
  {
    name: "Structured list",
    input: `variants:\n- White\n- Black\n- Gold`,
    expected: ["White", "Black", "Gold"]
  },
  {
    name: "Ambiguous description",
    input: `This gold-tone metal bracelet is available.`,
    expected: "unresolved"
  }
];

let failed = 0;

for (const tc of testCases) {
  const result = extractVariants(tc.input);
  const resultStr = JSON.stringify(result);
  const expectedStr = JSON.stringify(tc.expected);
  
  if (resultStr !== expectedStr) {
    console.error(`❌ ${tc.name} FAILED: expected ${expectedStr}, got ${resultStr}`);
    failed++;
  } else {
    console.log(`✅ ${tc.name} PASSED`);
  }
}

if (failed === 0) {
  console.log(`\nALL TESTS PASSED`);
} else {
  console.error(`\n${failed} TESTS FAILED`);
  process.exit(1);
}
