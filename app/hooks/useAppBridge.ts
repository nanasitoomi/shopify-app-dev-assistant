import { useAppBridge as useShopifyAppBridge } from "@shopify/app-bridge-react";
import { createAppBridgeFetch } from "../utils/app-bridge";

/**
 * A hook that provides access to App Bridge and related utilities
 * @returns App Bridge instance and utilities
 */
export function useAppBridge() {
  const app = useShopifyAppBridge();
  const fetchWithAuth = createAppBridgeFetch(app);

  return {
    app,
    fetchWithAuth,
  };
} 