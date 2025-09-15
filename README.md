
# e2e-tests: WebdriverIO v8, Appium v2, Hybrid App (Android & iOS), BrowserStack

Template for end-to-end testing with hybrid mobile applications.

## Setup

### Install Required Software and Project Checkout

1. Download and install [Node.js](https://nodejs.org/) (version 16.17 or higher).
2. Install TypeScript (version 5 or higher).
3. Install Visual Studio Code.
4. Clone the GitHub project repository.
5. Run `npm install` to install project dependencies.

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
2. Install [Node.js](https://nodejs.org/) version 16 or higher.
3. Install the latest version of [Android Studio](https://developer.android.com/studio).
4. Add `ANDROID_HOME` to your system environment variables.
5. Install Appium globally:
   ```sh
   npm install -g appium
   ```
6. Download [Appium Inspector](https://github.com/appium/appium-inspector/releases) (version 2 or higher).
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
   npm install -g appium
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
