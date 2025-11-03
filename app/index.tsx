import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { DISPLAY_CONFIG, scale } from '../config/display';

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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />

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
            <Text style={styles.infoLabel}>PLATFORM</Text>
            <Text style={styles.infoValue}>{systemInfo.platform}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>STATUS</Text>
            <Text style={[styles.infoValue, styles.statusOnline]}>● Online</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>DISPLAY</Text>
            <Text style={styles.infoValue}>{DISPLAY_CONFIG.width}x{DISPLAY_CONFIG.height}</Text>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>✨ Dashboard Ready!</Text>
          <Text style={styles.welcomeText}>
            Optimized for {DISPLAY_CONFIG.width}x{DISPLAY_CONFIG.height} display
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          piDash v0.1.0 | {DISPLAY_CONFIG.deviceType}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: DISPLAY_CONFIG.width,
    height: DISPLAY_CONFIG.height,
    backgroundColor: '#111827',
    overflow: 'hidden', // Prevent any scrolling
    margin: 0,
    padding: 0,
  },
  header: {
    height: scale(60),
    paddingHorizontal: scale(12),
    paddingTop: scale(12),
    paddingBottom: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  subtitle: {
    fontSize: scale(11),
    color: '#9ca3af',
  },
  content: {
    height: DISPLAY_CONFIG.height - scale(60) - scale(30), // Total height minus header and footer
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    gap: scale(10),
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: scale(8),
    padding: scale(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  time: {
    fontSize: scale(48),
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: scale(4),
    fontVariant: ['tabular-nums'],
  },
  date: {
    fontSize: scale(14),
    color: '#9ca3af',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: scale(10),
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: scale(8),
    padding: scale(12),
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: scale(9),
    color: '#9ca3af',
    marginBottom: scale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  statusOnline: {
    color: '#10b981',
  },
  welcomeCard: {
    backgroundColor: '#1f2937',
    borderRadius: scale(8),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: scale(6),
  },
  welcomeText: {
    fontSize: scale(12),
    color: '#9ca3af',
    textAlign: 'center',
  },
  footer: {
    height: scale(30),
    paddingHorizontal: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: scale(10),
    color: '#6b7280',
  },
});
