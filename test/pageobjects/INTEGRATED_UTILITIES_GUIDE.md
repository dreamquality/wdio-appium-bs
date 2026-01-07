# Integrated Utilities in Page Objects

All utility features are now integrated directly into the base `Page` class, making them accessible from any page object throughout your test suite.

## Overview

The following utilities are available as properties on every page object:

- **`smartWaits`** - Advanced wait strategies
- **`elementHelpers`** - Intelligent element interactions
- **`platform`** - Platform detection and handling
- **`testData`** - Test data management
- **`gestures`** - Advanced gesture controls
- **`appMgmt`** - App lifecycle management
- **`network`** - Network mocking and proxy configuration

## Quick Start

```typescript
import entry from '../pageobjects/entry.page.js'

// All utilities accessible through page object
await entry.smartWaits.waitForElementClickable('~button');
await entry.elementHelpers.smartClick('~button', { retries: 3 });
const platform = entry.platform.getPlatform();
const user = entry.testData.getUser('default');
await entry.gestures.pinchOut('~map', { scale: 2.0 });
await entry.appMgmt.ensureAppInForeground('com.app');
```

## Usage Examples

### Smart Waits

```typescript
// Wait for element with custom timeout
await entry.smartWaits.waitForElementVisible('~button', { timeout: 15000 });

// Wait for any of multiple elements
const visibleElement = await entry.smartWaits.waitForAnyElementVisible([
  '~errorMsg',
  '~successMsg'
]);

// Fluent wait with custom condition
const result = await entry.smartWaits.fluentWait(
  async () => await entry.isEntryTitleDisplayed('~title'),
  { timeout: 10000, pollingInterval: 500 }
);

// Retry operation
await entry.smartWaits.retryOperation(
  async () => await entry.clickSignUpButton('~btn'),
  { maxRetries: 3, delay: 1000 }
);
```

### Element Interaction Helpers

```typescript
// Smart click with scroll and retry
await entry.elementHelpers.smartClick('~button', {
  scrollIntoView: true,
  retries: 3,
  takeScreenshotOnError: true
});

// Smart input with validation
await entry.elementHelpers.smartInput('~emailField', 'user@example.com', {
  validateInput: true,
  hideKeyboard: true,
  clearFirst: true
});

// Smart swipe
await entry.elementHelpers.smartSwipe('~carousel', {
  direction: 'left',
  duration: 500
});

// Chain interactions
await entry.elementHelpers.chainInteractions(
  async () => await entry.elementHelpers.smartInput('~username', 'user'),
  async () => await entry.elementHelpers.smartInput('~password', 'pass'),
  async () => await entry.elementHelpers.smartClick('~loginBtn')
);
```

### Platform Detection

```typescript
// Check platform
if (entry.platform.isAndroid()) {
  await entry.platform.pressBackButton();
}

// Select platform-specific selector
const button = entry.platform.selectPlatformSelector({
  android: '//android.widget.Button[@text="Login"]',
  ios: '//XCUIElementTypeButton[@label="Login"]'
});

// Build platform-specific XPath
const xpath = entry.platform.buildPlatformXPath({
  text: 'Submit',
  className: 'Button'
});

// Get platform-specific value
const timeout = entry.platform.getPlatformValue({
  android: 10000,
  ios: 15000
});

// Platform-specific actions
await entry.platform.hideKeyboard();
await entry.platform.scrollDown(0.5);
```

### Test Data Management

```typescript
// Get user data
const user = entry.testData.getUser('default');
await entry.elementHelpers.smartInput('~username', user.username);
await entry.elementHelpers.smartInput('~password', user.password);

// Get configuration
const timeout = entry.testData.getConfig<number>('timeouts.default');

// Get endpoints
const apiUrl = entry.testData.getEndpoint('api');

// Get locators
const loginButton = entry.testData.getLocator('loginButton');

// Generate random data
const email = entry.testData.generateRandomEmail('test');
const password = entry.testData.generateRandomPassword(12);

// Switch environments
entry.testData.setEnvironment('staging');
const stagingUser = entry.testData.getUser('default');
```

### Advanced Gestures

```typescript
// Pinch to zoom
await entry.gestures.pinchOut('~mapView', {
  scale: 2.0,
  duration: 500
});

// Rotate element
await entry.gestures.rotate('~imageView', {
  angle: 90,
  duration: 1000
});

// Edge swipe (navigation drawer)
await entry.gestures.edgeSwipe('left', {
  distance: 300,
  duration: 500
});

// Circular swipe (volume knob)
await entry.gestures.circularSwipe('~volumeKnob', {
  angle: 180,
  radius: 100
});

// Swipe with coordinates
await entry.gestures.swipeWithCoordinates(100, 500, 100, 300, {
  duration: 500
});

// Scroll by percentage
await entry.gestures.scrollByPercentage(0.5, { duration: 500 });
```

### App Management

```typescript
const bundleId = 'com.example.app';

// Check installation
const isInstalled = await entry.appMgmt.isAppInstalled(bundleId);

// Install app
await entry.appMgmt.installApp('/path/to/app.apk', {
  grantPermissions: true,
  replace: true
});

// Lifecycle control
await entry.appMgmt.launchApp(bundleId);
await entry.appMgmt.backgroundApp(5); // 5 seconds
await entry.appMgmt.restartApp(bundleId);

// State management
const state = await entry.appMgmt.getAppState(bundleId);
await entry.appMgmt.ensureAppInForeground(bundleId);
await entry.appMgmt.waitForAppState(bundleId, 4, { timeout: 10000 });

// Clear data (Android)
if (entry.platform.isAndroid()) {
  await entry.appMgmt.clearAppData(bundleId);
}

// Grant permissions (Android)
if (entry.platform.isAndroid()) {
  await entry.appMgmt.grantPermissions(bundleId, [
    'android.permission.CAMERA',
    'android.permission.READ_EXTERNAL_STORAGE'
  ]);
}
```

### Network Mocking

```typescript
// Start mock server
await entry.network.startMockServer({ port: 8080 });

// Add mock routes
entry.network.addMockRoute({
  method: 'GET',
  path: '/api/users',
  response: {
    status: 200,
    body: { users: [{ id: 1, name: 'John' }] }
  }
});

// Dynamic response
entry.network.addMockRoute({
  method: 'POST',
  path: '/api/login',
  response: (req) => {
    const body = JSON.parse(req.body);
    return {
      status: 200,
      body: { token: 'token123', user: body.username }
    };
  }
});

// Add interceptor
entry.network.addRequestInterceptor((request) => ({
  ...request,
  headers: { ...request.headers, 'Authorization': 'Bearer token' }
}));

// Wait for request
await entry.network.waitForRequest({
  method: 'POST',
  urlPattern: /\/api\/login/,
  timeout: 5000
});

// Assert requests
entry.network.assertRequestMade({
  method: 'POST',
  urlPattern: /\/api\/login/
});

// Get request logs
const requests = entry.network.getRequestLogs();

// Cleanup
await entry.network.cleanup();
```

## Real-World Scenario

Here's a complete example combining multiple utilities:

```typescript
describe('Login Flow', () => {
  it('should perform complete login with all utilities', async () => {
    // 1. Get test data
    const user = entry.testData.getUser('default');
    const timeout = entry.testData.getConfig<number>('timeouts.default');
    
    // 2. Setup network mocking
    await entry.network.startMockServer({ port: 8080 });
    entry.network.addMockRoute({
      method: 'POST',
      path: '/api/auth/login',
      response: { status: 200, body: { token: 'mock-token', success: true } }
    });
    
    // 3. Ensure app is ready
    await entry.appMgmt.ensureAppInForeground('com.example.app');
    
    // 4. Build platform-specific selector
    const loginButton = entry.platform.selectPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: '//XCUIElementTypeButton[@label="Login"]'
    });
    
    // 5. Wait for login screen
    await entry.smartWaits.waitForElementVisible(loginButton, { timeout });
    
    // 6. Perform login
    await entry.elementHelpers.chainInteractions(
      async () => await entry.elementHelpers.smartInput('~username', user.username, {
        clearFirst: true,
        validateInput: true
      }),
      async () => await entry.elementHelpers.smartInput('~password', user.password, {
        clearFirst: true,
        hideKeyboard: true
      }),
      async () => await entry.elementHelpers.smartClick(loginButton, {
        scrollIntoView: true,
        retries: 3
      })
    );
    
    // 7. Verify login request
    entry.network.assertRequestMade({
      method: 'POST',
      urlPattern: /\/api\/auth\/login/
    });
    
    // 8. Cleanup
    await entry.network.cleanup();
  });
});
```

## Benefits

✅ **Unified API** - All utilities accessible from page objects
✅ **No Import Overhead** - Utilities already imported in base class
✅ **Consistent Usage** - Same pattern across all tests
✅ **Type Safety** - Full TypeScript support
✅ **Better Organization** - Logical grouping of functionality
✅ **Easy Discovery** - IDE autocomplete shows all utilities
✅ **Maintainable** - Single point of integration
✅ **Backward Compatible** - Existing page object methods still work

## Migration from Example Files

**Before** (using utilities from separate files):
```typescript
import SmartWaits from '../utils/SmartWaits.js'
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers.js'

await SmartWaits.waitForElementVisible('~button');
await ElementInteractionHelpers.smartClick('~button');
```

**After** (using utilities from page object):
```typescript
import entry from '../pageobjects/entry.page.js'

await entry.smartWaits.waitForElementVisible('~button');
await entry.elementHelpers.smartClick('~button');
```

## Custom Page Objects

Create your own page objects with access to all utilities:

```typescript
import Page from './page.js';

class LoginPage extends Page {
  private usernameField = '~username';
  private passwordField = '~password';
  private loginButton = '~login';

  async login(username: string, password: string) {
    // Use integrated utilities
    await this.elementHelpers.chainInteractions(
      async () => await this.elementHelpers.smartInput(this.usernameField, username, {
        clearFirst: true
      }),
      async () => await this.elementHelpers.smartInput(this.passwordField, password, {
        clearFirst: true,
        hideKeyboard: true
      }),
      async () => await this.elementHelpers.smartClick(this.loginButton, {
        retries: 3
      })
    );
  }

  async loginWithMockData() {
    // Use test data manager
    const user = this.testData.getUser('default');
    await this.login(user.username, user.password);
  }

  async loginWithPlatformSpecific() {
    // Use platform detection
    const loginBtn = this.platform.selectPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: '//XCUIElementTypeButton[@label="Login"]'
    });
    
    await this.smartWaits.waitForElementClickable(loginBtn);
    await this.elementHelpers.smartClick(loginBtn);
  }
}

export default new LoginPage();
```

## See Also

- [Smart Waits Documentation](../utils/SMART_WAITS_README.md)
- [Element Interaction Helpers Documentation](../utils/ELEMENT_INTERACTION_README.md)
- [Platform Detection Documentation](../utils/PLATFORM_DETECTION_README.md)
- [Test Data Management Documentation](../utils/TEST_DATA_MANAGEMENT_README.md)
- [Advanced Gestures Documentation](../utils/ADVANCED_GESTURES_README.md)
- [App Management Documentation](../utils/APP_MANAGEMENT_README.md)
- [Network Mocking Documentation](../utils/NETWORK_MOCKING_README.md)
- [Example Test](../specs/integrated-utilities.e2e.ts)
