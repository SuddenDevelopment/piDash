/**
 * ActionExecutor Service
 *
 * Implements Command Pattern for executing dashboard event actions
 */

import type {
  EventAction,
  DashboardEvent,
  ActionContext,
  NavigateAction,
  NotifyAction,
  ConfigUpdateAction,
  RefreshAction,
  TransitionControlAction,
  CustomAction
} from '@/types/events';

type ActionHandler = (action: EventAction, context: ActionContext) => void | Promise<void>;

export class ActionExecutor {
  private handlers: Map<string, ActionHandler> = new Map();
  private context: ActionContext;

  constructor(context: ActionContext) {
    this.context = context;
    this.registerDefaultHandlers();
  }

  /**
   * Register a custom action handler
   */
  registerHandler(type: string, handler: ActionHandler) {
    this.handlers.set(type, handler);
    console.log(`[ActionExecutor] Registered handler for action type: ${type}`);
  }

  /**
   * Execute a single action
   */
  async execute(action: EventAction): Promise<void> {
    const handler = this.handlers.get(action.type);

    if (!handler) {
      console.warn(`[ActionExecutor] No handler for action type: ${action.type}`);
      return;
    }

    try {
      console.log(`[ActionExecutor] Executing action: ${action.type}`);
      await handler(action, this.context);
    } catch (error) {
      console.error(`[ActionExecutor] Error executing action ${action.type}:`, error);
    }
  }

  /**
   * Execute all actions in a dashboard event
   */
  async executeAll(actions: EventAction[]): Promise<void> {
    for (const action of actions) {
      await this.execute(action);
    }
  }

  /**
   * Process a complete dashboard event
   */
  async processEvent(event: DashboardEvent): Promise<void> {
    console.log(`[ActionExecutor] Processing event: ${event.id}`);

    if (!event.actions || event.actions.length === 0) {
      console.warn(`[ActionExecutor] Event ${event.id} has no actions`);
      return;
    }

    await this.executeAll(event.actions);
  }

  /**
   * Register all default action handlers
   */
  private registerDefaultHandlers() {
    // Navigation handler
    this.registerHandler('navigate', (action: EventAction, ctx: ActionContext) => {
      const navAction = action as NavigateAction;

      if (!ctx.navigation) {
        console.error('[ActionExecutor] Navigation context not available');
        return;
      }

      console.log(`[ActionExecutor] Navigating to: ${navAction.target}`);

      // Use expo-router navigation
      if (navAction.params) {
        ctx.navigation.push(navAction.target, navAction.params);
      } else {
        ctx.navigation.push(navAction.target);
      }
    });

    // Notification handler
    this.registerHandler('notify', (action: EventAction, ctx: ActionContext) => {
      const notifyAction = action as NotifyAction;

      if (!ctx.notificationService) {
        console.error('[ActionExecutor] Notification service not available');
        return;
      }

      console.log(`[ActionExecutor] Showing notification: ${notifyAction.title}`);

      ctx.notificationService.show({
        title: notifyAction.title,
        message: notifyAction.message,
        severity: notifyAction.severity || 'info',
        duration: notifyAction.duration || 3000
      });
    });

    // Config update handler (in-memory only by default)
    this.registerHandler('config.update', async (action: EventAction, ctx: ActionContext) => {
      const configAction = action as ConfigUpdateAction;

      if (!ctx.settings) {
        console.error('[ActionExecutor] Settings context not available');
        return;
      }

      console.log(`[ActionExecutor] Updating config: ${configAction.path} = ${configAction.value}`);

      // Parse dot-notation path
      const pathParts = configAction.path.split('.');
      const updates: Record<string, any> = {};

      // For simple paths, set directly
      if (pathParts.length === 1) {
        updates[configAction.path] = configAction.value;
      } else {
        // For nested paths, construct nested object
        let current = updates;
        for (let i = 0; i < pathParts.length - 1; i++) {
          current[pathParts[i]] = {};
          current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = configAction.value;
      }

      // Apply updates
      if (configAction.persistent) {
        // Save to storage (not implemented in demo)
        console.warn('[ActionExecutor] Persistent config updates not implemented in demo');
        ctx.settings.updateSettings?.(updates);
      } else {
        // In-memory update only
        ctx.settings.updateSettings?.(updates);
      }
    });

    // Refresh handler
    this.registerHandler('refresh', (action: EventAction, ctx: ActionContext) => {
      const refreshAction = action as RefreshAction;

      if (!ctx.config) {
        console.error('[ActionExecutor] Config context not available');
        return;
      }

      console.log(`[ActionExecutor] Refreshing: ${refreshAction.target || 'all'}`);

      if (refreshAction.target === 'all' || !refreshAction.target) {
        // Trigger full dashboard refresh
        ctx.config.reload?.();
      } else {
        // Refresh specific component
        ctx.config.refreshComponent?.(refreshAction.target);
      }
    });

    // Transition control handlers
    this.registerHandler('transition.pause', (action: EventAction, ctx: ActionContext) => {
      if (!ctx.settings) {
        console.error('[ActionExecutor] Settings context not available');
        return;
      }

      console.log('[ActionExecutor] Pausing auto-transitions');
      ctx.settings.toggleAutoTransition?.(false);
    });

    this.registerHandler('transition.resume', (action: EventAction, ctx: ActionContext) => {
      if (!ctx.settings) {
        console.error('[ActionExecutor] Settings context not available');
        return;
      }

      console.log('[ActionExecutor] Resuming auto-transitions');
      ctx.settings.toggleAutoTransition?.(true);
    });

    // Custom handler
    this.registerHandler('custom', async (action: EventAction, ctx: ActionContext) => {
      const customAction = action as CustomAction;

      console.log(`[ActionExecutor] Executing custom handler: ${customAction.handler}`);

      // Look for custom handler in context
      if (ctx.config?.customHandlers?.[customAction.handler]) {
        await ctx.config.customHandlers[customAction.handler](customAction.params);
      } else {
        console.warn(`[ActionExecutor] Custom handler not found: ${customAction.handler}`);
      }
    });
  }
}
