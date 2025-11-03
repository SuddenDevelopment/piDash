import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Box, Text, Card, HStack, VStack } from '../components/ui';
import { DISPLAY_CONFIG, scale } from '../config/display';
import { VERSION_INFO } from '../config/version';

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

  // Auto-reload when new version is deployed
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const currentBuildNumber = VERSION_INFO.buildNumber;

    const checkForUpdates = async () => {
      try {
        const response = await fetch('/api/version');
        const serverVersion = await response.json();

        // If server has newer build, reload the page
        if (serverVersion.buildNumber > currentBuildNumber) {
          console.log(`New version available: ${serverVersion.version} (current: ${VERSION_INFO.version})`);
          window.location.reload();
        }
      } catch (error) {
        // Silently fail - server might be restarting
        console.debug('Version check failed:', error.message);
      }
    };

    // Check every 10 seconds
    const updateChecker = setInterval(checkForUpdates, 10000);

    return () => clearInterval(updateChecker);
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
    <Box
      sx={{
        width: DISPLAY_CONFIG.width,
        height: DISPLAY_CONFIG.height,
        bg: '$background',
        overflow: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      <StatusBar style="light" hidden />

      {/* Thin Header */}
      <HStack
        sx={{
          h: 30,
          px: scale(12),
          borderBottomWidth: 1,
          borderBottomColor: '$backgroundLight',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text sx={{ fontSize: scale(9), color: '$textMuted', letterSpacing: 0.5 }}>
          piDash v0.1.0
        </Text>
        <Text sx={{ fontSize: scale(9), color: '$textMuted', letterSpacing: 0.5 }}>
          {DISPLAY_CONFIG.width}×{DISPLAY_CONFIG.height}
        </Text>
        <Text sx={{ fontSize: scale(9), color: '$textMuted', letterSpacing: 0.5 }}>
          {VERSION_INFO.version}
        </Text>
      </HStack>

      {/* Main Content */}
      <VStack
        sx={{
          h: DISPLAY_CONFIG.height - 60,
          px: scale(12),
          py: scale(10),
          gap: scale(10),
        }}
      >
        {/* Time Display */}
        <Card
          sx={{
            alignItems: 'center',
            p: scale(20),
          }}
        >
          <Text
            sx={{
              fontSize: scale(56),
              fontWeight: 'bold',
              color: '$primary',
              fontVariant: ['tabular-nums'],
            }}
          >
            {formatTime(time)}
          </Text>
        </Card>

        {/* System Info */}
        <HStack sx={{ gap: scale(10) }}>
          <Card sx={{ flex: 1, alignItems: 'center', p: scale(12) }}>
            <Text
              sx={{
                fontSize: scale(9),
                color: '$textSecondary',
                mb: scale(6),
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              PLATFORM
            </Text>
            <Text sx={{ fontSize: scale(16), fontWeight: 'bold', color: '$text' }}>
              {systemInfo.platform}
            </Text>
          </Card>

          <Card sx={{ flex: 1, alignItems: 'center', p: scale(12) }}>
            <Text
              sx={{
                fontSize: scale(9),
                color: '$textSecondary',
                mb: scale(6),
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              STATUS
            </Text>
            <Text sx={{ fontSize: scale(16), fontWeight: 'bold', color: '$success' }}>
              ● Online
            </Text>
          </Card>

          <Card sx={{ flex: 1, alignItems: 'center', p: scale(12) }}>
            <Text
              sx={{
                fontSize: scale(9),
                color: '$textSecondary',
                mb: scale(6),
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              DISPLAY
            </Text>
            <Text sx={{ fontSize: scale(16), fontWeight: 'bold', color: '$text' }}>
              {DISPLAY_CONFIG.width}x{DISPLAY_CONFIG.height}
            </Text>
          </Card>
        </HStack>

        {/* Welcome Message */}
        <Card sx={{ alignItems: 'center', p: scale(16) }}>
          <Text
            sx={{ fontSize: scale(18), fontWeight: 'bold', color: '$text', mb: scale(6) }}
          >
            ✨ Dashboard Ready!
          </Text>
          <Text sx={{ fontSize: scale(12), color: '$textSecondary', textAlign: 'center' }}>
            Optimized for {DISPLAY_CONFIG.width}x{DISPLAY_CONFIG.height} display
          </Text>
        </Card>
      </VStack>

      {/* Footer */}
      <HStack
        sx={{
          h: 30,
          px: scale(12),
          borderTopWidth: 1,
          borderTopColor: '$backgroundLight',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text sx={{ fontSize: scale(10), color: '$textMuted' }}>
          piDash v0.1.0 | {DISPLAY_CONFIG.deviceType}
        </Text>
      </HStack>
    </Box>
  );
}
