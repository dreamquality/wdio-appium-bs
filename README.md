
# e2e-tests: WebdriverIO v9, Appium v3, Hybrid App (Android & iOS), BrowserStack

Template for end-to-end testing with hybrid mobile applications.

## 🚀 Features

- ✅ **WebdriverIO v9** with TypeScript support
- ✅ **Appium v3** for mobile automation
- ✅ **BrowserStack** integration for cloud testing
- ✅ **Allure Reports** with automatic step tracking
- ✅ **Smart Waits** - Advanced wait strategies for reliable tests
- ✅ **Element Interaction Helpers** - Intelligent interactions with auto-retry
- ✅ **Platform Detection** - Automatic Android/iOS handling
- ✅ **Test Data Management** - JSON/YAML support with environment handling
- ✅ **Advanced Gestures** - Multi-touch, pinch/zoom, rotation, complex gesture chains
- ✅ **App Management** - Install/uninstall helpers, app state management
- ✅ **Network Mocking** - API mocking, proxy configuration, request/response interception
- ✅ **Page Object Pattern** with comprehensive utilities
- ✅ **CI/CD Ready** with GitHub Actions

## 💡 Smart Waits Enhancement

This boilerplate includes a comprehensive **Smart Waits** utility that provides robust, configurable wait strategies for mobile automation:

- **Element State Waits**: Present, Visible, Clickable, Enabled
- **Content Waits**: Text, Attributes, Element Count
- **Advanced Strategies**: Fluent Wait, Exponential Backoff, Smart Retry
- **Multiple Element Handling**: Wait for any/all elements
- **Viewport Detection**: Wait for elements in viewport
- **Automatic Error Handling**: Non-throwing waits with graceful fallbacks

📖 **[Full Smart Waits Documentation](test/utils/SMART_WAITS_README.md)**

### Quick Example

```typescript
import SmartWaits from '../utils/SmartWaits';

// Wait for element to be clickable before interaction
await SmartWaits.waitForElementClickable('~loginButton', { timeout: 15000 });

// Wait for any element (conditional flows)
const element = await SmartWaits.waitForAnyElementVisible([
  '~errorMessage',
  '~successMessage'
]);

// Smart retry for unstable operations
await SmartWaits.retryOperation(
  async () => await $('~button').click(),
  { maxRetries: 3 }
);
```

## 🎯 Element Interaction Helpers

**Element Interaction Helpers** provide intelligent interaction methods with built-in retry logic, state validation, and error handling:

- **Smart Click & Tap**: Auto-retry clicking with state validation
- **Smart Input**: Text input with validation and keyboard handling
- **Gestures**: Swipe, drag, long press, double tap
- **Smart Select**: Dropdown/picker selection with fallbacks
- **Smart Toggle**: Checkbox/switch management with verification
- **Safe Interactions**: Error-proof wrappers for optional elements
- **Interaction Chains**: Sequential operations with automatic error handling

📖 **[Full Element Interaction Documentation](test/utils/ELEMENT_INTERACTION_README.md)**

### Quick Example

```typescript
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';

// Smart click with auto-retry and scroll
await ElementInteractionHelpers.smartClick('~button', {
  scrollIntoView: true,
  retries: 3
});

// Smart input with validation
await ElementInteractionHelpers.smartInput('~email', 'user@example.com', {
  validateInput: true,
  hideKeyboard: true
});

// Swipe gesture
await ElementInteractionHelpers.smartSwipe('~carousel', {
  direction: 'left'
});

// Chain multiple interactions
await ElementInteractionHelpers.chainInteractions(
  async () => await ElementInteractionHelpers.smartInput('~username', 'user'),
  async () => await ElementInteractionHelpers.smartInput('~password', 'pass'),
  async () => await ElementInteractionHelpers.smartClick('~login')
);
```

## 📱 Platform Detection

**Platform Detection** provides automatic Android/iOS detection with platform-specific handling for seamless cross-platform automation:

- **Automatic Detection**: `isAndroid()`, `isIOS()`, `getPlatform()`
- **Platform Info**: Detailed device and platform information
- **Smart Selectors**: Automatic platform-specific selector selection
- **XPath Builder**: Generate platform-specific XPath automatically
- **Platform Actions**: Keyboard hiding, back button, alert handling
- **App Management**: Terminate/activate apps with platform-specific APIs
- **Device Control**: Orientation, scrolling, gesture durations
- **Configuration**: Platform-specific timeouts and settings

📖 **[Full Platform Detection Documentation](test/utils/PLATFORM_DETECTION_README.md)**

### Quick Example

```typescript
import PlatformDetection from '../utils/PlatformDetection';

// Automatic platform detection
if (PlatformDetection.isAndroid()) {
  await PlatformDetection.pressBackButton();
}

// Platform-specific selectors
const button = PlatformDetection.selectPlatformSelector({
  android: '//android.widget.Button[@text="Login"]',
  ios: '//XCUIElementTypeButton[@label="Login"]'
});

// Build platform-specific XPath
const xpath = PlatformDetection.buildPlatformXPath({
  text: 'Submit',
  className: 'Button'
});

// Platform-specific configuration
const timeout = PlatformDetection.getPlatformValue({
  android: 10000,
  ios: 15000
});

// Hide keyboard (works on both platforms)
await PlatformDetection.hideKeyboard();

// Execute platform-specific actions
await PlatformDetection.executePlatformSpecific(
  async () => console.log('Android'),
  async () => console.log('iOS')
);
```

## 📊 Test Data Management

**Test Data Management** provides a comprehensive system for loading and managing test data from JSON and YAML files with environment support:

- **Multiple Formats**: JSON and YAML support
- **Environment-Specific**: Load data based on environment (dev, staging, prod)
- **Environment Overrides**: Override data with environment variables
- **Type-Safe Access**: Generic type support for type safety
- **Nested Data**: Access nested data with dot notation
- **Caching**: Built-in caching for performance
- **Random Generation**: Generate random emails, usernames, passwords
- **Data Validation**: Validate data against custom schemas

📖 **[Full Test Data Management Documentation](test/utils/TEST_DATA_MANAGEMENT_README.md)**

### Quick Example

```typescript
import TestDataManager from '../utils/TestDataManager';

const tdm = TestDataManager.getInstance();

// Load user data
const user = tdm.getUser('default');
console.log(user.username, user.password);

// Get configuration
const timeout = tdm.getConfig<number>('timeouts.default');

// Get locators
const loginButton = tdm.getLocator('loginButton');

// Environment-specific data
tdm.setEnvironment('staging');
const stagingUser = tdm.getUser('default');

// Random data generation
const email = TestDataManager.generateRandomEmail('test');
const password = TestDataManager.generateRandomPassword(12);

// Nested data access
const apiTimeout = tdm.getData('config', 'timeouts.long');
```

## 🎨 Advanced Gestures

**Advanced Gestures** provides comprehensive gesture support including multi-touch, pinch/zoom, rotation, and complex gesture chains:

- **Multi-Touch**: Pinch in/out, rotate, two-finger tap, custom multi-touch
- **Precise Control**: Coordinate-based swipes, velocity-based flicks
- **Complex Gestures**: Gesture chains, circular swipes, drag and drop
- **Edge Gestures**: Swipe from screen edges
- **Percentage Scrolling**: Scroll by screen percentage
- **Platform Compatible**: Works on both Android and iOS

📖 **[Full Advanced Gestures Documentation](test/utils/ADVANCED_GESTURES_README.md)**

### Quick Example

```typescript
import AdvancedGestures from '../utils/AdvancedGestures';

// Pinch out to zoom in
await AdvancedGestures.pinchOut('~imageView', { scale: 2.5 });

// Rotate element 90 degrees
await AdvancedGestures.rotate('~photoView', { rotation: 90 });

// Two-finger tap
await AdvancedGestures.twoFingerTap('~textView');

// Edge swipe (e.g., open navigation drawer)
await AdvancedGestures.edgeSwipe('left');

// Scroll by percentage
await AdvancedGestures.scrollByPercentage('down', 0.5);

// Flick with velocity
await AdvancedGestures.flick({
  startX: 200, startY: 800,
  endX: 200, endY: 200,
  velocity: 3000
});

// Complex gesture chain
await AdvancedGestures.gestureChain(
  async () => await AdvancedGestures.pinchOut('~image', { scale: 2 }),
  async () => await AdvancedGestures.rotate('~image', { rotation: 45 }),
  async () => await AdvancedGestures.pinchIn('~image', { scale: 0.5 })
);
```

## 📦 App Management

**App Management** provides comprehensive app lifecycle management for mobile automation:

- **Install/Uninstall**: Install, uninstall, and check installation status
- **App Lifecycle**: Launch, close, terminate, restart, reset apps
- **State Management**: Query app state, background/foreground control
- **Data Management**: Clear app data, get app strings
- **Permissions**: Grant and revoke permissions (Android)
- **Activity Control**: Start activities, get current activity/package (Android)
- **Wait Utilities**: Wait for app states, ensure foreground

📖 **[Full App Management Documentation](test/utils/APP_MANAGEMENT_README.md)**

### Quick Example

```typescript
import AppManagement from '../utils/AppManagement';

// Install app
await AppManagement.installApp('/path/to/app.apk', {
  grantPermissions: true
});

// Check installation
const installed = await AppManagement.isAppInstalled('com.example.app');

// Launch and verify state
await AppManagement.launchApp('com.example.app');
const inForeground = await AppManagement.isAppInForeground('com.example.app');

// Background for 5 seconds
await AppManagement.backgroundApp(5);

// Terminate and relaunch
await AppManagement.terminateApp('com.example.app');
await AppManagement.launchApp('com.example.app');

// Clear app data (Android)
await AppManagement.clearAppData('com.example.app');

// Grant permissions (Android)
await AppManagement.grantPermissions('com.example.app', [
  'android.permission.CAMERA',
  'android.permission.READ_CONTACTS'
]);

// Ensure app is in foreground (auto launch/activate)
await AppManagement.ensureAppInForeground('com.example.app');

// Restart app (kill and relaunch)
await AppManagement.restartApp('com.example.app');
```

## 🌐 Network Mocking

**Network Mocking** provides comprehensive network interception and API mocking capabilities:

- **Mock Server**: Built-in HTTP server for API endpoint mocking
- **Request/Response Interception**: Modify requests and responses on-the-fly
- **Proxy Configuration**: Configure proxy settings for the driver
- **Request Logging**: Track and assert on network requests
- **Network Simulation**: Simulate network conditions (latency, offline mode)
- **Flexible Matching**: Route matching with strings or RegEx patterns

📖 **[Full Network Mocking Documentation](test/utils/NETWORK_MOCKING_README.md)**

### Quick Example

```typescript
import NetworkMocking from '../utils/NetworkMocking';

// Start mock server
await NetworkMocking.startMockServer({ port: 8080 });

// Add mock routes
NetworkMocking.addMockRoute({
  method: 'GET',
  path: '/api/users',
  response: {
    status: 200,
    body: { users: [{ id: 1, name: 'John' }] }
  }
});

// Dynamic response
NetworkMocking.addMockRoute({
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

// Add request interceptor
NetworkMocking.addRequestInterceptor((request) => ({
  ...request,
  headers: { ...request.headers, 'Authorization': 'Bearer token' }
}));

// Assert requests
NetworkMocking.assertRequestMade({
  method: 'POST',
  urlPattern: /\/api\/login/
});

// Configure proxy
const proxyString = NetworkMocking.configureProxy({
  host: 'localhost',
  port: 8080
});

// Cleanup
await NetworkMocking.cleanup();
```

## Setup

### Install Required Software and Project Checkout

1. Download and install [Node.js](https://nodejs.org/) (version 20.19 or higher).
2. Install TypeScript (version 5 or higher).
3. Install Visual Studio Code.
4. Clone the GitHub project repository.
5. Run `npm install` to install project dependencies.
6. Install Appium 3 globally:
   ```sh
   npm install -g appium@latest
   ```
7. Install necessary Appium drivers:
   ```sh
   appium driver install uiautomator2
   appium driver install xcuitest
   ```

## BrowserStack Configuration

1. Create a `.env` file in the project root with the following variables:
   - `BROWSERSTACK_USERNAME`
   - `BROWSERSTACK_ACCESS_KEY`
   - `BROWSERSTACK_ANDROID_APP_ID`
   - `BROWSERSTACK_IOS_APP_ID`
2. Sign in to [BrowserStack](https://www.browserstack.com/), upload your mobile app files (`.apk` for Android and `.ipa` for iOS), and note the app IDs.
3. Update the `.env` file with your credentials and app IDs.
4. Run the Android tests with BrowserStack using:
   ```sh
   npm run test:android:bs
   ```

### Running Android Tests on Windows

To run Android tests on a Windows machine, ensure the following setup:

1. Install the latest version of [Java](https://www.java.com/download/manual.jsp) and set the `JAVA_HOME` environment variable to the JRE directory (e.g., `C:\Program Files\Android\Android Studio\jre\`).
2. Install [Node.js](https://nodejs.org/) version 20.19 or higher.
3. Install the latest version of [Android Studio](https://developer.android.com/studio).
4. Add `ANDROID_HOME` to your system environment variables.
5. Install Appium 3 globally:
   ```sh
   npm install -g appium@latest
   ```
6. Download [Appium Inspector](https://github.com/appium/appium-inspector/releases) (latest version compatible with Appium 3).
7. Install necessary Appium drivers:
   ```sh
   appium driver install uiautomator2
   appium driver install xcuitest
   ```
8. Enable virtualization in BIOS ([video tutorial](https://www.youtube.com/watch?v=UgDxU0jZAe4)).
9. Connect an Android device to your computer with USB debugging enabled.
10. Verify the device connection by running:
    ```sh
    adb devices
    ```
11. In the Android configuration file (`config/wdio.android.conf.js`), set the `platformVersion`, `deviceName`, and the path to the `.apk` file to match your connected Android device.
12. Start Appium:
    ```sh
    appium
    ```
13. Open Appium Inspector and connect it to your device to interact with your apps.

### Running iOS Tests

To run iOS tests with BrowserStack or locally, ensure the following setup:

1. Install Xcode (version 12 or higher) from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835).
2. Configure Xcode Command Line Tools by selecting **Xcode > Preferences > Locations** and ensuring the Command Line Tools dropdown is set to the Xcode version.
3. Install [CocoaPods](https://cocoapods.org/) (if not already installed) for dependency management:
   ```sh
   sudo gem install cocoapods
   ```
4. Set up Appium for iOS testing:
   ```sh
   npm install -g appium@latest
   appium driver install xcuitest
   ```
5. Connect an iOS device via USB and enable **Developer Mode** on the device (found in **Settings > Privacy & Security > Developer Mode** on iOS 16+).
6. In the iOS configuration file (`config/wdio.ios.conf.js`), specify `platformVersion`, `deviceName`, and the path to the `.ipa` file.
7. Start Appium server:
   ```sh
   appium
   ```
8. Use Appium Inspector to verify that the setup works and to locate UI elements on your iOS app.

### Running iOS Tests on BrowserStack

1. Ensure that the `.env` file contains `BROWSERSTACK_IOS_APP_ID` along with your BrowserStack credentials (`BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`).
2. Run iOS tests on BrowserStack with the following command:
   ```sh
   npm run test:ios:bs
   ```

### Linter

We use ESLint with the Prettier plugin to lint and auto-format TypeScript files. ESLint will auto-format code on every run.

### Test Structure

All test cases should be organized within the `test` folder. You can separate tests for different apps (e.g., `msb-app`) and define generic classes with getters and setters to reuse logic across classes.

This project follows the Page Object Pattern as outlined in the [WebdriverIO documentation](https://webdriver.io/docs/pageobjects.html). The main idea is to encapsulate page-specific logic into classes and utilize them in spec files to execute tests. For example, a `LoginPage` class defines elements as attributes, allowing for easy reuse throughout the code.

## Troubleshooting Flaky Tests

### Common Issues and Solutions

#### 1. **Tests fail intermittently (~50% of the time)**
This is usually caused by:
- **Hard-coded delays** (`browser.pause(5000)`) instead of smart waits
- **Network latency** between test runner and BrowserStack
- **Element loading timing** variations on mobile devices
- **Race conditions** in async operations

**Solutions implemented:**
- Replaced `browser.pause()` with `waitUntil()` conditions
- Added automatic retry mechanisms (tests retry 2 times on failure)
- Improved element wait strategies with timeout handling
- Added connection retry settings for BrowserStack

#### 2. **Element Not Found Errors**
**Symptoms:** `Element could not be located` or `NoSuchElementError`

**Solutions:**
- Verify element locators are correct for both Android and iOS
- Use Appium Inspector to confirm element selectors
- Check if app needs time to load after navigation
- Ensure elements are within viewport (scroll if needed)

**Debug commands:**
```bash
# Take screenshot to see current state
await browser.saveScreenshot('./debug_screenshot.png');

# Get page source to inspect DOM
const pageSource = await browser.getPageSource();
console.log(pageSource);
```

#### 3. **Timeout Errors**
**Symptoms:** `timeout` errors during element waits or clicks

**Current timeout settings:**
- Element wait timeout: 30 seconds
- Connection retry timeout: 5 minutes
- Test timeout: 5 minutes
- BrowserStack new command timeout: 5 minutes

**Troubleshooting:**
```bash
# Check BrowserStack session logs
# Go to BrowserStack dashboard and check the session details

# Increase timeout for specific problematic tests
await this.waitUntilElementDisplayed(element, 60000); // 60 seconds
```

#### 4. **BrowserStack Connection Issues**
**Symptoms:** Connection refused, session creation failed

**Solutions:**
- Check BrowserStack status page: https://status.browserstack.com/
- Verify credentials in `.env` file
- Ensure app is uploaded and accessible
- Check BrowserStack parallel session limits

**Debug steps:**
```bash
# Test BrowserStack connection
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  https://api.browserstack.com/app-automate/recent_apps

# Check uploaded apps
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  https://api.browserstack.com/app-automate/recent_apps
```

#### 5. **Local Appium Server Connection Issues**
**Symptoms:** Every second test run fails with connection errors, "ECONNREFUSED" or "session not created"

**Root Cause:** This is a common issue where the Appium server doesn't properly clean up sessions between test runs, leading to:
- Port conflicts from previous sessions
- Stale server processes
- Session state persistence
- Timeout during server restart

**Solutions implemented:**

1. **Enhanced Session Management:**
   - Added `--session-override` flag to allow session replacement
   - Implemented proper session cleanup hooks
   - Added connection health checks before test execution

2. **Improved Server Configuration:**
   ```javascript
   appium: {
     args: [
       "--allow-insecure",
       "--relaxed-security", 
       "--session-override", // Key fix for connection issues
       "--log-level", "error:info"
     ],
     timeout: 300000, // 5 minutes for server startup
     killTimeout: 30000, // 30 seconds for graceful shutdown
     forceKillTimeout: 10000 // 10 seconds before force kill
   }
   ```

3. **Connection Retry Settings:**
   - Increased connection retry count to 5
   - Extended connection timeout to 5 minutes
   - Added retry delays between attempts

4. **Manual Server Management:**
   Use the Appium Manager script for problematic connections:
   ```bash
   # Check server status
   npm run appium:status
   
   # Restart server with clean state
   npm run appium:restart
   
   # Run tests with connection health check
   npm run test:android:reliable
   npm run test:ios:reliable
   
   # Manual health check and recovery
   npm run appium:health
   ```

5. **Capability Improvements:**
   - Set `appium:noReset: false` to ensure clean app state
   - Added `appium:clearSystemFiles: true` for proper cleanup
   - Increased `newCommandTimeout` to 300 seconds
   - Added session timeout of 10 minutes

**Prevention Tips:**
- Always use `npm run test:android:reliable` instead of `npm run test:android` for important test runs
- If tests fail twice in a row, run `npm run appium:restart` before continuing
- Monitor Appium logs (`appium.log`) for connection warnings
- Keep only one Appium instance running at a time

#### 6. **App Crashes or Unexpected Behavior**
**Symptoms:** App closes unexpectedly, wrong screens appear

**Debugging:**
- Check device logs in BrowserStack dashboard
- Verify app permissions are granted
- Ensure app is compatible with selected device/OS version
- Check for memory issues on device

#### 7. **Slow Test Execution**
**Causes:**
- Network latency to BrowserStack
- Large app size
- Device performance
- Excessive waits/pauses

**Optimizations:**
- Use local Appium setup for development
- Optimize wait strategies
- Minimize unnecessary browser interactions
- Use parallel execution (when available)

### Enhanced Debugging Features

The framework now includes:

#### Automatic Screenshot on Failure
Screenshots are automatically captured when tests fail and attached to Allure reports.

#### Page Source Capture
HTML/XML source is saved on test failures for debugging element issues.

#### Retry Mechanisms
- **Test retries:** Each test retries twice on failure
- **Spec file retries:** Entire spec files retry twice if all tests fail
- **Element interaction retries:** Click actions retry up to 3 times

#### Enhanced Logging
All test actions are logged with:
- Timing information
- Element selectors used
- Success/failure status
- Error messages with context

### Manual Testing and Debug Mode

#### Using Appium Inspector
1. Start Appium server: `appium`
2. Open Appium Inspector
3. Configure connection:
   - Remote Path: `/wd/hub`
   - Desired Capabilities from config file
4. Start session to manually inspect elements

#### Debug Environment Variables
```bash
# Enable verbose logging
export DEBUG=*

# Skip chromedriver install if having network issues
export APPIUM_SKIP_CHROMEDRIVER_INSTALL=1

# Increase Appium timeouts
export APPIUM_COMMAND_TIMEOUT=300000
```

#### Manual Test Runs
```bash
# Run single test file
npx wdio run config/wdio.conf.android.bs.ts --spec test/specs/test.e2e.ts

# Run with increased verbosity
npx wdio run config/wdio.conf.android.bs.ts --logLevel debug

# Run locally (no BrowserStack)
npm run test:android
```

### Performance Monitoring

#### BrowserStack Insights
- Monitor test execution times in BrowserStack dashboard
- Check device performance metrics
- Review network request logs
- Analyze video recordings of test runs

#### Local Monitoring
```bash
# Monitor test execution time
time npm run test:android:bs

# Check memory usage during tests
top -p $(pgrep node)
```

### Best Practices for Reliable Tests

1. **Always use explicit waits** instead of `browser.pause()`
2. **Implement retry logic** for flaky operations
3. **Take screenshots** on failures for debugging
4. **Use stable locators** (IDs preferred over XPath)
5. **Test on multiple devices** and OS versions
6. **Monitor BrowserStack session logs** regularly
7. **Keep app size minimal** for faster uploads
8. **Use data-test-id attributes** in app for reliable element selection

### Emergency Debugging

If tests are completely failing:

1. **Check BrowserStack status**: https://status.browserstack.com/
2. **Verify app upload**:
   ```bash
   curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
     https://api.browserstack.com/app-automate/recent_apps
   ```
3. **Test with minimal spec**:
   ```javascript
   it('should load app', async () => {
     await browser.pause(5000);
     const pageSource = await browser.getPageSource();
     console.log('App loaded:', pageSource.length > 0);
   });
   ```
4. **Run locally** instead of BrowserStack:
   ```bash
   npm run test:android
   ```

### Support and Resources

- **WebdriverIO Documentation**: https://webdriver.io/
- **Appium Documentation**: https://appium.io/docs/
- **BrowserStack Documentation**: https://www.browserstack.com/docs/
- **GitHub Issues**: Report problems in this repository
- **BrowserStack Support**: Contact via dashboard if session issues persist
