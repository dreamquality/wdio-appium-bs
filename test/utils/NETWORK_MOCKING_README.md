# Network Mocking

Comprehensive network mocking and proxy configuration utility for API testing in mobile automation.

## Features

- **Mock Server**: Built-in HTTP server for API endpoint mocking
- **Request/Response Interception**: Modify requests and responses on-the-fly
- **Proxy Configuration**: Configure proxy settings for the driver
- **Request Logging**: Track and assert on network requests
- **Network Simulation**: Simulate network conditions (latency, offline mode)
- **Flexible Matching**: Route matching with strings or RegEx patterns

## Installation

No additional dependencies required - uses Node.js built-in `http` and `https` modules.

## Basic Usage

### Starting a Mock Server

```typescript
import NetworkMocking from '../utils/NetworkMocking';

// Start mock server
const serverUrl = await NetworkMocking.startMockServer({
  port: 8080,
  host: 'localhost',
  enableLogging: true
});

console.log(`Mock server running at: ${serverUrl}`);
```

### Adding Mock Routes

```typescript
// Simple GET request
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/users',
  response: {
    status: 200,
    body: {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ]
    }
  }
});

// POST request with delay
NetworkMocking.addMockRoute({
  method: 'POST',
  path: '/api/login',
  response: {
    status: 200,
    body: { token: 'abc123', user: { id: 1, name: 'John' } },
    delay: 500 // 500ms delay
  }
});

// Dynamic response based on request
NetworkMocking.addMockRoute({
  method: 'POST',
  path: '/api/users',
  response: (req) => {
    const body = JSON.parse(req.body);
    return {
      status: 201,
      body: { id: Math.random(), ...body }
    };
  }
});
```

### Pattern Matching with RegEx

```typescript
// Match multiple endpoints with regex
NetworkMocking.addMockRoute({
  method: 'GET',
  path: /^\/api\/users\/\d+$/,  // Matches /api/users/1, /api/users/123, etc.
  response: (req) => ({
    status: 200,
    body: { id: req.url.split('/').pop(), name: 'User' }
  })
});
```

### Limited Use Mocks

```typescript
// This mock will only work 3 times, then be removed
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/limited',
  response: { status: 200, body: { message: 'Success' } },
  times: 3  // After 3 requests, this route is removed
});
```

## Request/Response Interception

### Request Interceptor

```typescript
// Add custom headers to all requests
NetworkMocking.addRequestInterceptor((request) => {
  return {
    ...request,
    headers: {
      ...request.headers,
      'X-Custom-Header': 'test-value',
      'Authorization': 'Bearer mock-token'
    }
  };
});

// Modify request URL
NetworkMocking.addRequestInterceptor((request) => {
  if (request.url.includes('/v1/')) {
    return {
      ...request,
      url: request.url.replace('/v1/', '/v2/')
    };
  }
  return null; // No modification
});
```

### Response Interceptor

```typescript
// Add headers to all responses
NetworkMocking.addResponseInterceptor((response) => {
  return {
    ...response,
    headers: {
      ...response.headers,
      'X-Mock': 'true',
      'Access-Control-Allow-Origin': '*'
    }
  };
});

// Modify response body
NetworkMocking.addResponseInterceptor((response) => {
  if (response.request.url.includes('/api/')) {
    return {
      ...response,
      body: {
        ...response.body,
        timestamp: new Date().toISOString()
      }
    };
  }
  return null;
});
```

## Request Logging & Assertions

### Viewing Request Logs

```typescript
// Get all logged requests
const logs = NetworkMocking.getRequestLogs();
console.log(`Total requests: ${logs.length}`);

logs.forEach(log => {
  console.log(`${log.method} ${log.url} - ${log.timestamp}`);
});

// Find specific requests
const postRequests = NetworkMocking.findRequests({ method: 'POST' });
const apiRequests = NetworkMocking.findRequests({ urlPattern: /\/api\// });
const loginRequests = NetworkMocking.findRequests({ 
  method: 'POST', 
  urlPattern: '/api/login' 
});
```

### Waiting for Requests

```typescript
// Wait for a specific request to be made
try {
  const request = await NetworkMocking.waitForRequest(
    {
      method: 'POST',
      urlPattern: /\/api\/login/
    },
    {
      timeout: 5000,  // Wait up to 5 seconds
      interval: 100   // Check every 100ms
    }
  );
  console.log('Login request captured:', request);
} catch (error) {
  console.error('Login request not made within timeout');
}
```

### Asserting on Requests

```typescript
// Assert that a request was made
NetworkMocking.assertRequestMade({
  method: 'POST',
  urlPattern: /\/api\/users/
});

// Assert that a request was NOT made
NetworkMocking.assertRequestNotMade({
  method: 'DELETE',
  urlPattern: /\/api\/admin/
});

// Assert with body content
NetworkMocking.assertRequestMade({
  method: 'POST',
  urlPattern: '/api/login',
  bodyContains: 'username'
});
```

## Proxy Configuration

### Configure Proxy for Driver

```typescript
// Simple proxy configuration
const proxyString = NetworkMocking.configureProxy({
  host: 'localhost',
  port: 8080,
  protocol: 'http'
});

// Proxy with authentication
const authenticatedProxy = NetworkMocking.configureProxy({
  host: 'proxy.example.com',
  port: 3128,
  protocol: 'https',
  username: 'user',
  password: 'pass',
  bypassList: ['localhost', '127.0.0.1']
});
```

### Set Proxy in Capabilities

```typescript
// Update driver capabilities with proxy settings
const capabilities = {
  platformName: 'Android',
  deviceName: 'emulator',
  // ... other capabilities
};

const updatedCapabilities = NetworkMocking.setProxyCapabilities(
  capabilities,
  {
    host: 'localhost',
    port: 8080,
    bypassList: ['localhost']
  }
);

// Use updatedCapabilities when creating driver
```

## Network Conditions Simulation

### Simulate Network Latency

```typescript
// Add 500ms latency to all responses
NetworkMocking.simulateNetworkConditions({
  latency: 500
});

// Simulate offline mode
NetworkMocking.simulateNetworkConditions({
  offline: true
});

// Simulate slow connection (not fully implemented)
NetworkMocking.simulateNetworkConditions({
  latency: 1000,
  downloadThroughput: 50000,  // 50 KB/s
  uploadThroughput: 20000     // 20 KB/s
});
```

## Complete Test Example

```typescript
import NetworkMocking from '../utils/NetworkMocking';

describe('API Integration Tests', () => {
  before(async () => {
    // Start mock server before tests
    await NetworkMocking.startMockServer({ port: 8080 });
    
    // Add mock routes
    NetworkMocking.addMockRoute({
      method: 'GET',
      path: '/api/users',
      response: {
        status: 200,
        body: { users: [{ id: 1, name: 'Test User' }] }
      }
    });
    
    NetworkMocking.addMockRoute({
      method: 'POST',
      path: '/api/login',
      response: {
        status: 200,
        body: { token: 'test-token' },
        delay: 300
      }
    });
  });

  afterEach(() => {
    // Clear logs between tests
    NetworkMocking.clearRequestLogs();
  });

  after(async () => {
    // Cleanup after all tests
    await NetworkMocking.cleanup();
  });

  it('should make login request', async () => {
    // Your test code that makes network requests
    // ...
    
    // Assert that login request was made
    NetworkMocking.assertRequestMade({
      method: 'POST',
      urlPattern: '/api/login'
    });
    
    // Get the request details
    const loginRequests = NetworkMocking.findRequests({
      method: 'POST',
      urlPattern: '/api/login'
    });
    
    expect(loginRequests).toHaveLength(1);
  });

  it('should handle API errors', async () => {
    // Add error mock
    NetworkMocking.addMockRoute({
      method: 'GET',
      path: '/api/error',
      response: {
        status: 500,
        body: { error: 'Internal Server Error' }
      }
    });
    
    // Your test code
    // ...
  });
});
```

## Advanced Usage

### Multiple Responses for Same Route

```typescript
// First request returns success
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/data',
  response: { status: 200, body: { data: 'success' } },
  times: 1
});

// Second request returns error
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/data',
  response: { status: 500, body: { error: 'Server error' } },
  times: 1
});

// Third and subsequent requests return different response
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/data',
  response: { status: 200, body: { data: 'recovered' } }
});
```

### Complex Request Matching

```typescript
// Match and respond based on request body
NetworkMocking.addMockRoute({
  method: 'POST',
  path: '/api/users',
  response: (req) => {
    const body = JSON.parse(req.body);
    
    // Validate request
    if (!body.email || !body.password) {
      return {
        status: 400,
        body: { error: 'Missing required fields' }
      };
    }
    
    // Check credentials
    if (body.email === 'admin@test.com') {
      return {
        status: 200,
        body: { role: 'admin', token: 'admin-token' }
      };
    }
    
    return {
      status: 200,
      body: { role: 'user', token: 'user-token' }
    };
  }
});
```

### Conditional Interceptors

```typescript
// Add authentication only to API requests
NetworkMocking.addRequestInterceptor((request) => {
  if (request.url.startsWith('/api/')) {
    return {
      ...request,
      headers: {
        ...request.headers,
        'Authorization': 'Bearer test-token'
      }
    };
  }
  return null; // No modification for non-API requests
});
```

## API Reference

### Server Management
- `startMockServer(config)` - Start mock server
- `stopMockServer()` - Stop mock server
- `getMockServerUrl()` - Get server URL
- `isMockServerRunning()` - Check server status

### Route Management
- `addMockRoute(route)` - Add mock route
- `clearMockRoutes()` - Clear all routes

### Interceptors
- `addRequestInterceptor(fn)` - Add request interceptor
- `addResponseInterceptor(fn)` - Add response interceptor
- `clearInterceptors()` - Clear all interceptors

### Request Logging
- `getRequestLogs()` - Get all request logs
- `clearRequestLogs()` - Clear request logs
- `findRequests(criteria)` - Find matching requests
- `waitForRequest(criteria, options)` - Wait for specific request
- `assertRequestMade(criteria)` - Assert request was made
- `assertRequestNotMade(criteria)` - Assert request was not made

### Proxy Configuration
- `configureProxy(config)` - Create proxy configuration
- `setProxyCapabilities(caps, config)` - Update capabilities with proxy

### Network Simulation
- `simulateNetworkConditions(conditions)` - Simulate network conditions

### Cleanup
- `reset()` - Reset state (keep server running)
- `cleanup()` - Full cleanup (stop server and reset)

## Best Practices

1. **Always cleanup**: Use `after` hooks to stop the mock server and cleanup
2. **Clear logs**: Clear request logs between tests to avoid false assertions
3. **Use specific matchers**: Use RegEx for flexible but precise route matching
4. **Simulate delays**: Add realistic delays to mock responses
5. **Test error scenarios**: Mock different status codes and error responses
6. **Validate requests**: Use request interceptors to validate outgoing requests
7. **Isolate tests**: Clear routes between test suites to avoid interference

## Troubleshooting

**Server already running error**: Make sure to stop the server in `after` hooks

**Route not matching**: Check if route path is exact string or needs RegEx

**Proxy not working**: Ensure proxy configuration is set before creating driver

**Logs not cleared**: Call `clearRequestLogs()` between tests

**Mock not found**: Verify route is added before making requests

## Notes

- Mock server runs on localhost by default
- Request/response bodies are logged for debugging
- Interceptors are applied in the order they were added
- Routes are matched in the order they were added (first match wins)
- Limited-use routes (with `times` parameter) are automatically removed when exhausted
