import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  // GraphQL query to fetch themes
  const response = await admin.graphql(
    `#graphql
      query {
        themes(first: 10) {
          nodes {
            id
            name
            role
          }
        }
      }
    `
  );

  const responseJson = await response.json();
  
  return json({
    themes: responseJson.data?.themes?.nodes || [],
  });
} 