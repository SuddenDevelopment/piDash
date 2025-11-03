/**
 * Dashboard JSON Schema TypeScript Definitions
 * Comprehensive type system for flexible, JSON-driven dashboards
 */

// ============================================================================
// Core Types
// ============================================================================

export type DashboardConfig = {
  version: string;
  config: GlobalConfig;
  pages: Page[];
  navigation: NavigationConfig;
  dataSources: Record<string, DataSource>;
  globalEvents?: GlobalEvent[];
};

// ============================================================================
// Global Configuration
// ============================================================================

export type GlobalConfig = {
  websocket?: {
    url: string;
    reconnect?: boolean;
    reconnectInterval?: number;
  };
  theme?: 'light' | 'dark';
  transitions?: {
    duration?: number;
    easing?: EasingType;
  };
};

export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic';

// ============================================================================
// Pages & Layout
// ============================================================================

export type Page = {
  id: string;
  name: string;
  layout: LayoutConfig;
  transitions?: PageTransitions;
  panels: Panel[];
  events?: PageEvent[];
};

export type LayoutConfig = {
  type: 'flex' | 'grid' | 'absolute';
  direction?: 'row' | 'column';
  gap?: number;
  padding?: number | PaddingConfig;
  height?: number | 'auto';
  width?: number | 'auto';
  wrap?: boolean;
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  // Grid-specific
  columns?: number;
  rows?: number;
  columnTemplate?: string;
  rowTemplate?: string;
  // Animation
  animated?: boolean;
};

export type PaddingConfig = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  horizontal?: number;
  vertical?: number;
};

export type PageTransitions = {
  enter?: TransitionConfig;
  exit?: TransitionConfig;
};

export type TransitionConfig = {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'none';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  easing?: EasingType;
  delay?: number;
};

// ============================================================================
// Panels & Components
// ============================================================================

export type Panel = {
  id: string;
  type: PanelType;
  layout?: LayoutConfig;
  style?: StyleConfig;
  flex?: number;
  label?: LabelConfig;
  children?: Panel[];
  events?: ComponentEvent[];
} & PanelTypeProps;

export type PanelType =
  | 'container'
  | 'metric'
  | 'chart'
  | 'table'
  | 'canvas'
  | 'text'
  | 'button'
  | 'input'
  | 'list'
  | 'json';

export type PanelTypeProps = MetricPanelProps | ChartPanelProps | TablePanelProps | CanvasPanelProps | TextPanelProps;

// Metric Panel
export type MetricPanelProps = {
  type?: 'metric';
  value?: ValueConfig;
  unit?: string;
  icon?: string;
  trend?: TrendConfig;
};

export type ValueConfig = {
  source: string;
  path: string;
  format?: string;
  style?: StyleConfig;
  updateInterval?: number;
};

export type TrendConfig = {
  source: string;
  path: string;
  period?: number;
  showArrow?: boolean;
  showPercentage?: boolean;
};

// Chart Panel
export type ChartPanelProps = {
  type?: 'chart';
  chartType?: ChartType;
  data?: DataConfig;
  chartConfig?: ChartConfig;
};

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'gauge' | 'candlestick';

export type DataConfig = {
  source: string;
  path: string;
  maxPoints?: number;
  updateInterval?: number;
};

export type ChartConfig = {
  xKey?: string;
  yKey?: string;
  color?: string | string[];
  strokeWidth?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  // Gauge-specific
  min?: number;
  max?: number;
  unit?: string;
  zones?: Array<{
    from: number;
    to: number;
    color: string;
  }>;
};

// Table Panel
export type TablePanelProps = {
  type?: 'table';
  data?: DataConfig;
  columns?: ColumnConfig[];
  maxRows?: number;
  scrollable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
};

export type ColumnConfig = {
  key: string;
  label: string;
  width?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  format?: string;
  sortable?: boolean;
};

// Canvas Panel
export type CanvasPanelProps = {
  type?: 'canvas';
  canvasType?: 'r3f' | 'webgl' | '2d';
  canvasConfig?: CanvasConfig;
};

export type CanvasConfig = {
  scene?: string;
  backgroundColor?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  controls?: {
    enabled?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
  };
  [key: string]: any;
};

// Text Panel
export type TextPanelProps = {
  type?: 'text';
  text?: string;
  source?: string;
  path?: string;
  markdown?: boolean;
};

// ============================================================================
// Labels & Styling
// ============================================================================

export type LabelConfig = {
  text: string;
  position: LabelPosition;
  style?: StyleConfig;
  offset?: { x?: number; y?: number };
};

export type LabelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type StyleConfig = {
  // Colors
  bg?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  shadowColor?: string;

  // Layout
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  // Spacing
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;

  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;

  // Border
  borderWidth?: number;
  borderRadius?: number | string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;

  // Typography
  fontSize?: number | string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontFamily?: string;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Effects
  opacity?: number;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;

  // Flex
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

  // Position
  position?: 'relative' | 'absolute';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;

  // Other
  overflow?: 'visible' | 'hidden' | 'scroll';
  [key: string]: any;
};

// ============================================================================
// Events & Actions
// ============================================================================

export type PageEvent = {
  type: PageEventType;
  condition?: string;
  actions: Action[];
};

export type PageEventType = 'onLoad' | 'onUnload' | 'onFocus' | 'onBlur';

export type ComponentEvent = {
  type: ComponentEventType;
  condition?: string;
  actions: Action[];
};

export type ComponentEventType =
  | 'onClick'
  | 'onDoubleClick'
  | 'onLongPress'
  | 'onValueChange'
  | 'onDataUpdate'
  | 'onError';

export type GlobalEvent = {
  type: GlobalEventType;
  key?: string;
  channel?: string;
  path?: string;
  condition?: string;
  actions: Action[];
};

export type GlobalEventType =
  | 'onWebSocketMessage'
  | 'onApiResponse'
  | 'onKeyPress'
  | 'onSchedule';

export type Action = NavigationAction | StyleAction | DataAction | NotificationAction | FullscreenAction | CustomAction;

export type NavigationAction = {
  type: 'navigateTo' | 'navigateNext' | 'navigatePrevious' | 'navigateBack';
  target?: string;
  transition?: TransitionConfig;
};

export type StyleAction = {
  type: 'updateStyle' | 'toggleStyle';
  target: string | 'self' | 'parent' | 'focused';
  style: StyleConfig;
  duration?: number;
};

export type DataAction = {
  type: 'updateValue' | 'subscribe' | 'unsubscribe' | 'refresh';
  target?: string;
  channel?: string;
  value?: any;
  path?: string;
};

export type NotificationAction = {
  type: 'notification';
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
};

export type FullscreenAction = {
  type: 'setFullscreen' | 'toggleFullscreen' | 'exitFullscreen';
  target: string | 'self' | 'focused';
  transition?: TransitionConfig;
};

export type CustomAction = {
  type: 'custom';
  handler: string;
  params?: Record<string, any>;
};

// ============================================================================
// Navigation
// ============================================================================

export type NavigationConfig = {
  initialPage: string;
  transitions?: {
    default?: TransitionConfig;
    pageSpecific?: Record<string, TransitionConfig>;
  };
  events?: NavigationEvent[];
};

export type NavigationEvent = {
  type: NavigationEventType;
  schedule?: ScheduleConfig;
  actions: Action[];
};

export type NavigationEventType =
  | 'onSwipeLeft'
  | 'onSwipeRight'
  | 'onSwipeUp'
  | 'onSwipeDown'
  | 'onSchedule'
  | 'onIdle';

export type ScheduleConfig = {
  interval?: number;
  cron?: string;
  rotate?: boolean;
};

// ============================================================================
// Data Sources
// ============================================================================

export type DataSource = WebSocketSource | HttpSource | LocalSource;

export type WebSocketSource = {
  type: 'websocket';
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  subscriptions?: string[];
  transform?: string;
};

export type HttpSource = {
  type: 'http';
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  pollInterval?: number;
  transform?: string;
};

export type LocalSource = {
  type: 'local';
  data: any;
  refreshInterval?: number;
};

// ============================================================================
// Validation & Utilities
// ============================================================================

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export type ValidationError = {
  path: string;
  message: string;
  code: string;
};
