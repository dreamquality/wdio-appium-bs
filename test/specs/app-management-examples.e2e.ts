/**
 * App Management Examples
 * 
 * Demonstrates various app lifecycle management scenarios
 */

import AppManagement from '../utils/AppManagement';

describe('App Management Examples', () => {
  // Note: Update these values for your actual app
  const bundleId = 'com.example.app';
  const appPath = '/path/to/app.apk'; // or .app/.ipa for iOS

  describe('Installation Management', () => {
    it('Example 1: Install app', async () => {
      const success = await AppManagement.installApp(appPath, {
        replace: true,
        grantPermissions: true
      });
      
      console.log(`Installation successful: ${success}`);
    });

    it('Example 2: Check if app is installed', async () => {
      const isInstalled = await AppManagement.isAppInstalled(bundleId);
      console.log(`App installed: ${isInstalled}`);
    });

    it('Example 3: Uninstall app', async () => {
      const success = await AppManagement.uninstallApp(bundleId);
      console.log(`Uninstallation successful: ${success}`);
    });

    it('Example 4: Reinstall app (clean install)', async () => {
      const success = await AppManagement.reinstallApp(bundleId, appPath, {
        grantPermissions: true
      });
      
      console.log(`Reinstallation successful: ${success}`);
    });
  });

  describe('App Lifecycle Control', () => {
    it('Example 5: Launch app', async () => {
      await AppManagement.launchApp(bundleId);
      console.log('App launched');
      
      // Verify app is in foreground
      const inForeground = await AppManagement.isAppInForeground(bundleId);
      console.log(`App in foreground: ${inForeground}`);
    });

    it('Example 6: Close app', async () => {
      await AppManagement.closeApp(bundleId);
      console.log('App closed');
      
      // Verify app state
      const state = await AppManagement.getAppState(bundleId);
      console.log(`App state after close: ${state}`);
    });

    it('Example 7: Terminate app (force stop)', async () => {
      const wasRunning = await AppManagement.terminateApp(bundleId);
      console.log(`App was running: ${wasRunning}`);
    });

    it('Example 8: Background app for duration', async () => {
      // Ensure app is running
      await AppManagement.ensureAppInForeground(bundleId);
      
      // Background for 3 seconds
      await AppManagement.backgroundApp(3);
      console.log('App backgrounded for 3 seconds');
      
      // App should be back in foreground automatically after 3 seconds
      // Wait for foreground state
      const inForeground = await AppManagement.waitForAppState(bundleId, 4, 5000);
      console.log(`App back in foreground: ${inForeground}`);
    });

    it('Example 9: Background indefinitely and activate', async () => {
      // Background indefinitely
      await AppManagement.backgroundApp(-1);
      console.log('App backgrounded indefinitely');
      
      // Wait for background state
      await AppManagement.waitForAppState(bundleId, 3, 5000);
      
      // Activate app
      await AppManagement.activateApp(bundleId);
      console.log('App activated');
      
      // Verify foreground
      const inForeground = await AppManagement.isAppInForeground(bundleId);
      console.log(`App in foreground: ${inForeground}`);
    });

    it('Example 10: Restart app (kill and relaunch)', async () => {
      const success = await AppManagement.restartApp(bundleId);
      console.log(`App restarted successfully: ${success}`);
    });
  });

  describe('App State Management', () => {
    it('Example 11: Get app state', async () => {
      const state = await AppManagement.getAppState(bundleId);
      
      const stateNames = [
        'Not installed',
        'Not running',
        'Background suspended',
        'Background running',
        'Foreground'
      ];
      
      console.log(`App state: ${state} (${stateNames[state]})`);
    });

    it('Example 12: Check if app is running', async () => {
      const isRunning = await AppManagement.isAppRunning(bundleId);
      console.log(`App is running: ${isRunning}`);
    });

    it('Example 13: Check if app is in foreground', async () => {
      const inForeground = await AppManagement.isAppInForeground(bundleId);
      console.log(`App in foreground: ${inForeground}`);
    });

    it('Example 14: Wait for specific app state', async () => {
      // Launch app
      await AppManagement.launchApp(bundleId);
      
      // Wait for app to be in foreground (state 4)
      const reached = await AppManagement.waitForAppState(bundleId, 4, 10000);
      console.log(`App reached foreground state: ${reached}`);
    });

    it('Example 15: Ensure app is in foreground', async () => {
      // This will launch if not running, or activate if backgrounded
      const inForeground = await AppManagement.ensureAppInForeground(bundleId);
      console.log(`App ensured in foreground: ${inForeground}`);
    });

    it('Example 16: Get app info', async () => {
      const info = await AppManagement.getAppInfo(bundleId);
      console.log('App info:', info);
      
      if (info) {
        console.log(`Bundle ID: ${info.bundleId}`);
        console.log(`State: ${info.state}`);
      }
    });
  });

  describe('Data Management', () => {
    it('Example 17: Reset app', async () => {
      // Complete app reset (reinstall with clean state)
      await AppManagement.resetApp();
      console.log('App reset complete');
    });

    it('Example 18: Clear app data (Android)', async () => {
      const success = await AppManagement.clearAppData(bundleId);
      console.log(`App data cleared: ${success}`);
    });

    it('Example 19: Get app strings', async () => {
      const strings = await AppManagement.getAppStrings();
      console.log('App strings count:', Object.keys(strings).length);
      console.log('Sample strings:', Object.keys(strings).slice(0, 5));
    });

    it('Example 20: Get app strings for language', async () => {
      const spanishStrings = await AppManagement.getAppStrings('es');
      console.log('Spanish strings count:', Object.keys(spanishStrings).length);
    });
  });

  describe('Permissions Management (Android)', () => {
    it('Example 21: Grant permissions', async () => {
      const permissions = [
        'android.permission.CAMERA',
        'android.permission.READ_CONTACTS',
        'android.permission.ACCESS_FINE_LOCATION'
      ];
      
      const success = await AppManagement.grantPermissions(bundleId, permissions);
      console.log(`Permissions granted: ${success}`);
    });

    it('Example 22: Revoke permissions', async () => {
      const permissions = [
        'android.permission.CAMERA'
      ];
      
      const success = await AppManagement.revokePermissions(bundleId, permissions);
      console.log(`Permissions revoked: ${success}`);
    });

    it('Example 23: Test with and without permission', async () => {
      // Test without camera permission
      await AppManagement.revokePermissions(bundleId, ['android.permission.CAMERA']);
      await AppManagement.restartApp(bundleId);
      console.log('Testing without camera permission');
      // ... test camera permission denied flow ...
      
      // Grant permission and test again
      await AppManagement.grantPermissions(bundleId, ['android.permission.CAMERA']);
      await AppManagement.restartApp(bundleId);
      console.log('Testing with camera permission');
      // ... test camera functionality ...
    });
  });

  describe('Activity Management (Android)', () => {
    it('Example 24: Start specific activity', async () => {
      await AppManagement.startActivity(
        bundleId,
        `${bundleId}.MainActivity`
      );
      console.log('Activity started');
    });

    it('Example 25: Get current activity', async () => {
      const activity = await AppManagement.getCurrentActivity();
      console.log(`Current activity: ${activity}`);
    });

    it('Example 26: Get current package', async () => {
      const packageName = await AppManagement.getCurrentPackage();
      console.log(`Current package: ${packageName}`);
    });
  });

  describe('Complete Test Scenarios', () => {
    it('Example 27: Clean install and setup', async () => {
      console.log('Starting clean install...');
      
      // Reinstall app
      await AppManagement.reinstallApp(bundleId, appPath, {
        grantPermissions: true
      });
      
      // Verify installation
      const installed = await AppManagement.isAppInstalled(bundleId);
      console.log(`Installation verified: ${installed}`);
      
      // Launch app
      await AppManagement.launchApp(bundleId);
      
      // Verify foreground
      const inForeground = await AppManagement.isAppInForeground(bundleId);
      console.log(`App in foreground: ${inForeground}`);
      
      console.log('Clean install complete');
    });

    it('Example 28: Test app state transitions', async () => {
      console.log('Testing app state transitions...');
      
      // Start in foreground
      await AppManagement.ensureAppInForeground(bundleId);
      let state = await AppManagement.getAppState(bundleId);
      console.log(`Initial state: ${state} (foreground)`);
      
      // Background
      await AppManagement.backgroundApp(-1);
      // Wait for background state
      await AppManagement.waitForAppState(bundleId, 3, 5000);
      state = await AppManagement.getAppState(bundleId);
      console.log(`After background: ${state}`);
      
      // Activate
      await AppManagement.activateApp(bundleId);
      await AppManagement.waitForAppState(bundleId, 4, 5000);
      state = await AppManagement.getAppState(bundleId);
      console.log(`After activate: ${state} (foreground)`);
      
      // Terminate
      await AppManagement.terminateApp(bundleId);
      // Wait for not running state
      await AppManagement.waitForAppState(bundleId, 1, 5000);
      state = await AppManagement.getAppState(bundleId);
      console.log(`After terminate: ${state} (not running)`);
      
      console.log('State transitions complete');
    });

    it('Example 29: Test data persistence', async () => {
      console.log('Testing data persistence...');
      
      // Launch and create data
      await AppManagement.ensureAppInForeground(bundleId);
      console.log('App launched, creating data...');
      // ... create user data in app ...
      
      // Close app
      await AppManagement.closeApp(bundleId);
      console.log('App closed');
      
      // Relaunch and verify data persists
      await AppManagement.launchApp(bundleId);
      console.log('App relaunched, checking data...');
      // ... verify data exists ...
      
      // Clear data
      await AppManagement.clearAppData(bundleId);
      console.log('App data cleared');
      
      // Relaunch and verify clean state
      await AppManagement.launchApp(bundleId);
      console.log('App relaunched, verifying clean state...');
      // ... verify data is gone ...
      
      console.log('Data persistence test complete');
    });

    it('Example 30: Multi-app switching', async () => {
      const app1 = bundleId;
      const app2 = 'com.another.app'; // TODO: Update with actual second app bundle ID
      
      console.log('Testing multi-app switching...');
      console.log('NOTE: Update app2 variable with actual second app bundle ID');
      
      // App 1 foreground
      await AppManagement.ensureAppInForeground(app1);
      console.log('App 1 in foreground');
      // ... perform actions in app 1 ...
      
      // Switch to app 2
      await AppManagement.activateApp(app2);
      await AppManagement.waitForAppState(app2, 4, 5000);
      console.log('App 2 in foreground');
      // ... perform actions in app 2 ...
      
      // Switch back to app 1
      await AppManagement.activateApp(app1);
      await AppManagement.waitForAppState(app1, 4, 5000);
      console.log('App 1 back in foreground');
      // ... continue actions in app 1 ...
      
      console.log('Multi-app switching complete');
    });
  });

  describe('Test Suite Setup/Teardown Patterns', () => {
    describe('Pattern 1: Fresh install per test', () => {
      beforeEach(async () => {
        // Fresh install before each test
        await AppManagement.reinstallApp(bundleId, appPath);
      });

      it('Example 31: Test with fresh install', async () => {
        // Each test starts with clean app install
        console.log('Running test with fresh install');
      });
    });

    describe('Pattern 2: Clear data per test', () => {
      before(async () => {
        // Install once before all tests
        await AppManagement.installApp(appPath);
      });

      beforeEach(async () => {
        // Clear data before each test
        await AppManagement.clearAppData(bundleId);
        await AppManagement.launchApp(bundleId);
      });

      afterEach(async () => {
        // Close app after each test
        await AppManagement.closeApp(bundleId);
      });

      it('Example 32: Test with data clearing', async () => {
        console.log('Running test with cleared data');
      });
    });

    describe('Pattern 3: Ensure foreground per test', () => {
      beforeEach(async () => {
        // Ensure app is in foreground before each test
        await AppManagement.ensureAppInForeground(bundleId);
      });

      it('Example 33: Test with guaranteed foreground', async () => {
        console.log('Running test with app in foreground');
      });
    });

    describe('Pattern 4: Permission setup', () => {
      before(async () => {
        // Setup: Install and grant permissions
        await AppManagement.reinstallApp(bundleId, appPath);
        await AppManagement.grantPermissions(bundleId, [
          'android.permission.CAMERA',
          'android.permission.READ_CONTACTS'
        ]);
      });

      after(async () => {
        // Cleanup: Uninstall
        await AppManagement.uninstallApp(bundleId);
      });

      it('Example 34: Test with permissions granted', async () => {
        console.log('Running test with permissions');
      });
    });
  });
});
