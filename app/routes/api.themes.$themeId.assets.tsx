import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Get theme assets or a specific asset
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const { themeId } = params;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!themeId) {
    return json({ error: "Theme ID is required" }, { status: 400 });
  }

  try {
    if (key) {
      // Fetch a specific asset
      const response = await admin.graphql(
        `#graphql
          query getAsset($id: ID!, $key: String!) {
            theme(id: $id) {
              asset(key: $key) {
                key
                value
                contentType
              }
            }
          }
        `,
        {
          variables: {
            id: themeId,
            key,
          },
        }
      );

      const responseJson = await response.json();
      return json({
        asset: responseJson.data?.theme?.asset || null,
      });
    } else {
      // Fetch all assets
      const response = await admin.graphql(
        `#graphql
          query getAssets($id: ID!) {
            theme(id: $id) {
              assets(first: 100) {
                edges {
                  node {
                    key
                    contentType
                  }
                }
              }
            }
          }
        `,
        {
          variables: {
            id: themeId,
          },
        }
      );

      const responseJson = await response.json();
      const assets = responseJson.data?.theme?.assets?.edges.map(
        (edge: any) => edge.node
      ) || [];

      return json({ assets });
    }
  } catch (error) {
    console.error("Error fetching theme assets:", error);
    return json({ error: "Failed to fetch theme assets" }, { status: 500 });
  }
}

// Update a theme asset
export async function action({ request, params }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const { themeId } = params;

  if (!themeId) {
    return json({ error: "Theme ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { asset } = body;

    if (!asset || !asset.key) {
      return json({ error: "Asset key is required" }, { status: 400 });
    }

    const response = await admin.graphql(
      `#graphql
        mutation assetUpdate($id: ID!, $asset: AssetInput!) {
          assetUpdate(id: $id, asset: $asset) {
            asset {
              key
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          id: themeId,
          asset: {
            key: asset.key,
            value: asset.value,
          },
        },
      }
    );

    const responseJson = await response.json();
    const userErrors = responseJson.data?.assetUpdate?.userErrors || [];

    if (userErrors.length > 0) {
      return json({ errors: userErrors }, { status: 400 });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error updating theme asset:", error);
    return json({ error: "Failed to update theme asset" }, { status: 500 });
  }
} 