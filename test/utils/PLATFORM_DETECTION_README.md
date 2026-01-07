# Platform Detection

Automatic Android/iOS detection with platform-specific handling for robust cross-platform mobile automation.

## Features

### Platform Detection
- **getPlatform()**: Get current platform (android/ios/unknown)
- **isAndroid()**: Check if running on Android
- **isIOS()**: Check if running on iOS
- **getPlatformInfo()**: Get detailed platform information

### Platform-Specific Selectors
- **selectPlatformSelector()**: Choose Android or iOS selector
- **buildPlatformXPath()**: Build platform-specific XPath
- **getPlatformLocatorStrategy()**: Get locator strategy for platform

### Platform-Specific Actions
- **hideKeyboard()**: Hide keyboard with platform-specific method
- **pressBackButton()**: Press Android back button
- **acceptAlert() / dismissAlert()**: Handle alerts with correct platform behavior

### App Management
- **getAppIdentifier()**: Get package/bundle ID
- **terminateApp()**: Terminate app
- **activateApp()**: Activate app

### Device Control
- **setOrientation()**: Set device orientation
- **getOrientation()**: Get current orientation
- **isPortrait() / isLandscape()**: Check orientation
- **scrollUp() / scrollDown()**: Platform-specific scrolling

### Configuration
- **getPlatformValue()**: Get platform-specific config value
- **executePlatformSpecific()**: Execute platform-specific action

## Usage Examples

### Basic Platform Detection

```typescript
import PlatformDetection from '../utils/PlatformDetection';

// Check current platform
if (PlatformDetection.isAndroid()) {
  console.log('Running on Android');
} else if (PlatformDetection.isIOS()) {
  console.log('Running on iOS');
}

// Get platform name
const platform = PlatformDetection.getPlatform(); // 'android' or 'ios'
```

### Detailed Platform Information

```typescript
// Get comprehensive platform info
const info = await PlatformDetection.getPlatformInfo();

console.log(info.platform);        // 'android' or 'ios'
console.log(info.platformVersion); // '14.0'
console.log(info.deviceName);      // 'Pixel 7'
console.log(info.context);         // 'native', 'web', or 'hybrid'
console.log(info.isNative);        // true/false
console.log(info.isWeb);           // true/false
console.log(info.isHybrid);        // true/false

// Log all platform info
await PlatformDetection.logPlatformInfo();
```

### Platform-Specific Selectors

```typescript
// Select appropriate selector for platform
const selector = PlatformDetection.selectPlatformSelector({
  android: '//android.widget.Button[@text="Login"]',
  ios: '//XCUIElementTypeButton[@label="Login"]'
});

await $(selector).click();
```

### Build Platform-Specific XPath

```typescript
// Build XPath based on platform
const xpath = PlatformDetection.buildPlatformXPath({
  text: 'Login',
  className: 'Button'
});

// Android: //android.widget.Button[@text='Login']
// iOS: //XCUIElementTypeButton[@label='Login']

await $(xpath).click();

// With multiple attributes
const complexXPath = PlatformDetection.buildPlatformXPath({
  text: 'Submit',
  contentDesc: 'submit-button',
  className: 'Button'
});

await $(complexXPath).click();
```

### Platform-Specific Configuration

```typescript
// Get platform-specific timeout
const timeout = PlatformDetection.getPlatformValue({
  android: 10000,
  ios: 15000,
  default: 12000
});

// Get platform-specific app settings
const config = PlatformDetection.getPlatformValue({
  android: {
    launchTimeout: 20000,
    waitForIdleTimeout: 5000
  },
  ios: {
    launchTimeout: 30000,
    wdaLaunchTimeout: 60000
  }
});
```

### Execute Platform-Specific Actions

```typescript
// Run different code for each platform
await PlatformDetection.executePlatformSpecific(
  // Android action
  async () => {
    await $('android=new UiSelector().resourceId("submit")').click();
  },
  // iOS action
  async () => {
    await $('ios=.name == "submit"').click();
  }
);

// Another example
const text = await PlatformDetection.executePlatformSpecific(
  async () => await $('~username').getAttribute('text'),    // Android
  async () => await $('~username').getAttribute('label')   // iOS
);
```

### Keyboard Management

```typescript
// Hide keyboard with platform-specific method
await PlatformDetection.hideKeyboard();

// Works on both platforms with proper fallbacks:
// - Android: browser.hideKeyboard()
// - iOS: mobile: hideKeyboard or tap outside
```

### Back Button (Android)

```typescript
// Press Android back button (no-op on iOS)
await PlatformDetection.pressBackButton();

// Check platform first if needed
if (PlatformDetection.isAndroid()) {
  await PlatformDetection.pressBackButton();
}
```

### Alert Handling

```typescript
// Get alert text
const alertText = await PlatformDetection.getAlertText();

// Accept alert (platform-specific behavior)
await PlatformDetection.acceptAlert();
// Android: acceptAlert
// iOS: dismissAlert (iOS terminology is reversed)

// Dismiss alert
await PlatformDetection.dismissAlert();
// Android: dismissAlert
// iOS: acceptAlert
```

### App Management

```typescript
// Get app identifier
const appId = PlatformDetection.getAppIdentifier();
// Android: returns appPackage (e.g., 'com.example.app')
// iOS: returns bundleId (e.g., 'com.example.app')

// Terminate app
await PlatformDetection.terminateApp();

// Activate app
await PlatformDetection.activateApp();
```

### Device Orientation

```typescript
// Set orientation
await PlatformDetection.setOrientation('LANDSCAPE');
await PlatformDetection.setOrientation('PORTRAIT');

// Get current orientation
const orientation = await PlatformDetection.getOrientation();

// Check orientation
if (await PlatformDetection.isPortrait()) {
  console.log('Device is in portrait mode');
}

if (await PlatformDetection.isLandscape()) {
  console.log('Device is in landscape mode');
}
```

### Platform-Specific Scrolling

```typescript
// Scroll down (default 50% of screen)
await PlatformDetection.scrollDown();

// Scroll down with custom distance
await PlatformDetection.scrollDown(0.7); // 70% of screen

// Scroll up
await PlatformDetection.scrollUp();

// Scroll up with custom distance
await PlatformDetection.scrollUp(0.6);
```

### Attribute Names

```typescript
// Get platform-specific attribute name
const textAttr = PlatformDetection.getAttributeName('text');
// Android: 'text'
// iOS: 'label'

const element = await $('~username');
const text = await element.getAttribute(textAttr);

// Other attributes
const enabledAttr = PlatformDetection.getAttributeName('enabled');
const checkedAttr = PlatformDetection.getAttributeName('checked');
```

### Gesture Durations

```typescript
// Get platform-specific gesture duration
const tapDuration = PlatformDetection.getGestureDuration('tap');
const swipeDuration = PlatformDetection.getGestureDuration('swipe');
const longPressDuration = PlatformDetection.getGestureDuration('longPress');

// Use in touch actions
await browser.touchAction([
  { action: 'press', x: 100, y: 100 },
  { action: 'wait', ms: longPressDuration },
  'release'
]);
```

### System Bars Height

```typescript
// Get approximate system bars height
const bars = await PlatformDetection.getSystemBarsHeight();

console.log(`Top bar: ${bars.top}px`);    // Status bar
console.log(`Bottom bar: ${bars.bottom}px`); // Nav bar / home indicator

// Useful for calculating touch coordinates
const windowSize = await browser.getWindowSize();
const contentHeight = windowSize.height - bars.top - bars.bottom;
```

## Integration with Page Objects

```typescript
import Page from './page';
import PlatformDetection from '../utils/PlatformDetection';

class LoginPage extends Page {
  // Platform-specific selectors
  private get usernameField() {
    return PlatformDetection.selectPlatformSelector({
      android: '//android.widget.EditText[@resource-id="username"]',
      ios: '//XCUIElementTypeTextField[@name="username"]'
    });
  }

  private get loginButton() {
    return PlatformDetection.buildPlatformXPath({
      text: 'Login',
      className: 'Button'
    });
  }

  async login(username: string, password: string) {
    // Enter username
    await $(this.usernameField).setValue(username);

    // Platform-specific password field
    await PlatformDetection.executePlatformSpecific(
      async () => {
        // Android
        await $('android=new UiSelector().resourceId("password")').setValue(password);
      },
      async () => {
        // iOS
        await $('ios=.name == "password"').setValue(password);
      }
    );

    // Hide keyboard
    await PlatformDetection.hideKeyboard();

    // Click login
    await $(this.loginButton).click();
  }

  async waitForLoginScreen() {
    // Platform-specific timeout
    const timeout = PlatformDetection.getPlatformValue({
      android: 10000,
      ios: 15000
    });

    await $(this.usernameField).waitForDisplayed({ timeout });
  }
}

export default new LoginPage();
```

## Integration with Smart Waits

```typescript
import SmartWaits from '../utils/SmartWaits';
import PlatformDetection from '../utils/PlatformDetection';

// Combine platform detection with smart waits
const selector = PlatformDetection.buildPlatformXPath({
  text: 'Submit',
  className: 'Button'
});

await SmartWaits.waitForElementClickable(selector, { 
  timeout: PlatformDetection.getPlatformValue({
    android: 10000,
    ios: 15000
  })
});
```

## Integration with Element Interaction Helpers

```typescript
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';
import PlatformDetection from '../utils/PlatformDetection';

// Use platform-specific selector with smart interactions
const buttonSelector = PlatformDetection.selectPlatformSelector({
  android: '~android-button',
  ios: '~ios-button'
});

await ElementInteractionHelpers.smartClick(buttonSelector, {
  scrollIntoView: true
});

// Platform-specific input handling
const inputSelector = PlatformDetection.buildPlatformXPath({
  contentDesc: 'email-input',
  className: 'EditText'
});

await ElementInteractionHelpers.smartInput(inputSelector, 'test@example.com', {
  validateInput: true
});

// Hide keyboard after input
await PlatformDetection.hideKeyboard();
```

## Best Practices

### 1. Cache Platform Info
```typescript
// Platform info is cached automatically
const info = await PlatformDetection.getPlatformInfo(); // Cached

// Clear cache if context changes
PlatformDetection.clearCache();
const newInfo = await PlatformDetection.getPlatformInfo(); // Fresh
```

### 2. Use Platform-Specific Selectors
```typescript
// ✅ Good - Platform-specific
const selector = PlatformDetection.selectPlatformSelector({
  android: 'android.widget.Button',
  ios: 'XCUIElementTypeButton'
});

// ❌ Avoid - Hardcoded for one platform
const selector = 'android.widget.Button';
```

### 3. Handle Platform Differences in Tests
```typescript
// ✅ Good - Explicit platform handling
if (PlatformDetection.isAndroid()) {
  await PlatformDetection.pressBackButton();
} else {
  // iOS alternative
  await $('~back-button').click();
}
```

### 4. Use Build Functions for Complex XPath
```typescript
// ✅ Good - Automatic platform adaptation
const xpath = PlatformDetection.buildPlatformXPath({
  text: 'Submit',
  contentDesc: 'submit-btn',
  className: 'Button'
});

// ❌ Avoid - Manual XPath construction
const xpath = '//android.widget.Button[@text="Submit"]'; // Android only
```

### 5. Leverage Platform-Specific Config
```typescript
// ✅ Good - Different timeouts per platform
const timeout = PlatformDetection.getPlatformValue({
  android: 10000,
  ios: 15000,
  default: 12000
});
```

## Common Patterns

### Pattern 1: Platform-Specific Test Setup
```typescript
describe('Login Tests', () => {
  before(async () => {
    await PlatformDetection.logPlatformInfo();
    
    if (PlatformDetection.isAndroid()) {
      // Android-specific setup
      await PlatformDetection.setOrientation('PORTRAIT');
    } else {
      // iOS-specific setup
      await PlatformDetection.waitForPlatformReady(3000);
    }
  });
});
```

### Pattern 2: Dynamic Element Location
```typescript
async function findElement(text: string, className: string) {
  const xpath = PlatformDetection.buildPlatformXPath({
    text,
    className
  });
  
  return await $(xpath);
}

const submitBtn = await findElement('Submit', 'Button');
await submitBtn.click();
```

### Pattern 3: Platform-Aware Assertions
```typescript
const textAttr = PlatformDetection.getAttributeName('text');
const element = await $('~username');
const text = await element.getAttribute(textAttr);

expect(text).toBe('Expected Value');
```

## Troubleshooting

### Platform Not Detected
```typescript
// Log platform info for debugging
await PlatformDetection.logPlatformInfo();

// Check capabilities
const info = await PlatformDetection.getPlatformInfo();
console.log(info.capabilities);
```

### Keyboard Not Hiding
```typescript
// The method has built-in fallbacks
await PlatformDetection.hideKeyboard();

// Manual fallback if needed
if (PlatformDetection.isIOS()) {
  const size = await browser.getWindowSize();
  await browser.touchAction({
    action: 'tap',
    x: size.width / 2,
    y: 10 // Tap status bar
  });
}
```

### Alert Handling Issues
```typescript
// Check if alert is present first
const alertText = await PlatformDetection.getAlertText();

if (alertText) {
  await PlatformDetection.acceptAlert();
}
```

## Additional Resources

- [Appium Platform Support](https://appium.io/docs/en/about-appium/platform-support/)
- [WebdriverIO Capabilities](https://webdriver.io/docs/capabilities/)
- [Android UiSelector](https://developer.android.com/reference/androidx/test/uiautomator/UiSelector)
- [iOS XCUITest](https://developer.apple.com/documentation/xctest/user_interface_tests)
