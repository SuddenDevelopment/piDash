/**
 * Zod validation schemas for dashboard JSON configuration
 * Provides runtime validation with detailed error messages
 */

import { z } from 'zod';

// ============================================================================
// Core Validation Schemas
// ============================================================================

const EasingTypeSchema = z.enum([
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
]);

const GlobalConfigSchema = z.object({
  websocket: z
    .object({
      url: z.string().url(),
      reconnect: z.boolean().optional(),
      reconnectInterval: z.number().min(1000).optional(),
    })
    .optional(),
  theme: z.enum(['light', 'dark']).optional(),
  transitions: z
    .object({
      duration: z.number().min(0).optional(),
      easing: EasingTypeSchema.optional(),
    })
    .optional(),
});

// ============================================================================
// Layout Schemas
// ============================================================================

const PaddingConfigSchema = z.object({
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  left: z.number().optional(),
  horizontal: z.number().optional(),
  vertical: z.number().optional(),
});

const LayoutConfigSchema = z.object({
  type: z.enum(['flex', 'grid', 'absolute']),
  direction: z.enum(['row', 'column']).optional(),
  gap: z.number().optional(),
  padding: z.union([z.number(), PaddingConfigSchema]).optional(),
  height: z.union([z.number(), z.literal('auto')]).optional(),
  width: z.union([z.number(), z.literal('auto')]).optional(),
  wrap: z.boolean().optional(),
  justify: z
    .enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'])
    .optional(),
  align: z.enum(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']).optional(),
  columns: z.number().optional(),
  rows: z.number().optional(),
  columnTemplate: z.string().optional(),
  rowTemplate: z.string().optional(),
  animated: z.boolean().optional(),
});

const TransitionConfigSchema = z.object({
  type: z.enum(['fade', 'slide', 'scale', 'rotate', 'none']),
  direction: z.enum(['left', 'right', 'up', 'down']).optional(),
  duration: z.number().min(0).optional(),
  easing: EasingTypeSchema.optional(),
  delay: z.number().min(0).optional(),
});

const PageTransitionsSchema = z.object({
  enter: TransitionConfigSchema.optional(),
  exit: TransitionConfigSchema.optional(),
});

// ============================================================================
// Style Schema
// ============================================================================

const StyleConfigSchema = z
  .object({
    bg: z.string().optional(),
    backgroundColor: z.string().optional(),
    color: z.string().optional(),
    borderColor: z.string().optional(),
    width: z.union([z.number(), z.string()]).optional(),
    height: z.union([z.number(), z.string()]).optional(),
    minWidth: z.union([z.number(), z.string()]).optional(),
    minHeight: z.union([z.number(), z.string()]).optional(),
    maxWidth: z.union([z.number(), z.string()]).optional(),
    maxHeight: z.union([z.number(), z.string()]).optional(),
    padding: z.union([z.number(), z.string()]).optional(),
    paddingTop: z.union([z.number(), z.string()]).optional(),
    paddingRight: z.union([z.number(), z.string()]).optional(),
    paddingBottom: z.union([z.number(), z.string()]).optional(),
    paddingLeft: z.union([z.number(), z.string()]).optional(),
    paddingHorizontal: z.union([z.number(), z.string()]).optional(),
    paddingVertical: z.union([z.number(), z.string()]).optional(),
    margin: z.union([z.number(), z.string()]).optional(),
    marginTop: z.union([z.number(), z.string()]).optional(),
    marginRight: z.union([z.number(), z.string()]).optional(),
    marginBottom: z.union([z.number(), z.string()]).optional(),
    marginLeft: z.union([z.number(), z.string()]).optional(),
    borderWidth: z.number().optional(),
    borderRadius: z.union([z.number(), z.string()]).optional(),
    fontSize: z.union([z.number(), z.string()]).optional(),
    fontWeight: z
      .union([
        z.enum(['normal', 'bold']),
        z.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900']),
      ])
      .optional(),
    lineHeight: z.number().optional(),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
    opacity: z.number().min(0).max(1).optional(),
    flex: z.number().optional(),
    flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
    justifyContent: z
      .enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'])
      .optional(),
    alignItems: z.enum(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']).optional(),
    position: z.enum(['relative', 'absolute']).optional(),
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
    zIndex: z.number().optional(),
    overflow: z.enum(['visible', 'hidden', 'scroll']).optional(),
  })
  .passthrough(); // Allow additional style properties

// ============================================================================
// Label Schema
// ============================================================================

const LabelPositionSchema = z.enum([
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]);

const LabelConfigSchema = z.object({
  text: z.string(),
  position: LabelPositionSchema,
  style: StyleConfigSchema.optional(),
  offset: z
    .object({
      x: z.number().optional(),
      y: z.number().optional(),
    })
    .optional(),
});

// ============================================================================
// Panel Component Schemas
// ============================================================================

const ValueConfigSchema = z.object({
  source: z.string(),
  path: z.string(),
  format: z.string().optional(),
  style: StyleConfigSchema.optional(),
  updateInterval: z.number().optional(),
});

const DataConfigSchema = z.object({
  source: z.string(),
  path: z.string(),
  maxPoints: z.number().optional(),
  updateInterval: z.number().optional(),
});

const ChartConfigSchema = z.object({
  xKey: z.string().optional(),
  yKey: z.string().optional(),
  color: z.union([z.string(), z.array(z.string())]).optional(),
  strokeWidth: z.number().optional(),
  showGrid: z.boolean().optional(),
  showLegend: z.boolean().optional(),
  animate: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().optional(),
  zones: z
    .array(
      z.object({
        from: z.number(),
        to: z.number(),
        color: z.string(),
      })
    )
    .optional(),
});

const ColumnConfigSchema = z.object({
  key: z.string(),
  label: z.string(),
  width: z.number().optional(),
  flex: z.number().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  format: z.string().optional(),
  sortable: z.boolean().optional(),
});

const CanvasConfigSchema = z
  .object({
    scene: z.string().optional(),
    backgroundColor: z.string().optional(),
    camera: z
      .object({
        position: z.tuple([z.number(), z.number(), z.number()]).optional(),
        fov: z.number().optional(),
        near: z.number().optional(),
        far: z.number().optional(),
      })
      .optional(),
    controls: z
      .object({
        enabled: z.boolean().optional(),
        autoRotate: z.boolean().optional(),
        autoRotateSpeed: z.number().optional(),
      })
      .optional(),
  })
  .passthrough();

// ============================================================================
// Event & Action Schemas
// ============================================================================

const ActionSchema = z.object({
  type: z.enum([
    'navigateTo',
    'navigateNext',
    'navigatePrevious',
    'navigateBack',
    'updateStyle',
    'toggleStyle',
    'updateValue',
    'subscribe',
    'unsubscribe',
    'refresh',
    'notification',
    'setFullscreen',
    'toggleFullscreen',
    'exitFullscreen',
    'custom',
  ]),
  target: z.string().optional(),
  style: StyleConfigSchema.optional(),
  duration: z.number().optional(),
  transition: TransitionConfigSchema.optional(),
  channel: z.string().optional(),
  value: z.any().optional(),
  path: z.string().optional(),
  message: z.string().optional(),
  severity: z.enum(['info', 'success', 'warning', 'error']).optional(),
  position: z.enum(['top', 'bottom', 'center']).optional(),
  handler: z.string().optional(),
  params: z.record(z.any()).optional(),
});

const ComponentEventSchema = z.object({
  type: z.enum(['onClick', 'onDoubleClick', 'onLongPress', 'onValueChange', 'onDataUpdate', 'onError']),
  condition: z.string().optional(),
  actions: z.array(ActionSchema),
});

const PageEventSchema = z.object({
  type: z.enum(['onLoad', 'onUnload', 'onFocus', 'onBlur']),
  condition: z.string().optional(),
  actions: z.array(ActionSchema),
});

const GlobalEventSchema = z.object({
  type: z.enum(['onWebSocketMessage', 'onApiResponse', 'onKeyPress', 'onSchedule']),
  key: z.string().optional(),
  channel: z.string().optional(),
  path: z.string().optional(),
  condition: z.string().optional(),
  actions: z.array(ActionSchema),
});

// ============================================================================
// Panel Schema (Recursive)
// ============================================================================

const PanelBaseSchema = z.object({
  id: z.string(),
  type: z.enum(['container', 'metric', 'chart', 'table', 'canvas', 'text', 'button', 'input', 'list', 'json']),
  layout: LayoutConfigSchema.optional(),
  style: StyleConfigSchema.optional(),
  flex: z.number().optional(),
  label: LabelConfigSchema.optional(),
  events: z.array(ComponentEventSchema).optional(),
  // Metric props
  value: ValueConfigSchema.optional(),
  unit: z.string().optional(),
  icon: z.string().optional(),
  // Chart props
  chartType: z.enum(['line', 'bar', 'area', 'pie', 'scatter', 'gauge', 'candlestick']).optional(),
  data: DataConfigSchema.optional(),
  chartConfig: ChartConfigSchema.optional(),
  // Table props
  columns: z.array(ColumnConfigSchema).optional(),
  maxRows: z.number().optional(),
  scrollable: z.boolean().optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  // Canvas props
  canvasType: z.enum(['r3f', 'webgl', '2d']).optional(),
  canvasConfig: CanvasConfigSchema.optional(),
  // Text props
  text: z.string().optional(),
  source: z.string().optional(),
  path: z.string().optional(),
  markdown: z.boolean().optional(),
});

// Recursive panel schema
const PanelSchema: z.ZodType<any> = PanelBaseSchema.extend({
  children: z.lazy(() => z.array(PanelSchema)).optional(),
});

// ============================================================================
// Page Schema
// ============================================================================

const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  layout: LayoutConfigSchema,
  transitions: PageTransitionsSchema.optional(),
  panels: z.array(PanelSchema),
  events: z.array(PageEventSchema).optional(),
});

// ============================================================================
// Navigation Schema
// ============================================================================

const ScheduleConfigSchema = z.object({
  interval: z.number().optional(),
  cron: z.string().optional(),
  rotate: z.boolean().optional(),
});

const NavigationEventSchema = z.object({
  type: z.enum(['onSwipeLeft', 'onSwipeRight', 'onSwipeUp', 'onSwipeDown', 'onSchedule', 'onIdle']),
  schedule: ScheduleConfigSchema.optional(),
  actions: z.array(ActionSchema),
});

const NavigationConfigSchema = z.object({
  initialPage: z.string(),
  transitions: z
    .object({
      default: TransitionConfigSchema.optional(),
      pageSpecific: z.record(TransitionConfigSchema).optional(),
    })
    .optional(),
  events: z.array(NavigationEventSchema).optional(),
});

// ============================================================================
// Data Source Schemas
// ============================================================================

const WebSocketSourceSchema = z.object({
  type: z.literal('websocket'),
  url: z.string().url(),
  reconnect: z.boolean().optional(),
  reconnectInterval: z.number().optional(),
  subscriptions: z.array(z.string()).optional(),
  transform: z.string().optional(),
});

const HttpSourceSchema = z.object({
  type: z.literal('http'),
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
  pollInterval: z.number().optional(),
  transform: z.string().optional(),
});

const LocalSourceSchema = z.object({
  type: z.literal('local'),
  data: z.any(),
  refreshInterval: z.number().optional(),
});

const DataSourceSchema = z.union([WebSocketSourceSchema, HttpSourceSchema, LocalSourceSchema]);

// ============================================================================
// Dashboard Configuration Schema
// ============================================================================

export const DashboardConfigSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  config: GlobalConfigSchema,
  pages: z.array(PageSchema).min(1),
  navigation: NavigationConfigSchema,
  dataSources: z.record(z.string(), DataSourceSchema),
  globalEvents: z.array(GlobalEventSchema).optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

export function validateDashboardConfig(config: unknown) {
  try {
    const result = DashboardConfigSchema.parse(config);
    return {
      valid: true as const,
      data: result,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false as const,
        data: null,
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
    }
    throw error;
  }
}

export function validateDashboardConfigAsync(config: unknown) {
  return DashboardConfigSchema.parseAsync(config);
}

// ============================================================================
// Partial Validation (for partial updates)
// ============================================================================

export const PartialDashboardConfigSchema = DashboardConfigSchema.partial();

export function validatePartialConfig(config: unknown) {
  try {
    const result = PartialDashboardConfigSchema.parse(config);
    return {
      valid: true as const,
      data: result,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false as const,
        data: null,
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
    }
    throw error;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type ValidatedDashboardConfig = z.infer<typeof DashboardConfigSchema>;
export type ValidatedPage = z.infer<typeof PageSchema>;
export type ValidatedPanel = z.infer<typeof PanelSchema>;
export type ValidatedDataSource = z.infer<typeof DataSourceSchema>;
