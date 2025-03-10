import { useMemo } from "react";
import { Provider } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "@remix-run/react";

/**
 * A component to configure App Bridge.
 * @param props - The props for the component.
 * @returns The provider component with the app bridge config.
 */
export function AppBridgeProvider({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const history = useMemo(
    () => ({
      replace: (path: string) => {
        navigate(path, { replace: true });
      },
    }),
    [navigate]
  );

  const routerConfig = useMemo(
    () => ({ history, location }),
    [history, location]
  );

  const appBridgeConfig = useMemo(
    () => ({
      apiKey,
      host: new URL(window.location.href).searchParams.get("host") || "",
      forceRedirect: true,
    }),
    [apiKey]
  );

  return (
    <Provider config={appBridgeConfig} router={routerConfig}>
      {children}
    </Provider>
  );
} 