/**
 * Network Mocking Utility
 * 
 * Comprehensive network mocking and proxy configuration utility for API testing.
 * Supports mock servers, request/response interception, and proxy configuration.
 */

import * as http from 'http';
import * as https from 'https';

/**
 * Mock response configuration
 */
export interface MockResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: any;
  delay?: number;
}

/**
 * Mock route configuration
 */
export interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  path: string | RegExp;
  response: MockResponse | ((req: any) => MockResponse | Promise<MockResponse>);
  times?: number; // Number of times this mock should be used (undefined = unlimited)
}

/**
 * Proxy configuration options
 */
export interface ProxyConfig {
  host: string;
  port: number;
  protocol?: 'http' | 'https';
  username?: string;
  password?: string;
  bypassList?: string[]; // List of hosts to bypass proxy
}

/**
 * Mock server configuration
 */
export interface MockServerConfig {
  port?: number;
  host?: string;
  enableLogging?: boolean;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (request: {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}) => {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
} | null;

/**
 * Response interceptor function
 */
export type ResponseInterceptor = (response: {
  status: number;
  headers: Record<string, string>;
  body: any;
  request: {
    method: string;
    url: string;
  };
}) => {
  status?: number;
  headers?: Record<string, string>;
  body?: any;
} | null;

/**
 * Network Mocking Utility Class
 * 
 * Provides comprehensive network mocking capabilities including:
 * - Mock server for API endpoints
 * - Request/response interception
 * - Proxy configuration
 * - Network condition simulation
 */
class NetworkMockingClass {
  private mockServer: http.Server | null = null;
  private mockRoutes: Map<string, MockRoute[]> = new Map();
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private requestLogs: any[] = [];
  private enableLogging: boolean = false;
  private serverPort: number = 0;
  private serverHost: string = 'localhost';

  /**
   * Start a mock server on specified port
   * 
   * @param config - Mock server configuration
   * @returns Server URL
   * 
   * @example
   * const url = await NetworkMocking.startMockServer({ port: 8080 });
   * console.log(`Mock server running at: ${url}`);
   */
  async startMockServer(config: MockServerConfig = {}): Promise<string> {
    const { port = 8080, host = 'localhost', enableLogging = true } = config;

    if (this.mockServer) {
      console.warn('Mock server already running. Stop it first before starting a new one.');
      return `http://${this.serverHost}:${this.serverPort}`;
    }

    this.serverPort = port;
    this.serverHost = host;
    this.enableLogging = enableLogging;

    return new Promise((resolve, reject) => {
      this.mockServer = http.createServer(async (req, res) => {
        await this.handleRequest(req, res);
      });

      this.mockServer.on('error', (err) => {
        console.error('Mock server error:', err);
        reject(err);
      });

      this.mockServer.listen(port, host, () => {
        const url = `http://${host}:${port}`;
        if (this.enableLogging) {
          console.log(`Mock server started at: ${url}`);
        }
        resolve(url);
      });
    });
  }

  /**
   * Stop the mock server
   * 
   * @example
   * await NetworkMocking.stopMockServer();
   */
  async stopMockServer(): Promise<void> {
    if (!this.mockServer) {
      console.warn('No mock server running');
      return;
    }

    return new Promise((resolve, reject) => {
      this.mockServer!.close((err) => {
        if (err) {
          console.error('Error stopping mock server:', err);
          reject(err);
        } else {
          if (this.enableLogging) {
            console.log('Mock server stopped');
          }
          this.mockServer = null;
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming requests to the mock server
   * 
   * @private
   */
  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const method = req.method || 'GET';
    const url = req.url || '/';

    // Read request body
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    // Log request
    const requestData = {
      method,
      url,
      headers: req.headers,
      body: body || undefined,
      timestamp: new Date().toISOString(),
    };

    if (this.enableLogging) {
      console.log(`[MockServer] ${method} ${url}`);
    }

    this.requestLogs.push(requestData);

    // Apply request interceptors
    let modifiedRequest: any = { method, url, headers: req.headers, body };
    for (const interceptor of this.requestInterceptors) {
      const result = interceptor(modifiedRequest);
      if (result) {
        modifiedRequest = { ...modifiedRequest, ...result };
      }
    }

    // Find matching mock route
    const mockRoute = this.findMatchingRoute(modifiedRequest.method, modifiedRequest.url);

    if (mockRoute) {
      await this.sendMockResponse(mockRoute, modifiedRequest, res);
    } else {
      // No mock found - send 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Mock not found', url: modifiedRequest.url }));
    }
  }

  /**
   * Send mock response
   * 
   * @private
   */
  private async sendMockResponse(
    mockRoute: MockRoute,
    request: any,
    res: http.ServerResponse
  ): Promise<void> {
    // Get response (could be static or function)
    let mockResponse: MockResponse;
    if (typeof mockRoute.response === 'function') {
      mockResponse = await mockRoute.response(request);
    } else {
      mockResponse = mockRoute.response;
    }

    // Apply delay if specified
    if (mockResponse.delay) {
      await new Promise((resolve) => setTimeout(resolve, mockResponse.delay));
    }

    // Apply response interceptors
    let modifiedResponse = {
      status: mockResponse.status || 200,
      headers: mockResponse.headers || { 'Content-Type': 'application/json' },
      body: mockResponse.body,
      request: { method: request.method, url: request.url },
    };

    for (const interceptor of this.responseInterceptors) {
      const result = interceptor(modifiedResponse);
      if (result) {
        modifiedResponse = { ...modifiedResponse, ...result };
      }
    }

    // Send response
    res.writeHead(modifiedResponse.status, modifiedResponse.headers);
    
    try {
      const responseBody =
        typeof modifiedResponse.body === 'string'
          ? modifiedResponse.body
          : JSON.stringify(modifiedResponse.body);
      res.end(responseBody);
    } catch (error) {
      console.error('Error serializing response body:', error);
      res.end(JSON.stringify({ error: 'Failed to serialize response' }));
    }

    // Decrement times counter if specified
    if (mockRoute.times !== undefined && mockRoute.times > 0) {
      mockRoute.times--;
      if (mockRoute.times === 0) {
        // Remove the route
        this.removeMockRoute(mockRoute);
      }
    }
  }

  /**
   * Find matching route for request
   * 
   * @private
   */
  private findMatchingRoute(method: string, url: string): MockRoute | null {
    const routes = this.mockRoutes.get(method) || [];

    for (const route of routes) {
      if (route.times === 0) continue; // Skip exhausted routes

      if (typeof route.path === 'string') {
        // Extract path without query string for comparison
        const urlPath = url.split('?')[0];
        const routePath = route.path.split('?')[0];
        
        // Exact match or path prefix match (for routes ending with /)
        if (urlPath === routePath || (routePath.endsWith('/') && urlPath.startsWith(routePath))) {
          return route;
        }
      } else if (route.path instanceof RegExp) {
        if (route.path.test(url)) {
          return route;
        }
      }
    }

    return null;
  }

  /**
   * Remove a mock route
   * 
   * @private
   */
  private removeMockRoute(routeToRemove: MockRoute): void {
    const routes = this.mockRoutes.get(routeToRemove.method);
    if (routes) {
      const index = routes.indexOf(routeToRemove);
      if (index > -1) {
        routes.splice(index, 1);
      }
    }
  }

  /**
   * Add a mock route to the server
   * 
   * @param route - Mock route configuration
   * 
   * @example
   * NetworkMocking.addMockRoute({
   *   method: 'GET',
   *   path: '/api/users',
   *   response: { status: 200, body: { users: [] } }
   * });
   */
  addMockRoute(route: MockRoute): void {
    if (!this.mockRoutes.has(route.method)) {
      this.mockRoutes.set(route.method, []);
    }
    this.mockRoutes.get(route.method)!.push(route);

    if (this.enableLogging) {
      console.log(`[MockServer] Added route: ${route.method} ${route.path}`);
    }
  }

  /**
   * Clear all mock routes
   * 
   * @example
   * NetworkMocking.clearMockRoutes();
   */
  clearMockRoutes(): void {
    this.mockRoutes.clear();
    if (this.enableLogging) {
      console.log('[MockServer] All routes cleared');
    }
  }

  /**
   * Add request interceptor
   * 
   * @param interceptor - Request interceptor function
   * 
   * @example
   * NetworkMocking.addRequestInterceptor((request) => {
   *   return { ...request, headers: { ...request.headers, 'X-Custom': 'Value' } };
   * });
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * 
   * @param interceptor - Response interceptor function
   * 
   * @example
   * NetworkMocking.addResponseInterceptor((response) => {
   *   return { ...response, headers: { ...response.headers, 'X-Mock': 'true' } };
   * });
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Clear all interceptors
   * 
   * @example
   * NetworkMocking.clearInterceptors();
   */
  clearInterceptors(): void {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Get request logs
   * 
   * @returns Array of logged requests
   * 
   * @example
   * const logs = NetworkMocking.getRequestLogs();
   * console.log(`Total requests: ${logs.length}`);
   */
  getRequestLogs(): any[] {
    return [...this.requestLogs];
  }

  /**
   * Clear request logs
   * 
   * @example
   * NetworkMocking.clearRequestLogs();
   */
  clearRequestLogs(): void {
    this.requestLogs = [];
  }

  /**
   * Find requests matching criteria
   * 
   * @param criteria - Search criteria
   * @returns Matching requests
   * 
   * @example
   * const postRequests = NetworkMocking.findRequests({ method: 'POST' });
   * const apiRequests = NetworkMocking.findRequests({ urlPattern: /\/api\// });
   */
  findRequests(criteria: {
    method?: string;
    urlPattern?: RegExp | string;
    bodyContains?: string;
  }): any[] {
    return this.requestLogs.filter((log) => {
      if (criteria.method && log.method !== criteria.method) {
        return false;
      }
      if (criteria.urlPattern) {
        if (typeof criteria.urlPattern === 'string') {
          if (!log.url.includes(criteria.urlPattern)) {
            return false;
          }
        } else if (!criteria.urlPattern.test(log.url)) {
          return false;
        }
      }
      if (criteria.bodyContains && log.body) {
        if (!log.body.includes(criteria.bodyContains)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Configure proxy settings for the driver
   * 
   * @param proxyConfig - Proxy configuration
   * @returns Proxy configuration string for capabilities
   * 
   * @example
   * const proxyString = NetworkMocking.configureProxy({
   *   host: 'localhost',
   *   port: 8080,
   *   protocol: 'http'
   * });
   */
  configureProxy(proxyConfig: ProxyConfig): string {
    const { host, port, protocol = 'http', username, password } = proxyConfig;

    let proxyUrl = `${protocol}://`;
    if (username && password) {
      proxyUrl += `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
    }
    proxyUrl += `${host}:${port}`;

    console.log(`Proxy configured: ${protocol}://${host}:${port}`);
    return proxyUrl;
  }

  /**
   * Set proxy in WebDriver capabilities
   * 
   * @param capabilities - Current capabilities object
   * @param proxyConfig - Proxy configuration
   * @returns Updated capabilities
   * 
   * @example
   * const caps = NetworkMocking.setProxyCapabilities(capabilities, {
   *   host: 'localhost',
   *   port: 8080
   * });
   */
  setProxyCapabilities<T extends Record<string, any>>(
    capabilities: T,
    proxyConfig: ProxyConfig
  ): T & { proxy: { proxyType: string; httpProxy: string; sslProxy: string; noProxy: string } } {
    const proxyUrl = this.configureProxy(proxyConfig);

    return {
      ...capabilities,
      proxy: {
        proxyType: 'manual',
        httpProxy: proxyUrl,
        sslProxy: proxyUrl,
        noProxy: proxyConfig.bypassList?.join(',') || '',
      },
    };
  }

  /**
   * Simulate network conditions (latency, bandwidth)
   * 
   * @param conditions - Network conditions to simulate
   * 
   * @example
   * NetworkMocking.simulateNetworkConditions({
   *   latency: 500, // 500ms delay
   *   offline: false
   * });
   */
  simulateNetworkConditions(conditions: {
    latency?: number;
    offline?: boolean;
    downloadThroughput?: number;
    uploadThroughput?: number;
  }): void {
    if (conditions.offline) {
      console.log('[NetworkMocking] Simulating offline mode');
      // Add interceptor to block all requests
      this.addResponseInterceptor(() => ({
        status: 503,
        body: { error: 'Network offline' },
      }));
    }

    if (conditions.latency) {
      console.log(`[NetworkMocking] Simulating ${conditions.latency}ms latency`);
      const latency = conditions.latency;
      // Add interceptor to add delay to responses
      this.addResponseInterceptor((response) => {
        // Return response with delay - the delay is applied in sendMockResponse
        // We add the latency to the response for processing
        return response; // The actual delay is handled by the delay property in MockResponse
      });
      
      // Add latency to all existing routes by wrapping their responses
      console.warn('[NetworkMocking] Latency simulation requires adding delay to individual routes');
    }

    // Note: Throughput simulation would require more complex implementation
    // with streaming and byte-rate limiting
    if (conditions.downloadThroughput || conditions.uploadThroughput) {
      console.warn('[NetworkMocking] Throughput simulation not fully implemented');
    }
  }

  /**
   * Wait for a specific request to be made
   * 
   * @param criteria - Request criteria to wait for
   * @param options - Wait options
   * @returns Promise that resolves when request is found
   * 
   * @example
   * await NetworkMocking.waitForRequest({
   *   method: 'POST',
   *   urlPattern: /\/api\/login/
   * }, { timeout: 5000 });
   */
  async waitForRequest(
    criteria: {
      method?: string;
      urlPattern?: RegExp | string;
      bodyContains?: string;
    },
    options: { timeout?: number; interval?: number } = {}
  ): Promise<any> {
    const { timeout = 10000, interval = 100 } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const requests = this.findRequests(criteria);
      if (requests.length > 0) {
        return requests[requests.length - 1]; // Return most recent matching request
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
      `Request not found within ${timeout}ms: ${JSON.stringify(criteria)}`
    );
  }

  /**
   * Assert that a request was made
   * 
   * @param criteria - Request criteria
   * @throws Error if request was not found
   * 
   * @example
   * NetworkMocking.assertRequestMade({ method: 'POST', urlPattern: /\/api\/users/ });
   */
  assertRequestMade(criteria: {
    method?: string;
    urlPattern?: RegExp | string;
    bodyContains?: string;
  }): void {
    const requests = this.findRequests(criteria);
    if (requests.length === 0) {
      throw new Error(`No requests found matching: ${JSON.stringify(criteria)}`);
    }
  }

  /**
   * Assert that a request was NOT made
   * 
   * @param criteria - Request criteria
   * @throws Error if request was found
   * 
   * @example
   * NetworkMocking.assertRequestNotMade({ method: 'DELETE', urlPattern: /\/api\/admin/ });
   */
  assertRequestNotMade(criteria: {
    method?: string;
    urlPattern?: RegExp | string;
    bodyContains?: string;
  }): void {
    const requests = this.findRequests(criteria);
    if (requests.length > 0) {
      throw new Error(
        `Found ${requests.length} request(s) matching: ${JSON.stringify(criteria)}`
      );
    }
  }

  /**
   * Get mock server URL
   * 
   * @returns Server URL or null if not running
   * 
   * @example
   * const url = NetworkMocking.getMockServerUrl();
   */
  getMockServerUrl(): string | null {
    if (!this.mockServer) {
      return null;
    }
    return `http://${this.serverHost}:${this.serverPort}`;
  }

  /**
   * Check if mock server is running
   * 
   * @returns True if server is running
   * 
   * @example
   * if (NetworkMocking.isMockServerRunning()) {
   *   console.log('Server is active');
   * }
   */
  isMockServerRunning(): boolean {
    return this.mockServer !== null;
  }

  /**
   * Reset all mocking state (routes, logs, interceptors)
   * Does not stop the server
   * 
   * @example
   * NetworkMocking.reset();
   */
  reset(): void {
    this.clearMockRoutes();
    this.clearRequestLogs();
    this.clearInterceptors();
    if (this.enableLogging) {
      console.log('[NetworkMocking] State reset');
    }
  }

  /**
   * Full cleanup - stops server and resets all state
   * 
   * @example
   * await NetworkMocking.cleanup();
   */
  async cleanup(): Promise<void> {
    this.reset();
    if (this.mockServer) {
      await this.stopMockServer();
    }
  }
}

// Export singleton instance
const NetworkMocking = new NetworkMockingClass();
export default NetworkMocking;
