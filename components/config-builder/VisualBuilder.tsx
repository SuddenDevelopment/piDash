import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { DashboardConfig, Page, Panel, LayoutConfig, PanelType } from '@/types/dashboard-schema';

type VisualBuilderProps = {
  config: DashboardConfig;
  onChange: (config: DashboardConfig) => void;
};

export function VisualBuilder({ config, onChange }: VisualBuilderProps) {
  const [selectedPage, setSelectedPage] = useState<string | null>(
    config.pages.length > 0 ? config.pages[0].id : null
  );

  const currentPage = config.pages.find((p) => p.id === selectedPage);

  const addNewPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage: Page = {
      id: newPageId,
      name: 'New Page',
      layout: {
        type: 'flex',
        direction: 'column',
        gap: 16,
        padding: 16,
      },
      panels: [],
    };

    onChange({
      ...config,
      pages: [...config.pages, newPage],
    });
    setSelectedPage(newPageId);
  };

  const deletePage = (pageId: string) => {
    if (config.pages.length === 1) {
      Alert.alert('Error', 'Cannot delete the last page');
      return;
    }

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this page?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const newPages = config.pages.filter((p) => p.id !== pageId);
          onChange({
            ...config,
            pages: newPages,
          });
          setSelectedPage(newPages[0]?.id || null);
        },
      },
    ]);
  };

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    onChange({
      ...config,
      pages: config.pages.map((p) => (p.id === pageId ? { ...p, ...updates } : p)),
    });
  };

  const updateLayout = (pageId: string, layout: Partial<LayoutConfig>) => {
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;

    updatePage(pageId, {
      layout: { ...page.layout, ...layout },
    });
  };

  const addPanel = (pageId: string) => {
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;

    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      type: 'text',
      text: 'New Panel',
      style: {
        padding: 16,
        bg: '$backgroundLight',
        borderRadius: '$md',
      },
    };

    updatePage(pageId, {
      panels: [...page.panels, newPanel],
    });
  };

  const deletePanel = (pageId: string, panelId: string) => {
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;

    updatePage(pageId, {
      panels: page.panels.filter((p) => p.id !== panelId),
    });
  };

  const updatePanel = (pageId: string, panelId: string, updates: Partial<Panel>) => {
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;

    updatePage(pageId, {
      panels: page.panels.map((p) => (p.id === panelId ? { ...p, ...updates } : p)),
    });
  };

  if (!currentPage) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No pages found</Text>
        <TouchableOpacity style={styles.addButton} onPress={addNewPage}>
          <Text style={styles.addButtonText}>+ Create First Page</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Page Selector */}
      <View style={styles.pageSelector}>
        <Text style={styles.sectionTitle}>Pages</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pageList}>
          {config.pages.map((page) => (
            <TouchableOpacity
              key={page.id}
              style={[styles.pageTab, selectedPage === page.id && styles.pageTabActive]}
              onPress={() => setSelectedPage(page.id)}
            >
              <Text style={[styles.pageTabText, selectedPage === page.id && styles.pageTabTextActive]}>
                {page.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPageButton} onPress={addNewPage}>
            <Text style={styles.addPageButtonText}>+ Add Page</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {/* Page Properties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Page Properties</Text>
          <View style={styles.formRow}>
            <Text style={styles.label}>Page Name</Text>
            <TextInput
              style={styles.input}
              value={currentPage.name}
              onChangeText={(text) => updatePage(currentPage.id, { name: text })}
              placeholder="Page name"
              placeholderTextColor="#5A6B8C"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Page ID</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={currentPage.id}
              editable={false}
              placeholderTextColor="#5A6B8C"
            />
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deletePage(currentPage.id)}
            disabled={config.pages.length === 1}
          >
            <Text style={styles.deleteButtonText}>Delete Page</Text>
          </TouchableOpacity>
        </View>

        {/* Layout Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layout Configuration</Text>

          <View style={styles.formRow}>
            <Text style={styles.label}>Layout Type</Text>
            <View style={styles.buttonGroup}>
              {['flex', 'grid', 'absolute'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.buttonGroupItem,
                    currentPage.layout.type === type && styles.buttonGroupItemActive,
                  ]}
                  onPress={() => updateLayout(currentPage.id, { type: type as any })}
                >
                  <Text
                    style={[
                      styles.buttonGroupText,
                      currentPage.layout.type === type && styles.buttonGroupTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {currentPage.layout.type === 'flex' && (
            <View style={styles.formRow}>
              <Text style={styles.label}>Direction</Text>
              <View style={styles.buttonGroup}>
                {['row', 'column'].map((direction) => (
                  <TouchableOpacity
                    key={direction}
                    style={[
                      styles.buttonGroupItem,
                      currentPage.layout.direction === direction && styles.buttonGroupItemActive,
                    ]}
                    onPress={() => updateLayout(currentPage.id, { direction: direction as any })}
                  >
                    <Text
                      style={[
                        styles.buttonGroupText,
                        currentPage.layout.direction === direction && styles.buttonGroupTextActive,
                      ]}
                    >
                      {direction}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {currentPage.layout.type === 'grid' && (
            <>
              <View style={styles.formRow}>
                <Text style={styles.label}>Columns</Text>
                <TextInput
                  style={styles.input}
                  value={String(currentPage.layout.columns || 2)}
                  onChangeText={(text) => updateLayout(currentPage.id, { columns: parseInt(text) || 2 })}
                  keyboardType="number-pad"
                  placeholder="2"
                  placeholderTextColor="#5A6B8C"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Rows</Text>
                <TextInput
                  style={styles.input}
                  value={String(currentPage.layout.rows || 2)}
                  onChangeText={(text) => updateLayout(currentPage.id, { rows: parseInt(text) || 2 })}
                  keyboardType="number-pad"
                  placeholder="2"
                  placeholderTextColor="#5A6B8C"
                />
              </View>
            </>
          )}

          <View style={styles.formRow}>
            <Text style={styles.label}>Gap (px)</Text>
            <TextInput
              style={styles.input}
              value={String(currentPage.layout.gap || 0)}
              onChangeText={(text) => updateLayout(currentPage.id, { gap: parseInt(text) || 0 })}
              keyboardType="number-pad"
              placeholder="16"
              placeholderTextColor="#5A6B8C"
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Padding (px)</Text>
            <TextInput
              style={styles.input}
              value={String(currentPage.layout.padding || 0)}
              onChangeText={(text) => updateLayout(currentPage.id, { padding: parseInt(text) || 0 })}
              keyboardType="number-pad"
              placeholder="16"
              placeholderTextColor="#5A6B8C"
            />
          </View>

          {currentPage.layout.type === 'flex' && (
            <>
              <View style={styles.formRow}>
                <Text style={styles.label}>Justify Content</Text>
                <View style={styles.dropdown}>
                  {['flex-start', 'center', 'flex-end', 'space-between', 'space-around'].map((justify) => (
                    <TouchableOpacity
                      key={justify}
                      style={[
                        styles.dropdownItem,
                        currentPage.layout.justify === justify && styles.dropdownItemActive,
                      ]}
                      onPress={() => updateLayout(currentPage.id, { justify: justify as any })}
                    >
                      <Text style={styles.dropdownText}>{justify}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Align Items</Text>
                <View style={styles.dropdown}>
                  {['flex-start', 'center', 'flex-end', 'stretch'].map((align) => (
                    <TouchableOpacity
                      key={align}
                      style={[
                        styles.dropdownItem,
                        currentPage.layout.align === align && styles.dropdownItemActive,
                      ]}
                      onPress={() => updateLayout(currentPage.id, { align: align as any })}
                    >
                      <Text style={styles.dropdownText}>{align}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Panels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Panels ({currentPage.panels.length})</Text>
            <TouchableOpacity style={styles.addPanelButton} onPress={() => addPanel(currentPage.id)}>
              <Text style={styles.addPanelButtonText}>+ Add Panel</Text>
            </TouchableOpacity>
          </View>

          {currentPage.panels.map((panel, index) => (
            <View key={panel.id} style={styles.panelCard}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>
                  Panel {index + 1}: {panel.type}
                </Text>
                <TouchableOpacity onPress={() => deletePanel(currentPage.id, panel.id)}>
                  <Text style={styles.deletePanelText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Panel Type</Text>
                <View style={styles.buttonGroup}>
                  {['text', 'container', 'metric', 'chart', 'table', 'canvas'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.buttonGroupItem,
                        styles.buttonGroupItemSmall,
                        panel.type === type && styles.buttonGroupItemActive,
                      ]}
                      onPress={() => updatePanel(currentPage.id, panel.id, { type: type as PanelType })}
                    >
                      <Text
                        style={[
                          styles.buttonGroupText,
                          styles.buttonGroupTextSmall,
                          panel.type === type && styles.buttonGroupTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Panel ID</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={panel.id}
                  editable={false}
                  placeholderTextColor="#5A6B8C"
                />
              </View>

              {panel.type === 'text' && (
                <View style={styles.formRow}>
                  <Text style={styles.label}>Text Content</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={(panel as any).text || ''}
                    onChangeText={(text) => updatePanel(currentPage.id, panel.id, { text } as any)}
                    placeholder="Enter text content"
                    placeholderTextColor="#5A6B8C"
                    multiline
                  />
                </View>
              )}

              {panel.type === 'metric' && (
                <>
                  <View style={styles.formRow}>
                    <Text style={styles.label}>Data Source</Text>
                    <TextInput
                      style={styles.input}
                      value={(panel as any).value?.source || ''}
                      onChangeText={(source) =>
                        updatePanel(currentPage.id, panel.id, {
                          value: { ...(panel as any).value, source },
                        } as any)
                      }
                      placeholder="e.g., mock://data"
                      placeholderTextColor="#5A6B8C"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.label}>Data Path</Text>
                    <TextInput
                      style={styles.input}
                      value={(panel as any).value?.path || ''}
                      onChangeText={(path) =>
                        updatePanel(currentPage.id, panel.id, {
                          value: { ...(panel as any).value, path },
                        } as any)
                      }
                      placeholder="e.g., cpu"
                      placeholderTextColor="#5A6B8C"
                    />
                  </View>
                </>
              )}

              {panel.type === 'chart' && (
                <View style={styles.formRow}>
                  <Text style={styles.label}>Chart Type</Text>
                  <View style={styles.buttonGroup}>
                    {['line', 'bar', 'area', 'pie'].map((chartType) => (
                      <TouchableOpacity
                        key={chartType}
                        style={[
                          styles.buttonGroupItem,
                          styles.buttonGroupItemSmall,
                          (panel as any).chartType === chartType && styles.buttonGroupItemActive,
                        ]}
                        onPress={() => updatePanel(currentPage.id, panel.id, { chartType } as any)}
                      >
                        <Text
                          style={[
                            styles.buttonGroupText,
                            styles.buttonGroupTextSmall,
                            (panel as any).chartType === chartType && styles.buttonGroupTextActive,
                          ]}
                        >
                          {chartType}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {panel.type === 'canvas' && (
                <View style={styles.formRow}>
                  <Text style={styles.label}>Canvas Type</Text>
                  <View style={styles.buttonGroup}>
                    {['r3f', 'webgl', '2d'].map((canvasType) => (
                      <TouchableOpacity
                        key={canvasType}
                        style={[
                          styles.buttonGroupItem,
                          (panel as any).canvasType === canvasType && styles.buttonGroupItemActive,
                        ]}
                        onPress={() => updatePanel(currentPage.id, panel.id, { canvasType } as any)}
                      >
                        <Text
                          style={[
                            styles.buttonGroupText,
                            (panel as any).canvasType === canvasType && styles.buttonGroupTextActive,
                          ]}
                        >
                          {canvasType}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.formRow}>
                <Text style={styles.label}>Flex</Text>
                <TextInput
                  style={styles.input}
                  value={String(panel.flex || '')}
                  onChangeText={(text) =>
                    updatePanel(currentPage.id, panel.id, { flex: text ? parseInt(text) : undefined })
                  }
                  keyboardType="number-pad"
                  placeholder="1"
                  placeholderTextColor="#5A6B8C"
                />
              </View>
            </View>
          ))}

          {currentPage.panels.length === 0 && (
            <View style={styles.emptyPanels}>
              <Text style={styles.emptyText}>No panels yet</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addPanel(currentPage.id)}>
                <Text style={styles.addButtonText}>+ Add First Panel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#5A6B8C',
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00D9FF',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#0A0E1A',
    fontSize: 14,
    fontWeight: '700',
  },
  pageSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
    backgroundColor: '#0D1220',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pageList: {
    flexDirection: 'row',
    marginTop: 8,
  },
  pageTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  pageTabActive: {
    backgroundColor: '#00D9FF',
    borderColor: '#00D9FF',
  },
  pageTabText: {
    fontSize: 14,
    color: '#8BA3CC',
    fontWeight: '600',
  },
  pageTabTextActive: {
    color: '#0A0E1A',
  },
  addPageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00D9FF',
    borderStyle: 'dashed',
  },
  addPageButtonText: {
    fontSize: 14,
    color: '#00D9FF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#0D1220',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D9FF',
    marginBottom: 12,
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8F0FF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#131829',
    borderWidth: 1,
    borderColor: '#2A3F5F',
    borderRadius: 6,
    padding: 12,
    color: '#E8F0FF',
    fontSize: 14,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonGroupItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  buttonGroupItemSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonGroupItemActive: {
    backgroundColor: '#00D9FF',
    borderColor: '#00D9FF',
  },
  buttonGroupText: {
    fontSize: 14,
    color: '#8BA3CC',
    fontWeight: '600',
  },
  buttonGroupTextSmall: {
    fontSize: 12,
  },
  buttonGroupTextActive: {
    color: '#0A0E1A',
  },
  dropdown: {
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3F5F',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
  },
  dropdownItemActive: {
    backgroundColor: '#1A2338',
  },
  dropdownText: {
    fontSize: 14,
    color: '#E8F0FF',
  },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: '#FF3366',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addPanelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#131829',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00D9FF',
  },
  addPanelButtonText: {
    fontSize: 13,
    color: '#00D9FF',
    fontWeight: '600',
  },
  panelCard: {
    marginBottom: 16,
    backgroundColor: '#131829',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3F5F',
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B794F6',
  },
  deletePanelText: {
    fontSize: 18,
    color: '#FF3366',
    fontWeight: 'bold',
  },
  emptyPanels: {
    padding: 40,
    alignItems: 'center',
  },
});
