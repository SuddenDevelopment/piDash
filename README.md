# piDash

A cross-platform dashboard application designed to run on Raspberry Pi 5" displays (kiosk mode) and mobile devices. Built with React Native Web for true write-once, deploy-anywhere capability with JSON-driven dynamic configuration.

## Overview

piDash is a flexible, general-purpose dashboard for small screens - always-on monitoring with rotating, dynamic content. The architecture supports completely dynamic updates via JSON configuration, enabling real-time UI changes without app redeployment.

## Architecture

### Recommended Tech Stack

```
┌─────────────────────────────────────────┐
│   JSON Configuration (Server/Local)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Dynamic UI Renderer (Server-Driven)   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼────────┐
│  Gluestack UI  │  │  Victory Charts │
│   Components   │  │   (Cross-plat)  │
└───────┬────────┘  └────────┬────────┘
        │                    │
        └─────────┬──────────┘
                  │
┌─────────────────▼───────────────────────┐
│        React Native Web                  │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼────────┐
│  Mobile App    │  │  Pi Kiosk (Web) │
│  (iOS/Android) │  │  (Chromium)     │
└────────────────┘  └─────────────────┘
```

### Core Technologies

- **Framework:** React Native Web (unified codebase for web + mobile)
- **UI Components:** Gluestack UI (30+ accessible components)
- **Data Visualization:** Victory (identical API for React & React Native)
- **Configuration:** Server-Driven UI pattern with JSON
- **Styling:** NativeWind (Tailwind CSS for React Native)

---

## UI Component Library Options

### 1. Gluestack UI (Recommended)

**Website:** https://gluestack.io/

**Key Features:**
- Modern successor to NativeBase (deprecated 2023)
- 30+ pre-built, customizable components
- WCAG-compliant accessibility (ARIA labels, keyboard navigation)
- Works seamlessly on React Native & Web
- Tailwind CSS integration via NativeWind
- Strong TypeScript support

**Best For:** Enterprise dashboards, data-heavy interfaces, design systems

**Strengths:**
- Accessibility-first components
- Excellent documentation
- Active maintenance
- Production-ready out of the box

**Trade-offs:**
- Extensive component library may overwhelm simple projects
- Theme configuration requires familiarity with design tokens

### 2. Tamagui (Performance-Focused Alternative)

**Key Features:**
- Exceptional performance (partial evaluation, tree flattening, dead-code elimination)
- Universal animations across web & mobile
- Responsive design tokens built-in
- Style once, run everywhere

**Best For:** Performance-critical dashboards, custom component needs

**Trade-offs:**
- Steeper learning curve
- Fewer pre-built components
- Not ideal for beginners

### 3. React Native Paper (Material Design)

**Key Features:**
- Material Design components
- Mature, stable library
- Cross-platform support
- Good documentation

**Best For:** Material Design aesthetic, simpler projects

---

## Data Visualization & Charts

### 1. Victory (Recommended)

**Website:** https://nearform.com/open-source/victory/

**Key Features:**
- **Identical API for React & React Native** (truly cross-platform)
- Composable, declarative components
- Interactive visualizations
- Victory Native XL: new high-performance version powered by D3, Skia, and Reanimated

**Chart Types:**
- Line Charts
- Bar Charts
- Area Charts
- Pie Charts
- Scatter Plots
- Candlestick Charts
- Combined Charts

**Strengths:**
- Consistent behavior across web and mobile
- Fully customizable and overridable
- Strong community support
- Excellent documentation

**Example:**
```jsx
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

<VictoryChart theme={VictoryTheme.material}>
  <VictoryBar data={data} />
</VictoryChart>
```

### 2. React Native Gifted Charts (Simpler Alternative)

**Key Features:**
- Recently updated (April 2025)
- Works on Expo, native iOS/Android, and web
- Beautiful animations
- Simpler API than Victory

**Chart Types:**
- Bar, Line, Area, Pie, Stacked charts

**Best For:** Simpler visualization needs, beginner-friendly projects

### 3. Other Notable Options

- **React Native Chart Kit:** Simple plug-and-play charts
- **React Native Charts Wrapper:** Native charting (MPAndroidChart, iOS Charts)
- **React Native Echarts Wrapper:** Apache ECharts integration

**Note:** Avoid `react-native-svg-charts` - unmaintained for 6+ years with dependency conflicts.

---

## JSON-Driven Dynamic UI

### Server-Driven UI Pattern

The application uses a Server-Driven UI architecture where the interface is defined by JSON configuration files, enabling real-time updates without app redeployment.

### Benefits

✅ **Real-time updates** without app store approval
✅ **A/B testing** and personalization for different users
✅ **Low-code/no-code** interface modifications
✅ **Dynamic theming** and customization
✅ **Remote configuration** updates
✅ **Team collaboration** - non-engineers can modify UI

### Implementation Approach

**1. Component Mapping System**
```javascript
// Map JSON types to React components
const componentMap = {
  'view': View,
  'text': Text,
  'card': Card,
  'chart': VictoryChart,
  'lineChart': VictoryLine,
  'barChart': VictoryBar,
  'button': Button,
  // ... additional mappings
};
```

**2. JSON Configuration Schema**
```json
{
  "screens": [
    {
      "id": "dashboard-1",
      "type": "view",
      "style": { "flex": 1, "padding": 16 },
      "children": [
        {
          "type": "text",
          "props": { "text": "System Monitor" },
          "style": { "fontSize": 24, "fontWeight": "bold" }
        },
        {
          "type": "lineChart",
          "props": {
            "data": "{{api.systemMetrics}}",
            "xKey": "time",
            "yKey": "cpu"
          }
        }
      ]
    }
  ]
}
```

**3. Recursive Renderer**
```javascript
function DynamicComponent({ config }) {
  const Component = componentMap[config.type];

  if (!Component) {
    console.warn(`Unknown component type: ${config.type}`);
    return null;
  }

  return (
    <Component {...config.props} style={config.style}>
      {config.children?.map((child, index) => (
        <DynamicComponent key={index} config={child} />
      ))}
    </Component>
  );
}
```

### Real-World Example

ClearTax built their entire mutual fund app (Black) using this pattern with React Native, enabling high-conversion screens that anyone on the team could modify without engineering help.

### Key Considerations

- **Validation Layer:** Validate JSON schemas before rendering
- **Error Boundaries:** Graceful fallback for invalid configurations
- **Type Safety:** TypeScript interfaces for configuration objects
- **Caching:** Cache configurations locally for offline support
- **Versioning:** Support schema versioning for backwards compatibility

---

## Raspberry Pi Kiosk Setup

### Hardware Target
- Raspberry Pi (3B+, 4, or 5 recommended)
- 5" touchscreen display
- Stable power supply
- WiFi or ethernet connection

### Chromium Kiosk Mode

**Launch Command:**
```bash
@chromium-browser --kiosk --incognito http://localhost:3000 \
  --noerrdialogs \
  --disable-infobars \
  --ignore-gpu-blacklist \
  --use-gl=egl \
  --enable-accelerated-2d-canvas
```

**Autostart Configuration:**
```bash
# Edit ~/.config/lxsession/LXDE-pi/autostart
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --incognito http://localhost:3000 --noerrdialogs --disable-infobars
```

### Local Hosting Architecture

**Why Local Hosting:**
- Offline capability for unstable internet connections
- Custom error screens when connectivity drops
- Faster response times
- Reduced bandwidth usage

**Setup:**
```bash
# Node.js + Express server on Pi
npm install express
# Serve React Native Web bundle
node server.js
```

### Reliability Best Practices

**1. WiFi Monitoring Cronjob**
```bash
# Check WiFi every 5 minutes, reconnect if down
*/5 * * * * /home/pi/scripts/check_wifi.sh
```

**2. Auto-Restart on Crash**
```bash
# Supervisor or systemd service
[Service]
Restart=always
RestartSec=10
```

**3. Watchdog Timer**
```bash
# Hardware watchdog for complete system hang
dtparam=watchdog=on
```

**4. Performance Optimization**
- Disable unnecessary services
- Use hardware acceleration
- Optimize bundle size
- Enable service worker for caching

### Network Considerations

⚠️ **Warning:** WiFi can be unreliable on Raspberry Pi. Recommendations:
- Use ethernet when possible
- Implement automatic reconnection
- Set up periodic reboot schedule (e.g., 3am daily)
- Monitor connection quality
- Have offline fallback content

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (for React Native Web)
- Git

### Installation

**1. Initialize Project**
```bash
npx create-expo-app@latest piDash --template blank
cd piDash
```

**2. Add Gluestack UI**
```bash
npx gluestack-ui@latest init
```

**3. Add Victory Charts**
```bash
npm install victory-native victory
npm install react-native-svg  # Required peer dependency
```

**4. Add React Native Web Support**
```bash
npx expo install react-native-web react-dom
```

**5. Add NativeWind (Tailwind CSS)**
```bash
npm install nativewind
npm install --save-dev tailwindcss
```

### Project Structure

```
piDash/
├── app/                      # App screens and navigation
├── components/
│   ├── dynamic/             # JSON-driven dynamic components
│   │   ├── DynamicRenderer.tsx
│   │   └── componentMap.ts
│   ├── charts/              # Victory chart wrappers
│   ├── dashboard/           # Dashboard-specific components
│   └── ui/                  # Gluestack UI components
├── config/
│   ├── dashboards/          # JSON dashboard configurations
│   │   ├── system-monitor.json
│   │   ├── weather.json
│   │   └── calendar.json
│   └── theme.ts             # Theme configuration
├── hooks/                   # Custom React hooks
├── services/
│   ├── api.ts              # API integration
│   └── configLoader.ts     # JSON config loader
├── utils/
│   ├── validation.ts       # JSON schema validation
│   └── logger.ts           # Error logging
├── server/                  # Express server for Pi
│   └── index.js
└── README.md
```

### Development

**Run on Web (Development):**
```bash
npm start
# Press 'w' for web
```

**Run on Mobile:**
```bash
# iOS
npm run ios

# Android
npm run android
```

**Build for Production:**
```bash
# Web build for Raspberry Pi
npm run build:web

# Mobile builds
eas build --platform ios
eas build --platform android
```

---

## State Management

### Recommended Options

**1. Zustand (Lightweight, Recommended)**
```bash
npm install zustand
```
- Simple API
- No boilerplate
- TypeScript support
- Excellent performance

**2. Jotai (Atomic State)**
```bash
npm install jotai
```
- Bottom-up approach
- Minimal API
- Great for dynamic UIs

**3. React Query (Server State)**
```bash
npm install @tanstack/react-query
```
- Perfect for API data
- Automatic caching
- Background updates

### Local Persistence

```bash
npm install @react-native-async-storage/async-storage
```
- Store configurations locally
- Offline support
- Cache dashboard data

---

## Performance Optimization

### Mobile & Web

- **List Rendering:** Use FlatList or FlashList for long lists
- **Component Memoization:** React.memo, useMemo, useCallback
- **Lazy Loading:** React.lazy for heavy components
- **Code Splitting:** Dynamic imports for large features
- **Image Optimization:** Compressed assets, lazy loading
- **Bundle Analysis:** Analyze and reduce bundle size

### Raspberry Pi Specific

- **Bundle Size:** Critical for Pi - aim for <1MB initial load
- **GPU Acceleration:** Use CSS transforms over position changes
- **Memory Management:** Clean up intervals and subscriptions
- **Debouncing:** Limit re-renders for real-time data
- **Service Worker:** Cache static assets aggressively

---

## Styling Approach

### NativeWind (Tailwind CSS)

```jsx
import { View, Text } from 'react-native';

export default function Dashboard() {
  return (
    <View className="flex-1 p-4 bg-gray-900">
      <Text className="text-2xl font-bold text-white mb-4">
        System Monitor
      </Text>
    </View>
  );
}
```

### Theme Tokens

```javascript
// config/theme.ts
export const theme = {
  colors: {
    primary: '#3B82F6',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  breakpoints: {
    mobile: 0,
    pi: 480,      // 5" display
    tablet: 768,
  },
};
```

### Responsive Design

```jsx
import { useWindowDimensions } from 'react-native';

function ResponsiveComponent() {
  const { width } = useWindowDimensions();
  const isPiDisplay = width <= 480;

  return (
    <View style={{ padding: isPiDisplay ? 8 : 16 }}>
      {/* Responsive content */}
    </View>
  );
}
```

---

## Dashboard Configuration Examples

### System Monitor Dashboard

```json
{
  "id": "system-monitor",
  "name": "System Monitor",
  "refreshInterval": 5000,
  "layout": {
    "type": "view",
    "style": { "flex": 1, "padding": 16 },
    "children": [
      {
        "type": "text",
        "props": { "text": "System Performance" },
        "style": { "fontSize": 24, "marginBottom": 16 }
      },
      {
        "type": "card",
        "children": [
          {
            "type": "lineChart",
            "props": {
              "data": "{{api.cpu.history}}",
              "title": "CPU Usage",
              "animate": true
            }
          }
        ]
      },
      {
        "type": "grid",
        "props": { "columns": 2, "gap": 8 },
        "children": [
          {
            "type": "metric",
            "props": {
              "label": "Memory",
              "value": "{{api.memory.percent}}",
              "unit": "%"
            }
          },
          {
            "type": "metric",
            "props": {
              "label": "Temperature",
              "value": "{{api.temperature}}",
              "unit": "°C"
            }
          }
        ]
      }
    ]
  }
}
```

### Weather Dashboard

```json
{
  "id": "weather",
  "name": "Weather",
  "refreshInterval": 300000,
  "api": {
    "endpoint": "https://api.weather.com/current",
    "params": { "location": "{{config.location}}" }
  },
  "layout": {
    "type": "view",
    "children": [
      {
        "type": "text",
        "props": { "text": "{{api.location}}" },
        "style": { "fontSize": 20 }
      },
      {
        "type": "text",
        "props": { "text": "{{api.temperature}}°" },
        "style": { "fontSize": 48 }
      },
      {
        "type": "lineChart",
        "props": {
          "data": "{{api.forecast}}",
          "xKey": "time",
          "yKey": "temp"
        }
      }
    ]
  }
}
```

---

## Deployment

### Raspberry Pi Deployment

**1. Build Web Bundle**
```bash
npm run build:web
```

**2. Transfer to Pi**
```bash
scp -r dist/ pi@raspberrypi.local:~/piDash/
```

**3. Setup Express Server on Pi**
```javascript
// server/index.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('piDash running on http://localhost:3000');
});
```

**4. Setup Systemd Service**
```ini
# /etc/systemd/system/pidash.service
[Unit]
Description=piDash Application
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/piDash
ExecStart=/usr/bin/node server/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pidash
sudo systemctl start pidash
```

### Mobile Deployment

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

---

## Resources & Documentation

### Official Documentation
- **Gluestack UI:** https://gluestack.io/ui/docs
- **Victory Charts:** https://nearform.com/open-source/victory/docs/
- **React Native Web:** https://necolas.github.io/react-native-web/
- **Expo:** https://docs.expo.dev/
- **NativeWind:** https://www.nativewind.dev/

### Key Articles
- **Server-Driven UI in React Native:** Search Medium for "Server-Driven UI React Native"
- **JSON-Driven UI Tutorial:** VThink blog - "Building a JSON-Based Dynamic UI in React Native"
- **ClearTax Black App Case Study:** Medium - "JSON-driven UI in React Native"
- **Raspberry Pi Kiosk Setup:** Multiple guides on Raspberry Pi forums

### Benchmarks & Comparisons
- **Gluestack UI Benchmarks:** https://github.com/gluestack/gluestack-ui-benchmarks
- **React Native UI Library Comparison:** LogRocket - "The 10 best React Native UI libraries of 2025"
- **Chart Library Comparison:** LogRocket - "Top 10 React Native Chart Libraries"

---

## Troubleshooting

### Common Issues

**1. React Native SVG Issues**
```bash
# Victory requires react-native-svg
npm install react-native-svg
npx expo install react-native-svg
```

**2. NativeWind Not Working**
```bash
# Ensure tailwind.config.js is properly configured
# Check metro.config.js includes NativeWind transformer
```

**3. Raspberry Pi Performance**
- Reduce bundle size
- Enable hardware acceleration
- Limit animations
- Use production builds

**4. WiFi Connectivity on Pi**
- Use ethernet when possible
- Implement reconnection logic
- Set up monitoring cronjob

---

## Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Add tests for new features
5. Update documentation
6. Submit pull request

---

## License

MIT

---

## Roadmap

- [ ] Initial project setup with Expo
- [ ] Gluestack UI integration
- [ ] Victory charts implementation
- [ ] JSON configuration parser
- [ ] Dynamic component renderer
- [ ] Example dashboards (system monitor, weather, calendar)
- [ ] Raspberry Pi deployment scripts
- [ ] Mobile app builds
- [ ] Performance optimization
- [ ] Documentation and examples
- [ ] Plugin system for custom components
- [ ] Configuration management UI
- [ ] Remote configuration server
- [ ] Analytics integration

---

## Contact & Support

For questions, issues, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for the Raspberry Pi and React Native communities**
