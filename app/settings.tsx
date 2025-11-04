import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { VisualBuilder } from '../components/config-builder/VisualBuilder';
import { DashboardPreview } from '../components/config-builder/DashboardPreview';
import { DashboardConfig } from '../types/dashboard-schema';

// Type for AceEditor
type AceEditorType = any;
let AceEditor: AceEditorType = null;

// Dynamically import AceEditor only on web
if (Platform.OS === 'web') {
  import('react-ace').then((mod) => {
    AceEditor = mod.default;
    // Import ace modes and themes
    import('ace-builds/src-noconflict/mode-json');
    import('ace-builds/src-noconflict/mode-css');
    import('ace-builds/src-noconflict/theme-monokai');
    import('ace-builds/src-noconflict/ext-language_tools');
  });
}

const API_BASE_URL = 'http://localhost:3001';

export default function Settings() {
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [jsonConfig, setJsonConfig] = useState('');
  const [cssConfig, setCssConfig] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'json' | 'css'>('builder');
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  const [previewVisible, setPreviewVisible] = useState(true);

  // Remove display constraints for settings page
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Override viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      const originalViewport = viewport?.getAttribute('content');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes'
        );
      }

      // Override the fixed size constraints from _layout.tsx
      const style = document.createElement('style');
      style.id = 'settings-page-override';
      style.textContent = `
        html, body, #root {
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          max-height: none !important;
          overflow: auto !important;
          position: relative !important;
        }

        body {
          -ms-overflow-style: auto !important;
          scrollbar-width: auto !important;
        }

        ::-webkit-scrollbar {
          display: block !important;
          width: 8px !important;
          height: 8px !important;
        }

        ::-webkit-scrollbar-track {
          background: #0D1220 !important;
        }

        ::-webkit-scrollbar-thumb {
          background: #2A3F5F !important;
          border-radius: 4px !important;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #3D5170 !important;
        }

        /* Allow text selection in settings */
        * {
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -ms-user-select: auto !important;
          user-select: auto !important;
        }
      `;
      document.head.appendChild(style);

      // Cleanup on unmount
      return () => {
        const styleElement = document.getElementById('settings-page-override');
        if (styleElement) {
          styleElement.remove();
        }
        // Restore original viewport
        if (viewport && originalViewport) {
          viewport.setAttribute('content', originalViewport);
        }
      };
    }
  }, []);

  // Load configurations on mount
  useEffect(() => {
    loadConfigurations();
  }, []);

  // Sync JSON with visual builder changes
  useEffect(() => {
    if (config) {
      setJsonConfig(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const loadConfigurations = async () => {
    try {
      setLoading(true);

      // Load JSON config
      const jsonResponse = await fetch(`${API_BASE_URL}/api/config`);
      const jsonData = await jsonResponse.json();

      if (jsonData.success) {
        setConfig(jsonData.config);
        setJsonConfig(JSON.stringify(jsonData.config, null, 2));
        setConfigSource(jsonData.source);
      }

      // Load CSS
      const cssResponse = await fetch(`${API_BASE_URL}/api/css`);
      const cssData = await cssResponse.json();

      if (cssData.success) {
        setCssConfig(cssData.css);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading configurations:', error);
      Alert.alert(
        'Error',
        'Failed to load configurations. Make sure the API server is running (npm run api)',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  const saveJsonConfig = async () => {
    try {
      setSaving(true);

      // Validate JSON
      let parsedConfig: DashboardConfig;
      try {
        parsedConfig = JSON.parse(jsonConfig);
      } catch (error) {
        Alert.alert('Invalid JSON', 'Please fix JSON syntax errors before saving.');
        setSaving(false);
        return;
      }

      // Validate structure
      if (!parsedConfig.version || !parsedConfig.pages) {
        Alert.alert('Invalid Config', 'Config must include "version" and "pages" fields.');
        setSaving(false);
        return;
      }

      // Save to API
      const response = await fetch(`${API_BASE_URL}/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: parsedConfig }),
      });

      const data = await response.json();

      if (data.success) {
        setConfig(parsedConfig);
        setConfigSource('custom');
        Alert.alert('Success', 'Dashboard configuration saved successfully!', [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', data.error || 'Failed to save configuration');
      }

      setSaving(false);
    } catch (error) {
      console.error('Error saving JSON config:', error);
      Alert.alert('Error', 'Failed to save configuration. Check console for details.');
      setSaving(false);
    }
  };

  const saveCssConfig = async () => {
    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/api/css`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ css: cssConfig }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'CSS theme saved successfully!', [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', data.error || 'Failed to save CSS');
      }

      setSaving(false);
    } catch (error) {
      console.error('Error saving CSS config:', error);
      Alert.alert('Error', 'Failed to save CSS. Check console for details.');
      setSaving(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/refresh`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Dashboard refresh signal sent. Reload the dashboard to see changes.', [
          {
            text: 'Go to Dashboard',
            onPress: () => router.push('/'),
          },
          {
            text: 'Stay Here',
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      Alert.alert('Error', 'Failed to send refresh signal');
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonConfig);
      setJsonConfig(JSON.stringify(parsed, null, 2));
      Alert.alert('Success', 'JSON formatted successfully');
    } catch (error) {
      Alert.alert('Error', 'Invalid JSON - cannot format');
    }
  };

  const handleVisualBuilderChange = (newConfig: DashboardConfig) => {
    setConfig(newConfig);
  };

  const handleJsonEditorChange = (newValue: string) => {
    setJsonConfig(newValue);
    // Try to parse and update config for visual builder
    try {
      const parsed = JSON.parse(newValue);
      setConfig(parsed);
    } catch (error) {
      // Invalid JSON, don't update config
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading configurations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Dashboard Configuration Builder</Text>
          <Text style={styles.subtitle}>
            Source: <Text style={configSource === 'custom' ? styles.customBadge : styles.defaultBadge}>
              {configSource === 'custom' ? 'Custom' : 'Default Template'}
            </Text>
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.previewToggleButton}
            onPress={() => setPreviewVisible(!previewVisible)}
          >
            <Text style={styles.previewToggleButtonText}>
              {previewVisible ? '👁️ Hide' : '👁️ Show'} Preview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
            <Text style={styles.backButtonText}>← Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'builder' && styles.activeTab]}
          onPress={() => setActiveTab('builder')}
        >
          <Text style={[styles.tabText, activeTab === 'builder' && styles.activeTabText]}>
            Visual Builder
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'json' && styles.activeTab]}
          onPress={() => setActiveTab('json')}
        >
          <Text style={[styles.tabText, activeTab === 'json' && styles.activeTabText]}>
            Dashboard JSON
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'css' && styles.activeTab]}
          onPress={() => setActiveTab('css')}
        >
          <Text style={[styles.tabText, activeTab === 'css' && styles.activeTabText]}>
            CSS Theme
          </Text>
        </TouchableOpacity>
      </View>

      {/* Editor Area with Preview */}
      <View style={styles.mainContent}>
        {/* Editor */}
        <View style={styles.editorArea}>
          {activeTab === 'builder' && config && (
            <VisualBuilder config={config} onChange={handleVisualBuilderChange} />
          )}

          {activeTab === 'json' && (
            <ScrollView style={styles.editorContainer}>
          {Platform.OS === 'web' && AceEditor ? (
            <AceEditor
              mode="json"
              theme="monokai"
              value={jsonConfig}
              onChange={handleJsonEditorChange}
              name="json-editor"
              width="100%"
              height="600px"
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
              editorProps={{ $blockScrolling: true }}
            />
          ) : (
            <View style={styles.editorWrapper}>
              <TextInput
                style={styles.fallbackEditor}
                value={jsonConfig}
                onChangeText={handleJsonEditorChange}
                multiline
                placeholder="Paste or edit your dashboard JSON configuration here..."
                placeholderTextColor="#5A6B8C"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          )}
            </ScrollView>
          )}

          {activeTab === 'css' && (
            <ScrollView style={styles.editorContainer}>
          {Platform.OS === 'web' && AceEditor ? (
            <AceEditor
              mode="css"
              theme="monokai"
              value={cssConfig}
              onChange={setCssConfig}
              name="css-editor"
              width="100%"
              height="600px"
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
              editorProps={{ $blockScrolling: true }}
            />
          ) : (
            <View style={styles.editorWrapper}>
              <TextInput
                style={styles.fallbackEditor}
                value={cssConfig}
                onChangeText={setCssConfig}
                multiline
                placeholder="Edit CSS theme here..."
                placeholderTextColor="#5A6B8C"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          )}
            </ScrollView>
          )}
        </View>

        {/* Dashboard Preview */}
        {config && (
          <DashboardPreview
            config={config}
            isVisible={previewVisible}
            onToggle={() => setPreviewVisible(!previewVisible)}
            position="right"
          />
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        {activeTab === 'json' && (
          <TouchableOpacity style={styles.formatButton} onPress={formatJson} disabled={saving}>
            <Text style={styles.formatButtonText}>Format JSON</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.reloadButton} onPress={loadConfigurations} disabled={saving}>
          <Text style={styles.reloadButtonText}>⟳ Reload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={activeTab === 'css' ? saveCssConfig : saveJsonConfig}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : activeTab === 'builder' ? 'Save Config' : `Save ${activeTab.toUpperCase()}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={refreshDashboard} disabled={saving}>
          <Text style={styles.refreshButtonText}>↻ Refresh Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8BA3CC',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
    backgroundColor: '#0D1220',
  },
  headerContent: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  previewToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00D9FF',
    borderRadius: 6,
  },
  previewToggleButtonText: {
    color: '#0A0E1A',
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D9FF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8BA3CC',
  },
  customBadge: {
    color: '#00FFA3',
    fontWeight: '600',
  },
  defaultBadge: {
    color: '#FFB800',
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  backButtonText: {
    color: '#00D9FF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#0D1220',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00D9FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A6B8C',
  },
  activeTabText: {
    color: '#00D9FF',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  editorArea: {
    flex: 1,
    minWidth: 0,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  editorWrapper: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#8BA3CC',
    fontSize: 14,
    textAlign: 'center',
  },
  fallbackEditor: {
    backgroundColor: '#0D1220',
    borderWidth: 1,
    borderColor: '#2A3F5F',
    borderRadius: 8,
    padding: 16,
    color: '#E8F0FF',
    fontSize: 12,
    fontFamily: 'monospace',
    minHeight: 500,
    textAlignVertical: 'top',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A3F5F',
    backgroundColor: '#0D1220',
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  formatButtonText: {
    color: '#B794F6',
    fontSize: 14,
    fontWeight: '600',
  },
  reloadButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  reloadButtonText: {
    color: '#8BA3CC',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#00D9FF',
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#0A0E1A',
    fontSize: 14,
    fontWeight: '700',
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#00FFA3',
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#0A0E1A',
    fontSize: 14,
    fontWeight: '700',
  },
});
