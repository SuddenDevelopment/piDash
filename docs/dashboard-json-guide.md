# PiDash JSON Configuration Guide

Complete guide for creating flexible, JSON-driven dashboards with real-time updates, animations, and event-driven interactions.

## Table of Contents

1. [Overview](#overview)
2. [Configuration Structure](#configuration-structure)
3. [Pages & Layout](#pages--layout)
4. [Panels & Components](#panels--components)
5. [Data Sources](#data-sources)
6. [Events & Actions](#events--actions)
7. [Animations & Transitions](#animations--transitions)
8. [Label Positioning](#label-positioning)
9. [Complete Examples](#complete-examples)

## Overview

The PiDash JSON configuration enables you to:

- Define multiple full-screen dashboard pages
- Create n-tier flex/grid layouts with animated transitions
- Display real-time metrics, charts, tables, and canvas graphics
- Position labels at 9 anchor points within panels
- Handle events (clicks, data updates, schedules, gestures)
- Update panels via WebSocket streams
- Toggle fullscreen mode for individual panels
- Navigate between pages with smooth transitions

## Configuration Structure

```json
{
  "version": "1.0.0",
  "config": { /* Global settings */ },
  "pages": [ /* Dashboard pages */ ],
  "navigation": { /* Page navigation */ },
  "dataSources": { /* Data connections */ },
  "globalEvents": [ /* App-wide events */ ]
}
```

### Global Configuration

```json
{
  "config": {
    "websocket": {
      "url": "ws://localhost:3000",
      "reconnect": true,
      "reconnectInterval": 5000
    },
    "theme": "dark",
    "transitions": {
      "duration": 300,
      "easing": "easeInOut"
    }
  }
}
```

## Pages & Layout

### Basic Page Structure

```json
{
  "id": "system-monitor",
  "name": "System Monitor",
  "layout": {
    "type": "flex",
    "direction": "column",
    "gap": 16,
    "padding": 16
  },
  "panels": [ /* Nested panels */ ],
  "events": [ /* Page lifecycle events */ ]
}
```

### Layout Types

#### Flex Layout

```json
{
  "layout": {
    "type": "flex",
    "direction": "row",      // or "column"
    "gap": 16,
    "padding": 16,
    "justify": "space-between",
    "align": "center",
    "wrap": false,
    "animated": true         // Smooth height/width transitions
  }
}
```

#### Grid Layout

```json
{
  "layout": {
    "type": "grid",
    "columns": 3,
    "rows": 2,
    "gap": 16,
    "animated": true
  }
}
```

#### Absolute Layout

```json
{
  "layout": {
    "type": "absolute"
  },
  "style": {
    "position": "absolute",
    "top": 10,
    "left": 10
  }
}
```

### N-Tier Hierarchy

Create nested layouts to any depth:

```json
{
  "panels": [
    {
      "id": "row-1",
      "type": "container",
      "layout": { "type": "flex", "direction": "row" },
      "children": [
        {
          "id": "col-1",
          "type": "container",
          "layout": { "type": "flex", "direction": "column" },
          "children": [
            { "id": "metric-1", "type": "metric" },
            { "id": "metric-2", "type": "metric" }
          ]
        },
        { "id": "chart-1", "type": "chart", "flex": 2 }
      ]
    }
  ]
}
```

### Page Transitions

```json
{
  "transitions": {
    "enter": {
      "type": "fade",
      "duration": 300,
      "easing": "easeInOut"
    },
    "exit": {
      "type": "slide",
      "direction": "left",
      "duration": 300
    }
  }
}
```

**Transition Types:**
- `fade` - Opacity transition
- `slide` - Slide in/out (directions: left, right, up, down)
- `scale` - Scale up/down
- `rotate` - Rotation effect
- `none` - Instant switch

## Panels & Components

### 1. Metric Panel

Display real-time statistics with WebSocket updates:

```json
{
  "id": "cpu-metric",
  "type": "metric",
  "flex": 1,
  "style": {
    "bg": "$backgroundLight",
    "borderRadius": "$md",
    "padding": 12
  },
  "label": {
    "text": "CPU Usage",
    "position": "top-left",
    "style": {
      "fontSize": "$sm",
      "color": "$textSecondary"
    }
  },
  "value": {
    "source": "ws://stats",
    "path": "cpu.usage",
    "format": "{value}%",
    "style": {
      "fontSize": "$3xl",
      "color": "$primary",
      "fontWeight": "bold"
    }
  },
  "events": [
    {
      "type": "onValueChange",
      "condition": "value > 80",
      "actions": [
        {
          "type": "notification",
          "message": "High CPU usage detected",
          "severity": "warning"
        }
      ]
    }
  ]
}
```

### 2. Chart Panel

Visualize time-series data:

```json
{
  "id": "cpu-chart",
  "type": "chart",
  "chartType": "line",
  "flex": 2,
  "label": {
    "text": "CPU History",
    "position": "top-center"
  },
  "data": {
    "source": "ws://stats",
    "path": "cpu.history",
    "maxPoints": 60
  },
  "chartConfig": {
    "xKey": "timestamp",
    "yKey": "value",
    "color": "$primary",
    "strokeWidth": 2,
    "showGrid": true,
    "animate": true
  },
  "events": [
    {
      "type": "onClick",
      "actions": [
        { "type": "setFullscreen", "target": "self" }
      ]
    }
  ]
}
```

**Chart Types:**
- `line` - Line chart
- `bar` - Bar chart
- `area` - Area chart
- `pie` - Pie chart
- `scatter` - Scatter plot
- `gauge` - Gauge/dial chart
- `candlestick` - Candlestick chart

#### Gauge Chart Example

```json
{
  "type": "chart",
  "chartType": "gauge",
  "data": {
    "source": "ws://stats",
    "path": "temperature"
  },
  "chartConfig": {
    "min": 0,
    "max": 100,
    "unit": "°C",
    "zones": [
      { "from": 0, "to": 60, "color": "$success" },
      { "from": 60, "to": 80, "color": "$warning" },
      { "from": 80, "to": 100, "color": "$error" }
    ]
  }
}
```

### 3. Table Panel

Display tabular data:

```json
{
  "id": "process-table",
  "type": "table",
  "style": {
    "bg": "$backgroundLight",
    "borderRadius": "$md",
    "padding": 12
  },
  "label": {
    "text": "Active Processes",
    "position": "top-left"
  },
  "data": {
    "source": "ws://stats",
    "path": "processes"
  },
  "columns": [
    { "key": "pid", "label": "PID", "width": 60 },
    { "key": "name", "label": "Process", "flex": 1 },
    { "key": "cpu", "label": "CPU %", "width": 80, "align": "right" },
    { "key": "memory", "label": "Memory", "width": 100, "align": "right" }
  ],
  "maxRows": 10,
  "scrollable": true,
  "sortable": true
}
```

### 4. Canvas Panel

Render 3D graphics or custom visualizations:

```json
{
  "id": "particle-canvas",
  "type": "canvas",
  "layout": {
    "height": 300,
    "animated": true
  },
  "canvasType": "r3f",
  "canvasConfig": {
    "scene": "particles",
    "backgroundColor": "$background",
    "camera": {
      "position": [0, 0, 5],
      "fov": 75
    },
    "controls": {
      "enabled": true,
      "autoRotate": true,
      "autoRotateSpeed": 2
    }
  },
  "events": [
    {
      "type": "onDoubleClick",
      "actions": [
        {
          "type": "setFullscreen",
          "target": "self",
          "transition": {
            "type": "scale",
            "duration": 400
          }
        }
      ]
    }
  ]
}
```

**Canvas Types:**
- `r3f` - React Three Fiber (3D)
- `webgl` - Raw WebGL
- `2d` - Canvas 2D API

## Data Sources

### WebSocket Source

Real-time data streaming:

```json
{
  "dataSources": {
    "ws://stats": {
      "type": "websocket",
      "url": "ws://localhost:3000/stats",
      "reconnect": true,
      "reconnectInterval": 5000,
      "subscriptions": ["cpu", "memory", "temperature"]
    }
  }
}
```

### HTTP Source

Polling REST APIs:

```json
{
  "dataSources": {
    "api://system": {
      "type": "http",
      "url": "http://localhost:3000/api/system",
      "method": "GET",
      "headers": {
        "Authorization": "Bearer {{token}}"
      },
      "pollInterval": 5000
    }
  }
}
```

### Local Source

Static or computed data:

```json
{
  "dataSources": {
    "local://config": {
      "type": "local",
      "data": {
        "appName": "PiDash",
        "version": "1.0.0"
      }
    }
  }
}
```

### Using Data Sources

Reference data in components:

```json
{
  "value": {
    "source": "ws://stats",
    "path": "cpu.usage"
  }
}
```

**Path Syntax:**
- `cpu.usage` - Nested object access
- `processes[0].name` - Array indexing
- `metrics.*.average` - Wildcard matching

## Events & Actions

### Event Types

#### Component Events

```json
{
  "events": [
    {
      "type": "onClick",
      "actions": [ /* ... */ ]
    },
    {
      "type": "onDoubleClick",
      "actions": [ /* ... */ ]
    },
    {
      "type": "onLongPress",
      "actions": [ /* ... */ ]
    },
    {
      "type": "onValueChange",
      "condition": "value > threshold",
      "actions": [ /* ... */ ]
    }
  ]
}
```

#### Page Events

```json
{
  "events": [
    {
      "type": "onLoad",
      "actions": [
        { "type": "subscribe", "channel": "ws://stats" }
      ]
    },
    {
      "type": "onUnload",
      "actions": [
        { "type": "unsubscribe", "channel": "ws://stats" }
      ]
    }
  ]
}
```

#### Global Events

```json
{
  "globalEvents": [
    {
      "type": "onWebSocketMessage",
      "channel": "ws://stats",
      "path": "alert",
      "actions": [
        {
          "type": "notification",
          "message": "{{data.message}}",
          "severity": "{{data.severity}}"
        }
      ]
    },
    {
      "type": "onKeyPress",
      "key": "f",
      "actions": [
        { "type": "toggleFullscreen", "target": "focused" }
      ]
    }
  ]
}
```

### Action Types

#### Navigation Actions

```json
{
  "type": "navigateTo",
  "target": "network-monitor",
  "transition": {
    "type": "slide",
    "direction": "left"
  }
}
```

```json
{ "type": "navigateNext" }
{ "type": "navigatePrevious" }
{ "type": "navigateBack" }
```

#### Style Actions

```json
{
  "type": "updateStyle",
  "target": "cpu-metric",
  "style": {
    "bg": "$error",
    "borderColor": "$warning"
  },
  "duration": 300
}
```

#### Data Actions

```json
{ "type": "subscribe", "channel": "ws://stats" }
{ "type": "unsubscribe", "channel": "ws://stats" }
{ "type": "refresh", "target": "api://system" }
```

#### Notification Actions

```json
{
  "type": "notification",
  "message": "System temperature critical!",
  "severity": "error",
  "duration": 5000,
  "position": "top"
}
```

**Severity Levels:** `info`, `success`, `warning`, `error`

#### Fullscreen Actions

```json
{ "type": "setFullscreen", "target": "cpu-chart" }
{ "type": "toggleFullscreen", "target": "self" }
{ "type": "exitFullscreen", "target": "focused" }
```

### Conditional Execution

Use JavaScript expressions in `condition`:

```json
{
  "type": "onValueChange",
  "condition": "value > 80 && value < 95",
  "actions": [ /* ... */ ]
}
```

```json
{
  "type": "onDataUpdate",
  "condition": "data.status === 'error'",
  "actions": [ /* ... */ ]
}
```

## Animations & Transitions

### Animated Layouts

Enable smooth height/width transitions:

```json
{
  "layout": {
    "type": "flex",
    "direction": "row",
    "height": 200,
    "animated": true  // ← Enables smooth transitions
  }
}
```

When `height`, `width`, or `flex` values change (via data updates or style actions), the layout animates smoothly.

### Transition Configuration

```json
{
  "transition": {
    "type": "spring",     // or "timing"
    "duration": 300,
    "easing": "easeInOut",
    "delay": 0
  }
}
```

**Easing Options:**
- `linear`
- `easeIn`, `easeOut`, `easeInOut`
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`

## Label Positioning

Position labels at 9 anchor points within any panel:

```json
{
  "label": {
    "text": "CPU Usage",
    "position": "top-left",
    "style": {
      "fontSize": "$md",
      "color": "$textSecondary",
      "fontWeight": "600"
    },
    "offset": { "x": 8, "y": 8 }
  }
}
```

### Position Values

```
┌─────────────────────────────────┐
│ top-left  top-center  top-right │
│                                  │
│ center-left  center  center-right│
│                                  │
│ bottom-left bottom-center bottom-right │
└─────────────────────────────────┘
```

### Multiple Labels

Panels can have multiple labels by using overlays:

```json
{
  "children": [
    {
      "type": "text",
      "text": "CPU",
      "style": { "position": "absolute", "top": 8, "left": 8 }
    },
    {
      "type": "text",
      "text": "{{value}}%",
      "style": { "position": "absolute", "bottom": 8, "right": 8 }
    }
  ]
}
```

## Complete Examples

### Example 1: System Monitor Dashboard

```json
{
  "version": "1.0.0",
  "config": {
    "websocket": {
      "url": "ws://localhost:3000",
      "reconnect": true
    },
    "theme": "dark",
    "transitions": {
      "duration": 300,
      "easing": "easeInOut"
    }
  },
  "pages": [
    {
      "id": "system-monitor",
      "name": "System Monitor",
      "layout": {
        "type": "flex",
        "direction": "column",
        "gap": 16,
        "padding": 16
      },
      "panels": [
        {
          "id": "metrics-row",
          "type": "container",
          "layout": {
            "type": "flex",
            "direction": "row",
            "height": 80,
            "gap": 16,
            "animated": true
          },
          "children": [
            {
              "id": "cpu-metric",
              "type": "metric",
              "flex": 1,
              "style": {
                "bg": "$backgroundLight",
                "borderRadius": "$md",
                "padding": 12
              },
              "label": {
                "text": "CPU",
                "position": "top-left",
                "style": { "fontSize": "$sm", "color": "$textSecondary" }
              },
              "value": {
                "source": "ws://stats",
                "path": "cpu.usage",
                "format": "{value}%",
                "style": {
                  "fontSize": "$3xl",
                  "fontWeight": "bold",
                  "color": "$primary"
                }
              }
            },
            {
              "id": "memory-metric",
              "type": "metric",
              "flex": 1,
              "style": {
                "bg": "$backgroundLight",
                "borderRadius": "$md",
                "padding": 12
              },
              "label": {
                "text": "Memory",
                "position": "top-left",
                "style": { "fontSize": "$sm", "color": "$textSecondary" }
              },
              "value": {
                "source": "ws://stats",
                "path": "memory.usage",
                "format": "{value} MB"
              }
            },
            {
              "id": "temp-metric",
              "type": "metric",
              "flex": 1,
              "style": {
                "bg": "$backgroundLight",
                "borderRadius": "$md",
                "padding": 12
              },
              "label": {
                "text": "Temperature",
                "position": "top-left"
              },
              "value": {
                "source": "ws://stats",
                "path": "temperature",
                "format": "{value}°C"
              },
              "events": [
                {
                  "type": "onValueChange",
                  "condition": "value > 80",
                  "actions": [
                    {
                      "type": "updateStyle",
                      "target": "self",
                      "style": { "bg": "$error" }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "chart-row",
          "type": "container",
          "layout": {
            "type": "flex",
            "direction": "row",
            "height": 250,
            "gap": 16
          },
          "children": [
            {
              "id": "cpu-chart",
              "type": "chart",
              "chartType": "line",
              "flex": 2,
              "style": {
                "bg": "$backgroundLight",
                "borderRadius": "$md",
                "padding": 12
              },
              "label": {
                "text": "CPU History",
                "position": "top-center"
              },
              "data": {
                "source": "ws://stats",
                "path": "cpu.history",
                "maxPoints": 60
              },
              "chartConfig": {
                "xKey": "timestamp",
                "yKey": "value",
                "color": "$primary",
                "strokeWidth": 2,
                "showGrid": true,
                "animate": true
              }
            },
            {
              "id": "temp-gauge",
              "type": "chart",
              "chartType": "gauge",
              "flex": 1,
              "data": {
                "source": "ws://stats",
                "path": "temperature"
              },
              "chartConfig": {
                "min": 0,
                "max": 100,
                "unit": "°C",
                "zones": [
                  { "from": 0, "to": 60, "color": "$success" },
                  { "from": 60, "to": 80, "color": "$warning" },
                  { "from": 80, "to": 100, "color": "$error" }
                ]
              }
            }
          ]
        },
        {
          "id": "process-table",
          "type": "table",
          "layout": {
            "height": "auto",
            "maxHeight": 150
          },
          "style": {
            "bg": "$backgroundLight",
            "borderRadius": "$md",
            "padding": 12
          },
          "label": {
            "text": "Active Processes",
            "position": "top-left"
          },
          "data": {
            "source": "ws://stats",
            "path": "processes"
          },
          "columns": [
            { "key": "pid", "label": "PID", "width": 60 },
            { "key": "name", "label": "Process", "flex": 1 },
            { "key": "cpu", "label": "CPU %", "width": 80, "align": "right" },
            { "key": "memory", "label": "Memory", "width": 100, "align": "right" }
          ],
          "maxRows": 5
        }
      ],
      "events": [
        {
          "type": "onLoad",
          "actions": [
            { "type": "subscribe", "channel": "ws://stats" }
          ]
        }
      ]
    }
  ],
  "navigation": {
    "initialPage": "system-monitor",
    "events": [
      {
        "type": "onSwipeLeft",
        "actions": [{ "type": "navigateNext" }]
      },
      {
        "type": "onSwipeRight",
        "actions": [{ "type": "navigatePrevious" }]
      }
    ]
  },
  "dataSources": {
    "ws://stats": {
      "type": "websocket",
      "url": "ws://localhost:3000/stats",
      "reconnect": true,
      "subscriptions": ["cpu", "memory", "temperature", "processes"]
    }
  }
}
```

### Example 2: Auto-Rotating Kiosk Display

```json
{
  "navigation": {
    "initialPage": "dashboard-1",
    "transitions": {
      "default": {
        "type": "slide",
        "direction": "left",
        "duration": 500
      }
    },
    "events": [
      {
        "type": "onSchedule",
        "schedule": {
          "interval": 30000,
          "rotate": true
        },
        "actions": [
          { "type": "navigateNext" }
        ]
      }
    ]
  }
}
```

### Example 3: Canvas Fullscreen Toggle

```json
{
  "id": "3d-visualization",
  "type": "canvas",
  "canvasType": "r3f",
  "layout": {
    "height": 300,
    "animated": true
  },
  "canvasConfig": {
    "scene": "solar-system",
    "camera": { "position": [0, 0, 10] }
  },
  "events": [
    {
      "type": "onDoubleClick",
      "actions": [
        {
          "type": "setFullscreen",
          "target": "self",
          "transition": {
            "type": "scale",
            "duration": 400,
            "easing": "easeInOutCubic"
          }
        }
      ]
    }
  ],
  "globalEvents": [
    {
      "type": "onKeyPress",
      "key": "Escape",
      "actions": [
        { "type": "exitFullscreen", "target": "focused" }
      ]
    }
  ]
}
```

## Theme Tokens

Use `$token` syntax to reference theme values:

**Colors:**
- `$primary`, `$secondary`
- `$success`, `$warning`, `$error`, `$info`
- `$background`, `$backgroundLight`, `$backgroundLighter`
- `$text`, `$textSecondary`, `$textMuted`

**Spacing:**
- `$0` to `$24` (multiples of 4px)

**Border Radius:**
- `$none`, `$xs`, `$sm`, `$md`, `$lg`, `$xl`, `$2xl`, `$3xl`, `$full`

**Font Sizes:**
- `$2xs`, `$xs`, `$sm`, `$md`, `$lg`, `$xl`, `$2xl`, `$3xl`, `$4xl`, `$5xl`, `$6xl`

## Best Practices

1. **Use meaningful IDs**: Make panel IDs descriptive (e.g., `cpu-metric`, not `panel1`)
2. **Enable animations selectively**: Only use `animated: true` where needed to maintain performance
3. **Limit WebSocket subscriptions**: Subscribe only to channels you need
4. **Set maxPoints for charts**: Prevent memory issues with time-series data
5. **Use conditional events**: Add `condition` to reduce unnecessary actions
6. **Leverage flex for responsive layouts**: Use `flex` instead of fixed widths when possible
7. **Test fullscreen transitions**: Ensure smooth entry/exit animations
8. **Handle connection failures**: Configure `reconnect: true` for WebSockets
9. **Use theme tokens**: Reference `$tokens` instead of hardcoding colors
10. **Document custom actions**: Add comments for complex event chains

## Validation

Validate your configuration against the JSON Schema:

```bash
npx ajv-cli validate -s docs/dashboard-schema.json -d config/dashboards/my-dashboard.json
```

## Next Steps

1. Create your first dashboard in `config/dashboards/`
2. Set up WebSocket server for real-time data
3. Test with the dashboard renderer component
4. Add custom canvas scenes
5. Configure auto-rotation for kiosk mode

---

**Related Documentation:**
- [TypeScript Types](../types/dashboard-schema.ts)
- [JSON Schema](./dashboard-schema.json)
- [Component Library](../components/README.md)
- [WebSocket Protocol](./websocket-protocol.md)
