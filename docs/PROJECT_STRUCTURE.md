# Project Structure

This document describes the organization of the piDash project.

## Directory Structure

```
piDash/
├── app/                       # Expo Router screens
│   ├── index.tsx             # Main dashboard
│   └── _layout.tsx           # Root layout with Gluestack UI provider
│
├── components/               # Reusable components
│   └── ui/                   # Gluestack UI styled components
│       ├── Box.tsx
│       ├── Text.tsx
│       ├── Card.tsx
│       ├── HStack.tsx
│       ├── VStack.tsx
│       └── index.ts
│
├── config/                   # Configuration files
│   ├── display.ts           # Display resolution & scaling config
│   ├── version.ts           # Build version info (auto-generated)
│   └── gluestack-ui.config.ts  # Gluestack UI theme configuration
│
├── docs/                     # Documentation
│   ├── DEPLOYMENT_CHEATSHEET.md
│   ├── DISPLAY_CONFIG.md
│   ├── GITHUB_ACTIONS_SETUP.md
│   ├── PI_DEPLOYMENT_GUIDE.md
│   ├── PI_SETUP_COMPLETE.md
│   ├── PROJECT_STRUCTURE.md  # This file
│   └── QUICKSTART.md
│
├── scripts/                  # Deployment & utility scripts
│   ├── deploy-to-pi.sh      # Deploy to Raspberry Pi
│   ├── enable-kiosk-mode.sh # Enable kiosk mode remotely
│   ├── setup-kiosk-mode.sh  # Configure kiosk mode on Pi
│   ├── generate-version.js  # Auto-increment build numbers
│   ├── watch-and-deploy.sh  # Watch & auto-deploy
│   ├── pi-initial-setup.sh  # First-time Pi setup
│   ├── pi-auto-update.sh    # Auto-update from GitHub
│   ├── trigger-deploy.sh    # Trigger GitHub Actions
│   └── webhook-server.js    # GitHub webhook handler
│
├── server/                   # Express server for Pi
│   └── index.js             # Serves static files & API endpoints
│
├── tests/                    # Unit & integration tests
│   └── README.md
│
├── dist/                     # Production build output (generated)
│
├── README.md                 # Main project documentation
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
└── web-build-config.js      # Web build configuration
```

## Key Files

### App Files
- **app/index.tsx** - Main dashboard with live clock, system info, and status cards
- **app/_layout.tsx** - Root layout that provides Gluestack UI theming and viewport configuration

### Configuration
- **config/display.ts** - Fixed display resolution (800x480) and scaling utilities
- **config/gluestack-ui.config.ts** - Dark theme optimized for Pi displays
- **config/version.ts** - Auto-generated build version info

### Components
- **components/ui/** - Styled Gluestack UI components (Box, Text, Card, HStack, VStack)

### Deployment
- **scripts/deploy-to-pi.sh** - Main deployment script (build → sync → restart service)
- **scripts/enable-kiosk-mode.sh** - One-time setup for browser auto-launch
- **server/index.js** - Express server for serving the dashboard on Pi

## Build Output

The `dist/` directory contains the production web build:
- `dist/index.html` - Main HTML file
- `dist/_expo/` - Bundled JavaScript and assets

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run build:web` | Build production web bundle |
| `npm run deploy:pi` | Deploy to Raspberry Pi |
| `npm run kiosk:enable` | Enable kiosk mode on Pi |
| `npm run watch:pi` | Watch for changes and auto-deploy |

## Technology Stack

- **Framework**: Expo (React Native Web)
- **UI Library**: Gluestack UI
- **Styling**: Gluestack Style (design tokens)
- **Server**: Express.js
- **Deployment**: rsync + systemd

## Development Workflow

1. Edit code in `app/` or `components/`
2. Run `npm run deploy:pi` to build and deploy
3. Dashboard auto-refreshes on Pi within seconds
4. View changes at http://raspberrypi.local:3000

## Documentation

All documentation has been moved to the `docs/` directory:
- Quick start guides
- Deployment instructions
- Configuration guides
- Setup procedures

Only `README.md` remains in the root directory for quick project overview.
