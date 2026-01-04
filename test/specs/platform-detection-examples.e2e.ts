import { expect } from '@wdio/globals';
import PlatformDetection from '../utils/PlatformDetection';

/**
 * Example tests demonstrating Platform Detection functionality
 * These examples show how to handle platform-specific scenarios
 */

describe('Platform Detection Examples', () => {

  it('Example 1: Basic Platform Detection', async () => {
    // Check current platform
    const platform = PlatformDetection.getPlatform();
    console.log(`Running on: ${platform}`);
    
    expect(['android', 'ios']).toContain(platform);

    // Platform-specific checks
    if (PlatformDetection.isAndroid()) {
      console.log('✓ Android platform detected');
    } else if (PlatformDetection.isIOS()) {
      console.log('✓ iOS platform detected');
    }
  });

  it('Example 2: Get Detailed Platform Info', async () => {
    const info = await PlatformDetection.getPlatformInfo();
    
    console.log('Platform Information:');
    console.log(`- Platform: ${info.platform}`);
    console.log(`- Version: ${info.platformVersion}`);
    console.log(`- Device: ${info.deviceName}`);
    console.log(`- Context: ${info.context}`);
    console.log(`- Is Native: ${info.isNative}`);
    
    expect(info.platform).toBeTruthy();
    expect(info.deviceName).toBeTruthy();
  });

  it('Example 3: Platform-Specific Selectors', async () => {
    // Select appropriate selector for platform
    const loginButton = PlatformDetection.selectPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: '//XCUIElementTypeButton[@label="Login"]'
    });

    console.log(`Using selector: ${loginButton}`);
    
    // Use the selector (if element exists)
    // await $(loginButton).click();
  });

  it('Example 4: Build Platform-Specific XPath', async () => {
    // Build XPath automatically for current platform
    const xpath = PlatformDetection.buildPlatformXPath({
      text: 'Submit',
      className: 'Button'
    });

    console.log(`Generated XPath: ${xpath}`);
    
    // Complex XPath with multiple attributes
    const complexXPath = PlatformDetection.buildPlatformXPath({
      text: 'Login',
      contentDesc: 'login-button',
      className: 'Button'
    });

    console.log(`Complex XPath: ${complexXPath}`);
  });

  it('Example 5: Platform-Specific Configuration', async () => {
    // Get platform-specific timeout
    const timeout = PlatformDetection.getPlatformValue({
      android: 10000,
      ios: 15000,
      default: 12000
    });

    console.log(`Using timeout: ${timeout}ms for ${PlatformDetection.getPlatform()}`);
    expect(timeout).toBeGreaterThan(0);

    // Get platform-specific config object
    const config = PlatformDetection.getPlatformValue({
      android: {
        launchTimeout: 20000,
        retries: 3
      },
      ios: {
        launchTimeout: 30000,
        retries: 5
      }
    });

    console.log('Config:', config);
  });

  it('Example 6: Execute Platform-Specific Actions', async () => {
    // Run different code for each platform
    const result = await PlatformDetection.executePlatformSpecific(
      // Android action
      async () => {
        console.log('Executing Android-specific code');
        return 'Android Result';
      },
      // iOS action
      async () => {
        console.log('Executing iOS-specific code');
        return 'iOS Result';
      }
    );

    console.log(`Result: ${result}`);
    expect(result).toBeTruthy();
  });

  it('Example 7: Hide Keyboard', async () => {
    // Hide keyboard works on both platforms
    // await PlatformDetection.hideKeyboard();
    
    console.log(`Keyboard hide method for ${PlatformDetection.getPlatform()} available`);
  });

  it('Example 8: Platform-Specific Back Button', async () => {
    if (PlatformDetection.isAndroid()) {
      console.log('Android detected - back button available');
      // await PlatformDetection.pressBackButton();
    } else {
      console.log('iOS detected - back button not available (use nav bar)');
    }
  });

  it('Example 9: Alert Handling', async () => {
    // Check for alert
    const alertText = await PlatformDetection.getAlertText();
    
    if (alertText) {
      console.log(`Alert text: ${alertText}`);
      
      // Accept or dismiss based on your needs
      // Note: Android and iOS have reversed terminology
      // await PlatformDetection.acceptAlert();
    } else {
      console.log('No alert present');
    }
  });

  it('Example 10: App Management', async () => {
    // Get app identifier
    const appId = PlatformDetection.getAppIdentifier();
    console.log(`App Identifier: ${appId}`);
    
    // Terminate and activate app (if needed)
    // await PlatformDetection.terminateApp();
    // await browser.pause(2000);
    // await PlatformDetection.activateApp();
  });

  it('Example 11: Device Orientation', async () => {
    // Get current orientation
    const orientation = await PlatformDetection.getOrientation();
    console.log(`Current orientation: ${orientation}`);
    
    // Check orientation
    const isPortrait = await PlatformDetection.isPortrait();
    const isLandscape = await PlatformDetection.isLandscape();
    
    console.log(`Is Portrait: ${isPortrait}`);
    console.log(`Is Landscape: ${isLandscape}`);
    
    // Set orientation (if needed)
    // await PlatformDetection.setOrientation('LANDSCAPE');
    // await browser.pause(1000);
    // await PlatformDetection.setOrientation('PORTRAIT');
  });

  it('Example 12: Platform-Specific Scrolling', async () => {
    // Scroll down 50% of screen
    // await PlatformDetection.scrollDown();
    
    // Scroll down 70% of screen
    // await PlatformDetection.scrollDown(0.7);
    
    // Scroll up
    // await PlatformDetection.scrollUp();
    
    console.log('Scroll methods available for both platforms');
  });

  it('Example 13: Platform-Specific Attributes', async () => {
    // Get correct attribute name for platform
    const textAttr = PlatformDetection.getAttributeName('text');
    const enabledAttr = PlatformDetection.getAttributeName('enabled');
    const checkedAttr = PlatformDetection.getAttributeName('checked');
    
    console.log(`Text attribute: ${textAttr}`);
    console.log(`Enabled attribute: ${enabledAttr}`);
    console.log(`Checked attribute: ${checkedAttr}`);
    
    // Use with elements (if element exists)
    // const element = await $('~username');
    // const text = await element.getAttribute(textAttr);
  });

  it('Example 14: Gesture Durations', async () => {
    const tapDuration = PlatformDetection.getGestureDuration('tap');
    const swipeDuration = PlatformDetection.getGestureDuration('swipe');
    const longPressDuration = PlatformDetection.getGestureDuration('longPress');
    
    console.log(`Tap duration: ${tapDuration}ms`);
    console.log(`Swipe duration: ${swipeDuration}ms`);
    console.log(`Long press duration: ${longPressDuration}ms`);
    
    expect(tapDuration).toBeGreaterThan(0);
    expect(swipeDuration).toBeGreaterThan(0);
    expect(longPressDuration).toBeGreaterThan(0);
  });

  it('Example 15: System Bars Height', async () => {
    const bars = await PlatformDetection.getSystemBarsHeight();
    
    console.log(`Top bar (status bar): ${bars.top}px`);
    console.log(`Bottom bar (nav/home): ${bars.bottom}px`);
    
    // Calculate content area
    const windowSize = await browser.getWindowSize();
    const contentHeight = windowSize.height - bars.top - bars.bottom;
    
    console.log(`Content area height: ${contentHeight}px`);
  });

  it('Example 16: Locator Strategy', async () => {
    const strategy = PlatformDetection.getPlatformLocatorStrategy();
    
    console.log('Locator strategies:');
    console.log(`- Accessibility: ${strategy.accessibility}`);
    console.log(`- ID: ${strategy.id}`);
    console.log(`- XPath: ${strategy.xpath}`);
  });

  it('Example 17: Log Platform Info', async () => {
    // Log all platform information
    await PlatformDetection.logPlatformInfo();
  });

  it('Example 18: Combined with Conditionals', async () => {
    const platform = PlatformDetection.getPlatform();
    
    switch (platform) {
      case 'android':
        console.log('Running Android-specific test flow');
        // Android-specific test steps
        break;
        
      case 'ios':
        console.log('Running iOS-specific test flow');
        // iOS-specific test steps
        break;
        
      default:
        console.log('Unknown platform');
    }
  });

  it('Example 19: Dynamic Element Finding', async () => {
    // Helper function using platform detection
    async function findButton(text: string) {
      const xpath = PlatformDetection.buildPlatformXPath({
        text,
        className: 'Button'
      });
      
      console.log(`Looking for button with text "${text}" using: ${xpath}`);
      return xpath;
    }

    const loginXPath = await findButton('Login');
    const submitXPath = await findButton('Submit');
    
    expect(loginXPath).toBeTruthy();
    expect(submitXPath).toBeTruthy();
  });

  it('Example 20: Platform-Specific Test Data', async () => {
    // Use different test data for each platform
    const testUser = PlatformDetection.getPlatformValue({
      android: {
        username: 'android_user@test.com',
        password: 'AndroidPass123'
      },
      ios: {
        username: 'ios_user@test.com',
        password: 'iOSPass123'
      },
      default: {
        username: 'default@test.com',
        password: 'DefaultPass123'
      }
    });

    console.log('Test User:', testUser);
    expect(testUser).toHaveProperty('username');
    expect(testUser).toHaveProperty('password');
  });

  it('Example 21: Platform-Specific Timeouts', async () => {
    // Different wait times for different platforms
    const waitTime = PlatformDetection.getPlatformValue({
      android: 2000,  // Android is faster
      ios: 3000       // iOS needs more time
    });

    console.log(`Waiting ${waitTime}ms for ${PlatformDetection.getPlatform()}`);
    await browser.pause(waitTime);
  });

  it('Example 22: Cache Management', async () => {
    // Get platform info (cached)
    const info1 = await PlatformDetection.getPlatformInfo();
    console.log('First call - cached:', info1.platform);
    
    // Clear cache
    PlatformDetection.clearCache();
    console.log('Cache cleared');
    
    // Get fresh platform info
    const info2 = await PlatformDetection.getPlatformInfo();
    console.log('Second call - fresh:', info2.platform);
    
    expect(info1.platform).toBe(info2.platform);
  });

  it('Example 23: Complex Platform Detection in Page Object', async () => {
    // Example of how to use in page objects
    class ExamplePage {
      get loginButton() {
        return PlatformDetection.selectPlatformSelector({
          android: '~android-login',
          ios: '~ios-login'
        });
      }

      get usernameField() {
        return PlatformDetection.buildPlatformXPath({
          contentDesc: 'username-field',
          className: 'EditText'
        });
      }

      async login(username: string, password: string) {
        // Platform-specific login flow
        await PlatformDetection.executePlatformSpecific(
          async () => {
            console.log('Android login flow');
            // Android-specific steps
          },
          async () => {
            console.log('iOS login flow');
            // iOS-specific steps
          }
        );
      }
    }

    const page = new ExamplePage();
    console.log('Login button selector:', page.loginButton);
    console.log('Username field XPath:', page.usernameField);
  });

  it('Example 24: Wait for Platform Ready', async () => {
    // Wait for platform to be ready (useful in beforeAll/beforeEach)
    await PlatformDetection.waitForPlatformReady(1000);
    console.log('Platform is ready for testing');
  });
});
