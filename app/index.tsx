import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { DashboardRenderer } from '../components/dashboard/DashboardRenderer';
import { DISPLAY_CONFIG } from '../config/display';
import { API_BASE_URL } from '../config/api.config';

// Import active dashboard config (prioritizes custom, falls back to default)
// This file is generated at build time by scripts/prepare-config.js
const activeConfig = require('../config/dashboards/active-dashboard.json');

export default function Dashboard() {
  const [config, setConfig] = useState(activeConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('unknown');
  const [deploymentVersion, setDeploymentVersion] = useState<number | null>(null);

  // Load configuration from API
  useEffect(() => {
    loadConfig();
    loadInitialVersion();
  }, []);

  // Poll for deployment version changes (auto-refresh on deploy)
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewVersion();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [deploymentVersion]);

  const loadConfig = async () => {
    try {
      // Add cache-busting parameter to prevent browser caching
      const cacheBuster = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/config?_=${cacheBuster}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();

      if (data.success) {
        setConfig(data.config);
        setConfigSource(data.source);
        console.log(`Dashboard loaded from ${data.source} config`);
      }
      setLoading(false);
    } catch (error) {
      // Fallback to embedded config if API is not available
      console.log('API not available, using embedded config from build');
      setConfig(activeConfig);
      setConfigSource('embedded');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing dashboard configuration...');
    setLoading(true);
    await loadConfig();
  };

  const loadInitialVersion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/version`);
      const data = await response.json();
      if (data.success) {
        setDeploymentVersion(data.version);
        console.log('Initial deployment version:', data.version);
      }
    } catch (error) {
      console.log('Could not load initial version');
    }
  };

  const checkForNewVersion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/version`);
      const data = await response.json();

      if (data.success && deploymentVersion !== null) {
        if (data.version !== deploymentVersion) {
          console.log('New deployment detected! Refreshing...');
          console.log(`Old version: ${deploymentVersion}, New version: ${data.version}`);

          // Reload the page to get new content
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      }
    } catch (error) {
      // API not available, ignore
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Dashboard Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dashboardContainer,
          {
            width: DISPLAY_CONFIG.width,
            height: DISPLAY_CONFIG.height,
          },
        ]}
      >
        <StatusBar style="light" hidden />

        <DashboardRenderer
          config={config}
          onError={setError}
          onRefresh={handleRefresh}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  dashboardContainer: {
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
  },
});
