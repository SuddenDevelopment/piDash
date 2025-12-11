/**
 * API Configuration
 *
 * Centralized configuration for API and WebSocket URLs
 */

// Get the server host from environment or use localhost
const getServerHost = (): string => {
  // In development, you can set this to your Pi's IP address
  // For example: return '192.168.1.166'
  if (typeof window !== 'undefined') {
    // Check if there's a custom server host in localStorage
    const customHost = localStorage.getItem('pidash_server_host');
    if (customHost) {
      return customHost;
    }
  }

  // Default to localhost
  return 'localhost';
};

const SERVER_HOST = getServerHost();
const SERVER_PORT = 3001;

/**
 * HTTP API base URL
 */
export const API_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

/**
 * WebSocket URL
 */
export const WS_URL = `ws://${SERVER_HOST}:${SERVER_PORT}/ws`;

/**
 * Update the server host (saves to localStorage)
 */
export const setServerHost = (host: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pidash_server_host', host);
    // Reload to apply changes
    window.location.reload();
  }
};

/**
 * Get current server host
 */
export const getServerHostConfig = (): string => {
  return SERVER_HOST;
};
