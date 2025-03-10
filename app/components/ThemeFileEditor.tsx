import { useState } from "react";
import { Button, Card, FormLayout, Select, TextField } from "@shopify/polaris";
import { useAppBridge } from "../hooks/useAppBridge";

interface ThemeFile {
  key: string;
  value: string;
}

interface ThemeFileEditorProps {
  themeId: string;
}

export function ThemeFileEditor({ themeId }: ThemeFileEditorProps) {
  const { fetchWithAuth } = useAppBridge();
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [files, setFiles] = useState<ThemeFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch theme files
  const fetchThemeFiles = async () => {
    if (!themeId) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/themes/${themeId}/assets`);
      const data = await response.json();
      setFiles(data.assets || []);
    } catch (error) {
      console.error("Error fetching theme files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch file content
  const fetchFileContent = async (key: string) => {
    if (!themeId || !key) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/themes/${themeId}/assets?key=${key}`);
      const data = await response.json();
      setFileContent(data.asset?.value || "");
    } catch (error) {
      console.error("Error fetching file content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save file content
  const saveFileContent = async () => {
    if (!themeId || !selectedFile) return;
    
    setSaving(true);
    try {
      await fetchWithAuth(`/api/themes/${themeId}/assets`, {
        method: "PUT",
        body: JSON.stringify({
          asset: {
            key: selectedFile,
            value: fileContent
          }
        })
      });
    } catch (error) {
      console.error("Error saving file content:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (value: string) => {
    setSelectedFile(value);
    fetchFileContent(value);
  };

  return (
    <Card>
      <Card.Section title="Theme Files">
        <FormLayout>
          <Button onClick={fetchThemeFiles} loading={loading}>
            Fetch Theme Files
          </Button>
          
          {files.length > 0 && (
            <Select
              label="Select a file"
              options={files.map(file => ({ label: file.key, value: file.key }))}
              onChange={handleFileSelect}
              value={selectedFile}
            />
          )}
          
          {selectedFile && (
            <>
              <TextField
                label="File Content"
                value={fileContent}
                onChange={setFileContent}
                multiline={4}
                autoComplete="off"
              />
              
              <Button onClick={saveFileContent} loading={saving} primary>
                Save Changes
              </Button>
            </>
          )}
        </FormLayout>
      </Card.Section>
    </Card>
  );
} 