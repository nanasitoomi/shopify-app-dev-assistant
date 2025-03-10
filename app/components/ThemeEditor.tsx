import { useState } from "react";
import { Button, Card, Layout, Page, Text, TextField } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppBridge } from "../hooks/useAppBridge";
import { ThemeFileEditor } from "./ThemeFileEditor";

/**
 * A component that demonstrates how to use App Bridge to interact with the theme
 */
export function ThemeEditor() {
  const { fetchWithAuth } = useAppBridge();
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);

  // Function to fetch themes using App Bridge authenticated fetch
  const fetchThemes = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/api/themes");
      const data = await response.json();
      setThemes(data.themes || []);
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Select a theme to edit
  const selectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  return (
    <Page>
      <TitleBar title="Theme Editor" />
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <Text as="h2" variant="headingMd">
                Manage Your Theme
              </Text>
              <Text as="p" variant="bodyMd">
                Use App Bridge to interact with your Shopify theme
              </Text>
            </Card.Section>
            <Card.Section>
              <Button onClick={fetchThemes} loading={loading}>
                Fetch Themes
              </Button>
            </Card.Section>
            {themes.length > 0 && (
              <Card.Section>
                <Text as="h3" variant="headingSm">
                  Available Themes
                </Text>
                {themes.map((theme) => (
                  <div key={theme.id} style={{ marginBottom: "8px" }}>
                    <Button 
                      onClick={() => selectTheme(theme.id)}
                      plain={selectedThemeId !== theme.id}
                      primary={selectedThemeId === theme.id}
                    >
                      {theme.name} {theme.role === "main" ? "(Active)" : ""}
                    </Button>
                  </div>
                ))}
              </Card.Section>
            )}
          </Card>
        </Layout.Section>
        
        {selectedThemeId && (
          <Layout.Section>
            <ThemeFileEditor themeId={selectedThemeId} />
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
} 