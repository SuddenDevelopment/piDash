import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { DashboardRenderer } from '../components/dashboard/DashboardRenderer';
import { DISPLAY_CONFIG } from '../config/display';
import mvpTestConfig from '../config/dashboards/mvp-test.json';

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);

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
          config={mvpTestConfig as any}
          onError={setError}
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
