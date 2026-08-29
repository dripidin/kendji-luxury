/**
 * KenDji Luxury — Courier Provider Factory
 */

import { CourierProvider } from "./types";
import { MockCourierAdapter } from "./adapters/mock-adapter";
import { YalidineCourierAdapter } from "./adapters/yalidine-adapter";
import { ZrExpressCourierAdapter } from "./adapters/zr-express-adapter";
import { DzshipUniversalAdapter } from "./adapters/dzship-adapter";
import { EcotrackCourierAdapter } from "./adapters/ecotrack-adapter";

// Singleton instances
const mockProvider = new MockCourierAdapter();
const yalidineProvider = new YalidineCourierAdapter();
const zrExpressProvider = new ZrExpressCourierAdapter();

/**
 * Returns the currently active courier provider based on configuration
 */
export function getActiveCourierProvider(
  requestedProviderCode?: string,
  credentials?: Record<string, string>
): CourierProvider {
  const code = (requestedProviderCode || process.env.COURIER_PROVIDER || "YALIDINE").toUpperCase();

  switch (code) {
    case "ECOTRACK":
    case "REDEX":
      return new EcotrackCourierAdapter(credentials);

    case "MAYSTRO":
      return new DzshipUniversalAdapter("maystro", credentials);

    case "NOEST":
      return new DzshipUniversalAdapter("noest", credentials);

    case "ZR_EXPRESS":
    case "ZREXPRESS":
      if (credentials?.apiKey || zrExpressProvider.hasValidCredentials()) {
        return new DzshipUniversalAdapter("zrexpress", credentials);
      }
      return zrExpressProvider;

    case "YALIDINE":
      if (credentials?.apiId || yalidineProvider.hasValidCredentials()) {
        return new DzshipUniversalAdapter("yalidine", credentials);
      }
      return yalidineProvider;

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
      code: "YALIDINE",
      name: "Yalidine Express (Yalitec)",
      isConfigured: true,
      isSandbox: false
    },
    {
      code: "ECOTRACK",
      name: "Ecotrack DZ / Redex Express",
      isConfigured: true,
      isSandbox: false
    },
    {
      code: "ZR_EXPRESS",
      name: "ZR Express (Procolis)",
      isConfigured: true,
      isSandbox: false
    },
    {
      code: "MAYSTRO",
      name: "Maystro Delivery",
      isConfigured: true,
      isSandbox: false
    },
    {
      code: "NOEST",
      name: "Noest Express",
      isConfigured: true,
      isSandbox: false
    }
  ];
}
