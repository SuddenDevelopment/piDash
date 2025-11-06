import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Platform } from 'react-native';

const API_BASE_URL = 'http://localhost:3001';

interface ImageData {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface TextOverlay {
  id: string;
  type: 'text';
  text: string;
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: string;
    padding: number;
    bg: string;
    borderRadius: string;
    animation: string;
    opacity: number;
    marginBottom?: number;
  };
}

interface ImageOverlayEditorProps {
  pageId: string;
  config: any;
  onChange: (pageId: string, updates: any) => void;
}

export function ImageOverlayEditor({ pageId, config, onChange }: ImageOverlayEditorProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const page = config.pages.find((p: any) => p.id === pageId);
  const imageContainer = page?.panels?.find((p: any) => p.type === 'container');
  const currentBackgroundImage = imageContainer?.style?.backgroundImage || '';
  const currentBackgroundSize = imageContainer?.style?.backgroundSize || 'contain';
  const textOverlays = imageContainer?.children?.filter((c: any) => c.type === 'text') || [];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/images`);
      const data = await response.json();

      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: any) => {
    if (Platform.OS !== 'web') return;

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await loadImages();
        setSelectedImage(data.image.url);
        updateBackgroundImage(data.image.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const updateBackgroundImage = (imageUrl: string) => {
    const updatedPanels = page.panels.map((panel: any) => {
      if (panel.type === 'container') {
        return {
          ...panel,
          flex: 1,
          style: {
            ...panel.style,
            backgroundImage: `url('${imageUrl}')`,
          },
        };
      }
      return panel;
    });

    onChange(pageId, { panels: updatedPanels });
  };

  const updateBackgroundSize = (size: string) => {
    const updatedPanels = page.panels.map((panel: any) => {
      if (panel.type === 'container') {
        return {
          ...panel,
          flex: 1,
          style: {
            ...panel.style,
            backgroundSize: size,
          },
        };
      }
      return panel;
    });

    onChange(pageId, { panels: updatedPanels });
  };

  const updateTextOverlay = (overlayId: string, updates: any) => {
    const updatedPanels = page.panels.map((panel: any) => {
      if (panel.type === 'container') {
        return {
          ...panel,
          children: panel.children.map((child: any) => {
            if (child.id === overlayId) {
              return {
                ...child,
                ...updates,
                style: {
                  ...child.style,
                  ...updates.style,
                },
              };
            }
            return child;
          }),
        };
      }
      return panel;
    });

    onChange(pageId, { panels: updatedPanels });
  };

  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `overlay-text-${Date.now()}`,
      type: 'text',
      text: 'New Text Overlay',
      style: {
        fontSize: '$2xl',
        fontWeight: 'bold',
        color: '$text',
        textAlign: 'center',
        padding: 24,
        bg: 'rgba(10, 14, 26, 0.8)',
        borderRadius: '$md',
        animation: 'fadeIn 1s ease-in 2s forwards',
        opacity: 0,
      },
    };

    const updatedPanels = page.panels.map((panel: any) => {
      if (panel.type === 'container') {
        return {
          ...panel,
          children: [...(panel.children || []), newOverlay],
        };
      }
      return panel;
    });

    onChange(pageId, { panels: updatedPanels });
  };

  const removeTextOverlay = (overlayId: string) => {
    const updatedPanels = page.panels.map((panel: any) => {
      if (panel.type === 'container') {
        return {
          ...panel,
          children: panel.children.filter((child: any) => child.id !== overlayId),
        };
      }
      return panel;
    });

    onChange(pageId, { panels: updatedPanels });
  };

  const parseDelay = (animation: string): number => {
    const match = animation.match(/(\d+\.?\d*)s\s+forwards/);
    return match ? parseFloat(match[1]) : 2;
  };

  const updateDelay = (overlayId: string, delay: number) => {
    const overlay = textOverlays.find((o: any) => o.id === overlayId);
    if (!overlay) return;

    const baseAnimation = 'fadeIn 1s ease-in';
    const newAnimation = `${baseAnimation} ${delay}s forwards`;

    updateTextOverlay(overlayId, {
      style: {
        animation: newAnimation,
      },
    });
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Image upload is only available in web browser
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Background Image</Text>

        {/* Upload Button */}
        <View style={styles.uploadSection}>
          <label htmlFor="image-upload" style={styles.uploadLabel}>
            <View style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : '📁 Choose Image'}
              </Text>
            </View>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </View>

        {/* Image Grid */}
        {loading ? (
          <Text style={styles.loadingText}>Loading images...</Text>
        ) : images.length === 0 ? (
          <Text style={styles.emptyText}>No images uploaded yet</Text>
        ) : (
          <View style={styles.imageGrid}>
            {images.map((img) => (
              <TouchableOpacity
                key={img.filename}
                style={[
                  styles.imageCard,
                  currentBackgroundImage.includes(img.filename) && styles.imageCardSelected,
                ]}
                onPress={() => updateBackgroundImage(img.url)}
              >
                <Image
                  source={{ uri: img.url }}
                  style={styles.imageThumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.imageFilename} numberOfLines={1}>
                  {img.filename}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Background Size */}
        <View style={styles.row}>
          <Text style={styles.label}>Fit Mode:</Text>
          <View style={styles.buttonGroup}>
            {['contain', 'cover', '100% 100%'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  currentBackgroundSize === size && styles.optionButtonActive,
                ]}
                onPress={() => updateBackgroundSize(size)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    currentBackgroundSize === size && styles.optionButtonTextActive,
                  ]}
                >
                  {size === '100% 100%' ? 'Stretch' : size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Text Overlays */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Text Overlays</Text>
          <TouchableOpacity style={styles.addButton} onPress={addTextOverlay}>
            <Text style={styles.addButtonText}>+ Add Text</Text>
          </TouchableOpacity>
        </View>

        {textOverlays.length === 0 ? (
          <Text style={styles.emptyText}>No text overlays. Click "Add Text" to create one.</Text>
        ) : (
          textOverlays.map((overlay: any, index: number) => (
            <View key={overlay.id} style={styles.overlayCard}>
              <View style={styles.overlayHeader}>
                <Text style={styles.overlayTitle}>Text Overlay {index + 1}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeTextOverlay(overlay.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Text:</Text>
                <TextInput
                  style={styles.textInput}
                  value={overlay.text}
                  onChangeText={(text) => updateTextOverlay(overlay.id, { text })}
                  placeholder="Enter text..."
                  placeholderTextColor="#666"
                  multiline
                />
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Delay (seconds):</Text>
                  <TextInput
                    style={styles.input}
                    value={String(parseDelay(overlay.style.animation))}
                    onChangeText={(value) => {
                      const delay = parseFloat(value) || 0;
                      updateDelay(overlay.id, delay);
                    }}
                    keyboardType="numeric"
                    placeholder="2"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Font Size:</Text>
                  <TextInput
                    style={styles.input}
                    value={overlay.style.fontSize.replace('$', '')}
                    onChangeText={(value) =>
                      updateTextOverlay(overlay.id, {
                        style: { fontSize: value.startsWith('$') ? value : `$${value}` },
                      })
                    }
                    placeholder="2xl"
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#1A2338',
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E8F0FF',
    marginBottom: 12,
  },
  uploadSection: {
    marginBottom: 16,
  },
  uploadLabel: {
    cursor: 'pointer',
  } as any,
  uploadButton: {
    backgroundColor: '#00D9FF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#0A0E1A',
    fontWeight: '600',
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  imageCard: {
    width: 120,
    backgroundColor: '#131829',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imageCardSelected: {
    borderColor: '#00D9FF',
  },
  imageThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 4,
    marginBottom: 8,
  },
  imageFilename: {
    fontSize: 11,
    color: '#8BA3CC',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#8BA3CC',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0D1220',
    borderWidth: 1,
    borderColor: '#2A3F5F',
    borderRadius: 4,
    padding: 8,
    color: '#E8F0FF',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: '#0D1220',
    borderWidth: 1,
    borderColor: '#2A3F5F',
    borderRadius: 4,
    padding: 12,
    color: '#E8F0FF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#0D1220',
    borderWidth: 1,
    borderColor: '#2A3F5F',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#00D9FF',
    borderColor: '#00D9FF',
  },
  optionButtonText: {
    color: '#8BA3CC',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  optionButtonTextActive: {
    color: '#0A0E1A',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#00FFA3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#0A0E1A',
    fontWeight: '600',
    fontSize: 14,
  },
  overlayCard: {
    backgroundColor: '#0D1220',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E8F0FF',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  loadingText: {
    color: '#8BA3CC',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#5A6B8C',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#FF3366',
    textAlign: 'center',
    padding: 20,
  },
});
