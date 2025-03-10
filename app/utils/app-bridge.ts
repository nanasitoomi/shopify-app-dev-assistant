import { ClientApplication } from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";

/**
 * Gets a session token for authenticating fetch requests
 * @param app The current app
 * @returns A session token for making authenticated requests
 */
export async function getAppBridgeSessionToken(app: ClientApplication<any>) {
  try {
    return await getSessionToken(app);
  } catch (error) {
    console.error("Error getting session token:", error);
    throw error;
  }
}

/**
 * Creates an authenticated fetch function using App Bridge session tokens
 * @param app The current app
 * @returns A fetch function that includes the session token
 */
export function createAppBridgeFetch(app: ClientApplication<any>) {
  return async (uri: RequestInfo, options?: RequestInit) => {
    const sessionToken = await getAppBridgeSessionToken(app);
    
    const headers = options?.headers || {};
    const contentType = 
      options?.method === "POST" || options?.method === "PUT" 
        ? { "Content-Type": "application/json" }
        : {};
        
    return fetch(uri, {
      ...options,
      headers: {
        ...headers,
        ...contentType,
        Authorization: `Bearer ${sessionToken}`,
      },
    });
  };
}

/**
 * Redirects to the requested resource
 * @param app The current app
 * @param url The URL to redirect to
 */
export function redirectWithAppBridge(app: ClientApplication<any>, url: string) {
  if (app) {
    app.dispatch(
      app.actions.Redirect.toRemote({
        url,
      })
    );
  }
} 