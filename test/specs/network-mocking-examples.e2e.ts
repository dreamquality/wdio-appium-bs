/**
 * Network Mocking Examples
 * 
 * Comprehensive examples demonstrating network mocking capabilities
 */

import NetworkMocking from '../utils/NetworkMocking';

describe('Network Mocking Examples', () => {
  describe('Mock Server Management', () => {
    it('Example 1: Start and stop mock server', async () => {
      const serverUrl = await NetworkMocking.startMockServer({
        port: 8080,
        host: 'localhost',
        enableLogging: true
      });
      
      console.log(`Mock server started at: ${serverUrl}`);
      expect(NetworkMocking.isMockServerRunning()).toBe(true);
      
      await NetworkMocking.stopMockServer();
      expect(NetworkMocking.isMockServerRunning()).toBe(false);
    });

    it('Example 2: Get mock server URL', async () => {
      await NetworkMocking.startMockServer({ port: 8081 });
      
      const url = NetworkMocking.getMockServerUrl();
      expect(url).toBe('http://localhost:8081');
      
      await NetworkMocking.stopMockServer();
    });
  });

  describe('Mock Routes', () => {
    beforeEach(async () => {
      await NetworkMocking.startMockServer({ port: 8082, enableLogging: false });
    });

    afterEach(async () => {
      await NetworkMocking.cleanup();
    });

    it('Example 3: Simple GET mock', () => {
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/users',
        response: {
          status: 200,
          body: {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]
          }
        }
      });
      
      console.log('GET /api/users mock added');
    });

    it('Example 4: POST mock with response delay', () => {
      NetworkMocking.addMockRoute({
        method: 'POST',
        path: '/api/login',
        response: {
          status: 200,
          body: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            user: { id: 1, name: 'John Doe', role: 'admin' }
          },
          delay: 500 // Simulate 500ms network delay
        }
      });
      
      console.log('POST /api/login mock with delay added');
    });

    it('Example 5: Dynamic response based on request', () => {
      NetworkMocking.addMockRoute({
        method: 'POST',
        path: '/api/users',
        response: (req) => {
          const body = JSON.parse(req.body);
          
          return {
            status: 201,
            body: {
              id: Math.floor(Math.random() * 1000),
              ...body,
              createdAt: new Date().toISOString()
            }
          };
        }
      });
      
      console.log('Dynamic POST /api/users mock added');
    });

    it('Example 6: Mock with RegEx pattern matching', () => {
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: /^\/api\/users\/\d+$/,  // Matches /api/users/1, /api/users/123, etc.
        response: (req) => {
          const userId = req.url.split('/').pop();
          
          return {
            status: 200,
            body: {
              id: parseInt(userId),
              name: `User ${userId}`,
              email: `user${userId}@example.com`
            }
          };
        }
      });
      
      console.log('GET /api/users/:id mock with RegEx added');
    });

    it('Example 7: Limited use mock (expires after N uses)', () => {
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/limited',
        response: {
          status: 200,
          body: { message: 'Success' }
        },
        times: 3  // This mock will only work 3 times
      });
      
      console.log('Limited use mock added (3 times only)');
    });

    it('Example 8: Multiple status code mocks for same endpoint', () => {
      // First call returns success
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/flaky',
        response: { status: 200, body: { data: 'success' } },
        times: 1
      });
      
      // Second call returns error
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/flaky',
        response: { status: 500, body: { error: 'Server error' } },
        times: 1
      });
      
      // Subsequent calls return success again
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/flaky',
        response: { status: 200, body: { data: 'recovered' } }
      });
      
      console.log('Flaky endpoint mocks added');
    });

    it('Example 9: Error response mocks', () => {
      NetworkMocking.addMockRoute({
        method: 'POST',
        path: '/api/error',
        response: {
          status: 400,
          body: {
            error: 'Bad Request',
            message: 'Invalid input parameters',
            details: ['Email is required', 'Password is too short']
          }
        }
      });
      
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/unauthorized',
        response: {
          status: 401,
          body: { error: 'Unauthorized', message: 'Invalid credentials' }
        }
      });
      
      console.log('Error response mocks added');
    });

    it('Example 10: Clear all mock routes', () => {
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/test',
        response: { status: 200, body: {} }
      });
      
      NetworkMocking.clearMockRoutes();
      console.log('All routes cleared');
    });
  });

  describe('Request/Response Interception', () => {
    beforeEach(async () => {
      await NetworkMocking.startMockServer({ port: 8083, enableLogging: false });
    });

    afterEach(async () => {
      await NetworkMocking.cleanup();
    });

    it('Example 11: Add custom headers to all requests', () => {
      NetworkMocking.addRequestInterceptor((request) => {
        return {
          ...request,
          headers: {
            ...request.headers,
            'X-Custom-Header': 'test-value',
            'X-Request-ID': `req-${Date.now()}`
          }
        };
      });
      
      console.log('Request interceptor added for custom headers');
    });

    it('Example 12: Add authentication token to API requests', () => {
      NetworkMocking.addRequestInterceptor((request) => {
        if (request.url.startsWith('/api/')) {
          return {
            ...request,
            headers: {
              ...request.headers,
              'Authorization': 'Bearer test-token-12345'
            }
          };
        }
        return null; // No modification for non-API requests
      });
      
      console.log('Auth interceptor added for API requests');
    });

    it('Example 13: Modify request URLs', () => {
      NetworkMocking.addRequestInterceptor((request) => {
        // Redirect v1 API calls to v2
        if (request.url.includes('/v1/')) {
          return {
            ...request,
            url: request.url.replace('/v1/', '/v2/')
          };
        }
        return null;
      });
      
      console.log('URL modification interceptor added');
    });

    it('Example 14: Add headers to all responses', () => {
      NetworkMocking.addResponseInterceptor((response) => {
        return {
          ...response,
          headers: {
            ...response.headers,
            'X-Mock': 'true',
            'X-Response-Time': Date.now().toString(),
            'Access-Control-Allow-Origin': '*'
          }
        };
      });
      
      console.log('Response header interceptor added');
    });

    it('Example 15: Add timestamp to all responses', () => {
      NetworkMocking.addResponseInterceptor((response) => {
        if (response.body && typeof response.body === 'object') {
          return {
            ...response,
            body: {
              ...response.body,
              _timestamp: new Date().toISOString(),
              _mock: true
            }
          };
        }
        return null;
      });
      
      console.log('Timestamp interceptor added');
    });

    it('Example 16: Clear all interceptors', () => {
      NetworkMocking.addRequestInterceptor((req) => req);
      NetworkMocking.addResponseInterceptor((res) => res);
      
      NetworkMocking.clearInterceptors();
      console.log('All interceptors cleared');
    });
  });

  describe('Request Logging & Assertions', () => {
    beforeEach(async () => {
      await NetworkMocking.startMockServer({ port: 8084, enableLogging: false });
      NetworkMocking.clearRequestLogs();
    });

    afterEach(async () => {
      await NetworkMocking.cleanup();
    });

    it('Example 17: View all request logs', () => {
      // Simulate some logged requests
      console.log('View all logged requests');
      
      const logs = NetworkMocking.getRequestLogs();
      logs.forEach(log => {
        console.log(`${log.method} ${log.url} - ${log.timestamp}`);
      });
    });

    it('Example 18: Find requests by method', () => {
      const postRequests = NetworkMocking.findRequests({ method: 'POST' });
      console.log(`Found ${postRequests.length} POST requests`);
      
      const getRequests = NetworkMocking.findRequests({ method: 'GET' });
      console.log(`Found ${getRequests.length} GET requests`);
    });

    it('Example 19: Find requests by URL pattern', () => {
      // Find all API requests
      const apiRequests = NetworkMocking.findRequests({
        urlPattern: /\/api\//
      });
      console.log(`Found ${apiRequests.length} API requests`);
      
      // Find login requests
      const loginRequests = NetworkMocking.findRequests({
        urlPattern: '/api/login'
      });
      console.log(`Found ${loginRequests.length} login requests`);
    });

    it('Example 20: Find requests by body content', () => {
      const requestsWithEmail = NetworkMocking.findRequests({
        bodyContains: 'email'
      });
      console.log(`Found ${requestsWithEmail.length} requests containing "email"`);
    });

    it('Example 21: Wait for specific request', async () => {
      // In real test, your app would make this request
      // Here we're just demonstrating the wait functionality
      
      console.log('Waiting for login request...');
      
      try {
        const request = await NetworkMocking.waitForRequest(
          {
            method: 'POST',
            urlPattern: /\/api\/login/
          },
          {
            timeout: 5000,
            interval: 100
          }
        );
        
        console.log('Login request captured:', request.method, request.url);
      } catch (error) {
        console.log('Request not made within timeout (expected in this example)');
      }
    });

    it('Example 22: Assert that request was made', () => {
      try {
        NetworkMocking.assertRequestMade({
          method: 'POST',
          urlPattern: /\/api\/users/
        });
        console.log('Assertion passed: POST /api/users was made');
      } catch (error) {
        console.log('Assertion failed (expected if no requests made)');
      }
    });

    it('Example 23: Assert that request was NOT made', () => {
      try {
        NetworkMocking.assertRequestNotMade({
          method: 'DELETE',
          urlPattern: /\/api\/admin/
        });
        console.log('Assertion passed: DELETE /api/admin was not made');
      } catch (error) {
        console.log('Assertion failed: request was made');
      }
    });

    it('Example 24: Clear request logs', () => {
      const beforeCount = NetworkMocking.getRequestLogs().length;
      console.log(`Requests before clear: ${beforeCount}`);
      
      NetworkMocking.clearRequestLogs();
      
      const afterCount = NetworkMocking.getRequestLogs().length;
      console.log(`Requests after clear: ${afterCount}`);
    });
  });

  describe('Proxy Configuration', () => {
    it('Example 25: Simple proxy configuration', () => {
      const proxyString = NetworkMocking.configureProxy({
        host: 'localhost',
        port: 8080,
        protocol: 'http'
      });
      
      console.log('Proxy configured:', proxyString);
      expect(proxyString).toBe('http://localhost:8080');
    });

    it('Example 26: Proxy with authentication', () => {
      const proxyString = NetworkMocking.configureProxy({
        host: 'proxy.example.com',
        port: 3128,
        protocol: 'https',
        username: 'testuser',
        password: 'testpass'
      });
      
      console.log('Authenticated proxy configured');
      expect(proxyString).toContain('testuser');
    });

    it('Example 27: Proxy with bypass list', () => {
      const proxyConfig = {
        host: 'localhost',
        port: 8080,
        protocol: 'http' as const,
        bypassList: ['localhost', '127.0.0.1', '*.local']
      };
      
      const proxyString = NetworkMocking.configureProxy(proxyConfig);
      console.log('Proxy with bypass list configured:', proxyString);
    });

    it('Example 28: Set proxy in driver capabilities', () => {
      const capabilities = {
        platformName: 'Android',
        deviceName: 'emulator',
        automationName: 'UiAutomator2'
      };
      
      const updatedCapabilities = NetworkMocking.setProxyCapabilities(
        capabilities,
        {
          host: 'localhost',
          port: 8080,
          bypassList: ['localhost']
        }
      );
      
      console.log('Capabilities updated with proxy settings');
      expect(updatedCapabilities.proxy).toBeDefined();
      expect(updatedCapabilities.proxy.proxyType).toBe('manual');
    });
  });

  describe('Network Simulation', () => {
    it('Example 29: Simulate network latency', () => {
      NetworkMocking.simulateNetworkConditions({
        latency: 500  // 500ms delay
      });
      
      console.log('Network latency of 500ms simulated');
    });

    it('Example 30: Simulate offline mode', () => {
      NetworkMocking.simulateNetworkConditions({
        offline: true
      });
      
      console.log('Offline mode simulated');
    });

    it('Example 31: Simulate slow connection', () => {
      NetworkMocking.simulateNetworkConditions({
        latency: 1000,
        downloadThroughput: 50000,  // 50 KB/s
        uploadThroughput: 20000     // 20 KB/s
      });
      
      console.log('Slow connection simulated');
    });
  });

  describe('Advanced Scenarios', () => {
    beforeEach(async () => {
      await NetworkMocking.startMockServer({ port: 8085, enableLogging: false });
    });

    afterEach(async () => {
      await NetworkMocking.cleanup();
    });

    it('Example 32: Conditional responses based on request body', () => {
      NetworkMocking.addMockRoute({
        method: 'POST',
        path: '/api/login',
        response: (req) => {
          const body = JSON.parse(req.body);
          
          // Admin login
          if (body.email === 'admin@test.com' && body.password === 'admin123') {
            return {
              status: 200,
              body: {
                token: 'admin-token',
                user: { id: 1, name: 'Admin', role: 'admin' }
              }
            };
          }
          
          // Regular user login
          if (body.email === 'user@test.com' && body.password === 'user123') {
            return {
              status: 200,
              body: {
                token: 'user-token',
                user: { id: 2, name: 'User', role: 'user' }
              }
            };
          }
          
          // Invalid credentials
          return {
            status: 401,
            body: { error: 'Invalid credentials' }
          };
        }
      });
      
      console.log('Conditional login mock added');
    });

    it('Example 33: Simulate paginated API', () => {
      // Page 1
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: /\/api\/users\?page=1/,
        response: {
          status: 200,
          body: {
            data: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }],
            page: 1,
            total: 5,
            hasMore: true
          }
        }
      });
      
      // Page 2
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: /\/api\/users\?page=2/,
        response: {
          status: 200,
          body: {
            data: [{ id: 3, name: 'User 3' }, { id: 4, name: 'User 4' }],
            page: 2,
            total: 5,
            hasMore: true
          }
        }
      });
      
      console.log('Paginated API mocks added');
    });

    it('Example 34: Complete test workflow', async () => {
      // Setup mocks
      NetworkMocking.addMockRoute({
        method: 'POST',
        path: '/api/login',
        response: {
          status: 200,
          body: { token: 'test-token' }
        }
      });
      
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/profile',
        response: {
          status: 200,
          body: { id: 1, name: 'Test User', email: 'test@example.com' }
        }
      });
      
      // Add auth interceptor
      NetworkMocking.addRequestInterceptor((request) => {
        if (request.url.startsWith('/api/') && !request.url.includes('/login')) {
          return {
            ...request,
            headers: {
              ...request.headers,
              'Authorization': 'Bearer test-token'
            }
          };
        }
        return null;
      });
      
      console.log('Complete test workflow setup with mocks and interceptors');
      
      // In a real test, your app would make requests here
      // Then you would assert on the requests
    });

    it('Example 35: Reset and cleanup', async () => {
      // Add some routes and logs
      NetworkMocking.addMockRoute({
        method: 'GET',
        path: '/api/test',
        response: { status: 200, body: {} }
      });
      
      // Reset (keeps server running)
      NetworkMocking.reset();
      console.log('State reset - server still running');
      
      expect(NetworkMocking.isMockServerRunning()).toBe(true);
      expect(NetworkMocking.getRequestLogs()).toHaveLength(0);
      
      // Full cleanup (stops server)
      await NetworkMocking.cleanup();
      console.log('Full cleanup completed - server stopped');
      
      expect(NetworkMocking.isMockServerRunning()).toBe(false);
    });
  });
});
