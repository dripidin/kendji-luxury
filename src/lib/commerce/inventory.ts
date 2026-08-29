/**
 * KenDji Luxury — Lightweight Inventory Management
 */

import { getAllProducts, Product, ProductVariant } from "@/lib/catalog";

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "UNTRACKED";

export interface InventoryItemState {
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel?: string;
  sku?: string;
  stockQuantity: number;
  stockStatus: StockStatus;
  trackInventory: boolean;
  lowStockThreshold: number;
  lastUpdated: string;
}

// In-memory stock store initialized from catalog products & variants
const inMemoryStock: Map<string, InventoryItemState> = new Map();

function getItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : `${productId}__base`;
}

// Seed catalog inventory
function seedInventoryIfNeeded() {
  if (inMemoryStock.size > 0) return;

  const catalog: Product[] = getAllProducts();
  catalog.forEach((prod: Product) => {
    if (prod.variants && prod.variants.length > 0) {
      prod.variants.forEach((v: ProductVariant) => {
        const key = getItemKey(prod.id, v.id);
        inMemoryStock.set(key, {
          productId: prod.id,
          variantId: v.id,
          productName: prod.name,
          variantLabel: v.name,
          sku: `${prod.id}-${v.id}`,
          stockQuantity: 15, // standard boutique batch
          stockStatus: "IN_STOCK",
          trackInventory: true,
          lowStockThreshold: 3,
          lastUpdated: new Date().toISOString()
        });
      });
    } else {
      const key = getItemKey(prod.id);
      inMemoryStock.set(key, {
        productId: prod.id,
        productName: prod.name,
        sku: prod.id,
        stockQuantity: 20,
        stockStatus: "IN_STOCK",
        trackInventory: true,
        lowStockThreshold: 5,
        lastUpdated: new Date().toISOString()
      });
    }
  });
}

/**
 * Returns all inventory items
 */
export function getAllInventory(): InventoryItemState[] {
  seedInventoryIfNeeded();
  return Array.from(inMemoryStock.values());
}

/**
 * Gets stock state for a specific product or variant
 */
export function getStockState(productId: string, variantId?: string): InventoryItemState | null {
  seedInventoryIfNeeded();
  const key = getItemKey(productId, variantId);
  return inMemoryStock.get(key) || null;
}

/**
 * Adjusts inventory manually
 */
export function adjustStock(
  productId: string,
  variantId: string | undefined,
  newQuantity: number,
  options?: {
    stockStatus?: StockStatus;
    trackInventory?: boolean;
    note?: string;
  }
): InventoryItemState {
  seedInventoryIfNeeded();
  const key = getItemKey(productId, variantId);
  let item = inMemoryStock.get(key);

  const safeQty = Math.max(0, Math.floor(newQuantity));
  const autoStatus: StockStatus = safeQty === 0 ? "OUT_OF_STOCK" : "IN_STOCK";

  if (!item) {
    item = {
      productId,
      variantId,
      productName: productId,
      stockQuantity: safeQty,
      stockStatus: options?.stockStatus || autoStatus,
      trackInventory: options?.trackInventory ?? true,
      lowStockThreshold: 3,
      lastUpdated: new Date().toISOString()
    };
  } else {
    item = {
      ...item,
      stockQuantity: safeQty,
      stockStatus: options?.stockStatus || (item.trackInventory ? autoStatus : item.stockStatus),
      trackInventory: options?.trackInventory ?? item.trackInventory,
      lastUpdated: new Date().toISOString()
    };
  }

  inMemoryStock.set(key, item);
  return item;
}

/**
 * Checks if ordered items are available in stock
 */
export function validateItemsStockAvailability(
  items: { productId: string; variantId?: string; quantity: number }[]
): { isAvailable: boolean; insufficientItems: { productId: string; variantId?: string; requested: number; available: number }[] } {
  seedInventoryIfNeeded();
  const insufficientItems: { productId: string; variantId?: string; requested: number; available: number }[] = [];

  for (const item of items) {
    const stock = getStockState(item.productId, item.variantId);
    if (stock && stock.trackInventory) {
      if (stock.stockStatus === "OUT_OF_STOCK" || stock.stockQuantity < item.quantity) {
        insufficientItems.push({
          productId: item.productId,
          variantId: item.variantId,
          requested: item.quantity,
          available: stock.stockStatus === "OUT_OF_STOCK" ? 0 : stock.stockQuantity
        });
      }
    }
  }

  return {
    isAvailable: insufficientItems.length === 0,
    insufficientItems
  };
}
