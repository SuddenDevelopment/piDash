/**
 * SettingsContext - Global settings management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Settings = {
  autoTransitionEnabled: boolean;
  useDemoConfig: boolean;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleAutoTransition: () => void;
  toggleConfigMode: () => void;
};

const defaultSettings: Settings = {
  autoTransitionEnabled: true,
  useDemoConfig: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = '@pidash_settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSettings(settings);
    }
  }, [settings, isLoaded]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleAutoTransition = () => {
    setSettings(prev => ({
      ...prev,
      autoTransitionEnabled: !prev.autoTransitionEnabled,
    }));
  };

  const toggleConfigMode = () => {
    setSettings(prev => ({
      ...prev,
      useDemoConfig: !prev.useDemoConfig,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleAutoTransition, toggleConfigMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
