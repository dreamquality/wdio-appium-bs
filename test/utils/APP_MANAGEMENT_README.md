# App Management Utility

Comprehensive app lifecycle management for mobile test automation with WebdriverIO and Appium.

## Features

### Installation Management
- Install apps from file paths
- Uninstall apps by bundle ID
- Check installation status
- Reinstall apps (uninstall + install)

### App State Control
- Launch and close apps
- Background and activate apps
- Terminate (force stop) apps
- Query app states
- Wait for specific app states

### Data Management
- Reset app (reinstall with clean state)
- Clear app data (Android)
- Get app strings (localization)

### Permissions (Android)
- Grant permissions
- Revoke permissions

### Activity Management (Android)
- Start specific activities
- Get current activity
- Get current package

## Installation

The utility is ready to use with your existing WebdriverIO + Appium setup. No additional dependencies required.

## Usage

### Import

```typescript
import AppManagement from '../utils/AppManagement';
```

### Install/Uninstall Apps

#### Install App

```typescript
// Basic installation
await AppManagement.installApp('/path/to/app.apk');

// With options
await AppManagement.installApp('/path/to/app.apk', {
  replace: true,              // Replace existing app
  allowTestPackages: true,    // Allow test packages
  grantPermissions: true,     // Grant all permissions
  timeout: 60000              // Install timeout
});
```

#### Uninstall App

```typescript
await AppManagement.uninstallApp('com.example.app');
```

#### Check if Installed

```typescript
const isInstalled = await AppManagement.isAppInstalled('com.example.app');
console.log(`App installed: ${isInstalled}`);
```

#### Reinstall App

```typescript
// Uninstall if exists, then install
await AppManagement.reinstallApp(
  'com.example.app',
  '/path/to/app.apk',
  { grantPermissions: true }
);
```

### App Lifecycle Control

#### Launch App

```typescript
// Launch main app (from capabilities)
await AppManagement.launchApp();

// Launch specific app
await AppManagement.launchApp('com.example.app');
```

#### Close App

```typescript
// Close main app
await AppManagement.closeApp();

// Close specific app
await AppManagement.closeApp('com.example.app');
```

#### Terminate App (Force Stop)

```typescript
const wasRunning = await AppManagement.terminateApp('com.example.app');
console.log(`App was running: ${wasRunning}`);
```

#### Background App

```typescript
// Background for 5 seconds
await AppManagement.backgroundApp(5);

// Background indefinitely
await AppManagement.backgroundApp(-1);

// Then bring back to foreground
await AppManagement.activateApp('com.example.app');
```

#### Restart App

```typescript
// Kill and relaunch app
await AppManagement.restartApp('com.example.app');
```

### App State Management

#### Get App State

```typescript
const state = await AppManagement.getAppState('com.example.app');

// States:
// 0 - Not installed
// 1 - Not running
// 2 - Running in background (suspended)
// 3 - Running in background
// 4 - Running in foreground
```

#### Check App State

```typescript
// Check if in foreground
const inForeground = await AppManagement.isAppInForeground('com.example.app');

// Check if running (foreground or background)
const isRunning = await AppManagement.isAppRunning('com.example.app');
```

#### Wait for App State

```typescript
// Wait for app to be in foreground (state 4)
const reached = await AppManagement.waitForAppState(
  'com.example.app',
  4,      // Target state
  10000   // Timeout in ms
);
```

#### Ensure App in Foreground

```typescript
// Launch if not running, activate if in background
await AppManagement.ensureAppInForeground('com.example.app');
```

#### Get App Info

```typescript
const info = await AppManagement.getAppInfo('com.example.app');
console.log(info);
// {
//   bundleId: 'com.example.app',
//   state: 'running_in_foreground'
// }
```

### Data Management

#### Reset App

```typescript
// Complete app reset (reinstall with clean state)
await AppManagement.resetApp();
```

#### Clear App Data (Android)

```typescript
// Clear app data without reinstalling
await AppManagement.clearAppData('com.example.app');
```

#### Get App Strings

```typescript
// Get localization strings
const strings = await AppManagement.getAppStrings();

// Get strings for specific language
const spanishStrings = await AppManagement.getAppStrings('es');
```

### Permissions Management (Android)

#### Grant Permissions

```typescript
await AppManagement.grantPermissions('com.example.app', [
  'android.permission.CAMERA',
  'android.permission.READ_CONTACTS',
  'android.permission.ACCESS_FINE_LOCATION'
]);
```

#### Revoke Permissions

```typescript
await AppManagement.revokePermissions('com.example.app', [
  'android.permission.CAMERA'
]);
```

### Activity Management (Android)

#### Start Activity

```typescript
await AppManagement.startActivity(
  'com.example.app',
  'com.example.app.MainActivity'
);
```

#### Get Current Activity

```typescript
const activity = await AppManagement.getCurrentActivity();
console.log(`Current activity: ${activity}`);
```

#### Get Current Package

```typescript
const packageName = await AppManagement.getCurrentPackage();
console.log(`Current package: ${packageName}`);
```

## Complete Examples

### Example 1: Clean Install and Setup

```typescript
import AppManagement from '../utils/AppManagement';

describe('App Installation', () => {
  it('should install app with clean state', async () => {
    const bundleId = 'com.example.app';
    const appPath = '/path/to/app.apk';
    
    // Reinstall app (clean state)
    await AppManagement.reinstallApp(bundleId, appPath, {
      grantPermissions: true
    });
    
    // Verify installation
    const installed = await AppManagement.isAppInstalled(bundleId);
    expect(installed).toBe(true);
    
    // Launch app
    await AppManagement.launchApp(bundleId);
    
    // Verify app is in foreground
    const inForeground = await AppManagement.isAppInForeground(bundleId);
    expect(inForeground).toBe(true);
  });
});
```

### Example 2: Test App Background/Foreground

```typescript
import AppManagement from '../utils/AppManagement';

describe('App State Management', () => {
  const bundleId = 'com.example.app';
  
  it('should handle background and foreground transitions', async () => {
    // Ensure app is in foreground
    await AppManagement.ensureAppInForeground(bundleId);
    
    // Verify foreground state
    let state = await AppManagement.getAppState(bundleId);
    expect(state).toBe(4); // Foreground
    
    // Send to background for 3 seconds
    await AppManagement.backgroundApp(3);
    
    // Check it's back in foreground after 3 seconds
    await AppManagement.waitForAppState(bundleId, 4, 5000);
    
    // Verify foreground state
    state = await AppManagement.getAppState(bundleId);
    expect(state).toBe(4);
  });
});
```

### Example 3: Test with Permissions

```typescript
import AppManagement from '../utils/AppManagement';

describe('App Permissions', () => {
  const bundleId = 'com.example.app';
  
  it('should grant and test camera permission', async () => {
    // Grant camera permission
    await AppManagement.grantPermissions(bundleId, [
      'android.permission.CAMERA'
    ]);
    
    // Launch app
    await AppManagement.launchApp(bundleId);
    
    // Test camera functionality
    // ... your test code ...
    
    // Revoke permission
    await AppManagement.revokePermissions(bundleId, [
      'android.permission.CAMERA'
    ]);
  });
});
```

### Example 4: Test Data Persistence

```typescript
import AppManagement from '../utils/AppManagement';

describe('Data Persistence', () => {
  const bundleId = 'com.example.app';
  
  it('should clear data and verify clean state', async () => {
    // Launch app and create some data
    await AppManagement.launchApp(bundleId);
    
    // ... create user data ...
    
    // Close app
    await AppManagement.closeApp(bundleId);
    
    // Clear app data
    await AppManagement.clearAppData(bundleId);
    
    // Relaunch app
    await AppManagement.launchApp(bundleId);
    
    // Verify clean state
    // ... verify data is cleared ...
  });
});
```

### Example 5: Multi-App Testing

```typescript
import AppManagement from '../utils/AppManagement';

describe('Multi-App Testing', () => {
  const app1 = 'com.example.app1';
  const app2 = 'com.example.app2';
  
  it('should switch between apps', async () => {
    // Ensure app1 is in foreground
    await AppManagement.ensureAppInForeground(app1);
    
    // Perform actions in app1
    // ...
    
    // Switch to app2
    await AppManagement.activateApp(app2);
    await AppManagement.waitForAppState(app2, 4, 5000);
    
    // Perform actions in app2
    // ...
    
    // Switch back to app1
    await AppManagement.activateApp(app1);
    await AppManagement.waitForAppState(app1, 4, 5000);
  });
});
```

### Example 6: Test App Restart

```typescript
import AppManagement from '../utils/AppManagement';

describe('App Restart', () => {
  const bundleId = 'com.example.app';
  
  it('should restart app and maintain session', async () => {
    // Launch app
    await AppManagement.launchApp(bundleId);
    
    // Login and create session
    // ...
    
    // Restart app (kill and relaunch)
    await AppManagement.restartApp(bundleId);
    
    // Verify session is maintained
    // ...
  });
});
```

### Example 7: Activity Navigation (Android)

```typescript
import AppManagement from '../utils/AppManagement';

describe('Activity Navigation', () => {
  const bundleId = 'com.example.app';
  
  it('should navigate to specific activity', async () => {
    // Launch main activity
    await AppManagement.launchApp(bundleId);
    
    // Get current activity
    let activity = await AppManagement.getCurrentActivity();
    console.log(`Current: ${activity}`);
    
    // Start settings activity
    await AppManagement.startActivity(
      bundleId,
      'com.example.app.SettingsActivity'
    );
    
    // Verify activity changed
    activity = await AppManagement.getCurrentActivity();
    expect(activity).toContain('SettingsActivity');
  });
});
```

### Example 8: Test Suite Setup/Teardown

```typescript
import AppManagement from '../utils/AppManagement';

describe('Test Suite with App Management', () => {
  const bundleId = 'com.example.app';
  const appPath = '/path/to/app.apk';
  
  before(async () => {
    // Setup: Install app with clean state
    await AppManagement.reinstallApp(bundleId, appPath, {
      grantPermissions: true
    });
    
    // Grant required permissions
    await AppManagement.grantPermissions(bundleId, [
      'android.permission.CAMERA',
      'android.permission.READ_CONTACTS'
    ]);
  });
  
  beforeEach(async () => {
    // Ensure app is in foreground before each test
    await AppManagement.ensureAppInForeground(bundleId);
  });
  
  afterEach(async () => {
    // Clear app data after each test for clean state
    await AppManagement.closeApp(bundleId);
    await AppManagement.clearAppData(bundleId);
  });
  
  after(async () => {
    // Cleanup: Uninstall app
    await AppManagement.uninstallApp(bundleId);
  });
  
  it('test case 1', async () => {
    // Test code
  });
  
  it('test case 2', async () => {
    // Test code
  });
});
```

## Platform Support

| Feature | Android | iOS |
|---------|---------|-----|
| Install App | ✅ | ✅ |
| Uninstall App | ✅ | ✅ |
| Is App Installed | ✅ | ✅ |
| Launch App | ✅ | ✅ |
| Close App | ✅ | ✅ |
| Terminate App | ✅ | ✅ |
| Reset App | ✅ | ✅ |
| Background App | ✅ | ✅ |
| Activate App | ✅ | ✅ |
| Get App State | ✅ | ✅ |
| Clear App Data | ✅ | ❌ |
| Grant Permissions | ✅ | ❌ |
| Revoke Permissions | ✅ | ❌ |
| Start Activity | ✅ | ❌ |
| Get Current Activity | ✅ | ❌ |
| Get Current Package | ✅ | ❌ |
| Get App Strings | ✅ | ✅ |

## Best Practices

### 1. Always Check Installation Status

```typescript
const installed = await AppManagement.isAppInstalled(bundleId);
if (!installed) {
  await AppManagement.installApp(appPath);
}
```

### 2. Wait for State Changes

```typescript
// Don't assume immediate state change
await AppManagement.terminateApp(bundleId);
await AppManagement.waitForAppState(bundleId, 1, 5000); // Wait for "not running"
```

### 3. Use Ensure Methods for Reliability

```typescript
// Better than just calling launchApp
await AppManagement.ensureAppInForeground(bundleId);
```

### 4. Handle Platform Differences

```typescript
const platform = (await driver.capabilities).platformName?.toLowerCase();

if (platform === 'android') {
  await AppManagement.clearAppData(bundleId);
} else {
  // iOS alternative
  await AppManagement.resetApp();
}
```

### 5. Clean State Between Tests

```typescript
afterEach(async () => {
  await AppManagement.closeApp(bundleId);
  await AppManagement.clearAppData(bundleId); // Android
  // or
  await AppManagement.resetApp(); // iOS
});
```

## Error Handling

All methods include error handling and logging:

```typescript
try {
  await AppManagement.installApp('/path/to/app.apk');
} catch (error) {
  console.error('Installation failed:', error);
  // Handle error
}
```

Methods return boolean for success/failure where appropriate:

```typescript
const success = await AppManagement.installApp('/path/to/app.apk');
if (!success) {
  // Handle installation failure
}
```

## Tips and Tricks

### Tip 1: Fresh Install for Each Test

```typescript
beforeEach(async () => {
  await AppManagement.reinstallApp(bundleId, appPath);
});
```

### Tip 2: Test App Recovery

```typescript
// Test app behavior after unexpected termination
await AppManagement.terminateApp(bundleId);
await AppManagement.launchApp(bundleId);
// Verify app recovered correctly
```

### Tip 3: Test Permission Flows

```typescript
// Test app behavior without permissions
await AppManagement.revokePermissions(bundleId, ['android.permission.CAMERA']);
// ... test ...

// Then grant and test again
await AppManagement.grantPermissions(bundleId, ['android.permission.CAMERA']);
// ... test ...
```

### Tip 4: Deep Link Testing

```typescript
// Start specific activity for deep link testing
await AppManagement.startActivity(
  'com.example.app',
  'com.example.app.DeepLinkActivity'
);
```

## Troubleshooting

### App Not Installing
- Check app path is correct
- Verify device has enough storage
- Ensure app signature is valid
- Try with `replace: true` option

### Permission Grant Fails
- Verify permission name is correct
- Check Android API level supports runtime permissions
- Ensure app declares permission in manifest

### App State Check Returns 0
- App might not be installed
- Bundle ID might be incorrect
- Check device connection

### Clear Data Not Working
- Feature is Android-only
- Verify bundle ID is correct
- Check device has ADB access

## Related Utilities

- **Smart Waits**: Use with `waitForElementClickable` after app launch
- **Platform Detection**: Check platform before using platform-specific features
- **Element Interaction**: Use after ensuring app is in foreground

## License

Part of the wdio-appium-bs test automation framework.
