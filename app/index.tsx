import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [systemInfo, setSystemInfo] = useState({
    platform: Platform.OS,
    version: Platform.Version,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🥧 piDash</Text>
        <Text style={styles.subtitle}>Raspberry Pi Dashboard</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Time Display */}
        <View style={styles.card}>
          <Text style={styles.time}>{formatTime(time)}</Text>
          <Text style={styles.date}>{formatDate(time)}</Text>
        </View>

        {/* System Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>{systemInfo.platform}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, styles.statusOnline]}>● Online</Text>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>✨ Dashboard Ready!</Text>
          <Text style={styles.welcomeText}>
            Your piDash is successfully running. This is a starter dashboard that you can customize with JSON configuration.
          </Text>
          <View style={styles.instructions}>
            <Text style={styles.instructionItem}>📊 Add charts and visualizations</Text>
            <Text style={styles.instructionItem}>🔄 Configure auto-refresh intervals</Text>
            <Text style={styles.instructionItem}>🎨 Customize with JSON configs</Text>
            <Text style={styles.instructionItem}>📱 Works on web and mobile</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          piDash v0.1.0 | Build: {new Date().toISOString().split('T')[0]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  time: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  date: {
    fontSize: 18,
    color: '#9ca3af',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  statusOnline: {
    color: '#10b981',
  },
  welcomeCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9ca3af',
    lineHeight: 24,
    marginBottom: 20,
  },
  instructions: {
    gap: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
