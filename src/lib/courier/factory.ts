/**
 * KenDji Luxury — Courier Provider Factory
 */

import { CourierProvider } from "./types";
import { MockCourierAdapter } from "./adapters/mock-adapter";
import { YalidineCourierAdapter } from "./adapters/yalidine-adapter";
import { ZrExpressCourierAdapter } from "./adapters/zr-express-adapter";

// Singleton instances
const mockProvider = new MockCourierAdapter();
const yalidineProvider = new YalidineCourierAdapter();
const zrExpressProvider = new ZrExpressCourierAdapter();

/**
 * Returns the currently active courier provider based on environment configuration
 */
export function getActiveCourierProvider(requestedProviderCode?: string): CourierProvider {
  const code = (requestedProviderCode || process.env.COURIER_PROVIDER || "MOCK").toUpperCase();

  switch (code) {
    case "YALIDINE":
      if (yalidineProvider.hasValidCredentials()) {
        return yalidineProvider;
      }
      // Fallback safely to mock if credentials missing
      return mockProvider;

    case "ZR_EXPRESS":
    case "ZREXPRESS":
      if (zrExpressProvider.hasValidCredentials()) {
        return zrExpressProvider;
      }
      return mockProvider;

    case "MOCK":
    case "MOCK_EXPRESS":
    default:
      return mockProvider;
  }
}

/**
 * Lists available providers and their runtime activation status
 */
export function listCourierProviders(): { code: string; name: string; isConfigured: boolean; isSandbox: boolean }[] {
  return [
    {
      code: mockProvider.code,
      name: mockProvider.name,
      isConfigured: true,
      isSandbox: true
    },
    {
      code: yalidineProvider.code,
      name: yalidineProvider.name,
      isConfigured: yalidineProvider.hasValidCredentials(),
      isSandbox: false
    },
    {
      code: zrExpressProvider.code,
      name: zrExpressProvider.name,
      isConfigured: zrExpressProvider.hasValidCredentials(),
      isSandbox: false
    }
  ];
}
