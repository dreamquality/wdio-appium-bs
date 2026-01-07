/**
 * App Management Utility
 * 
 * Provides comprehensive app lifecycle management for mobile automation:
 * - Install/uninstall apps
 * - App state management (background, foreground, terminate)
 * - App reset and clear data
 * - App permissions management
 * - App settings and storage
 * 
 * Note: This utility uses the global `driver` object from WebdriverIO.
 * Ensure tests are run in a WebdriverIO context where `driver` is available.
 * 
 * @example
 * import AppManagement from '../utils/AppManagement';
 * 
 * // Install app
 * await AppManagement.installApp('/path/to/app.apk');
 * 
 * // Background and reactivate
 * await AppManagement.backgroundApp(5);
 * 
 * // Clear app data
 * await AppManagement.clearAppData();
 */

interface AppInfo {
  bundleId: string;
  version?: string;
  name?: string;
  state?: 'not_running' | 'running_in_background' | 'running_in_foreground';
}

interface InstallOptions {
  replace?: boolean;
  allowTestPackages?: boolean;
  grantPermissions?: boolean;
  timeout?: number;
}

interface PermissionOptions {
  permissions: string[];
  action?: 'grant' | 'revoke';
}

interface BackgroundOptions {
  duration?: number;
}

class AppManagement {
  // Configuration constants
  private static readonly DEFAULT_POLL_INTERVAL = 500; // milliseconds
  private static readonly DEFAULT_STATE_WAIT_PAUSE = 1000; // milliseconds

  /**
   * Install an app on the device
   * @param appPath Path to the app file (.apk for Android, .app/.ipa for iOS)
   * @param options Install options
   * @returns Promise<boolean> True if installation successful
   */
  static async installApp(appPath: string, options: InstallOptions = {}): Promise<boolean> {
    try {
      console.log(`Installing app from: ${appPath}`);
      
      const installOptions = {
        replace: options.replace !== false, // Default to true
        allowTestPackages: options.allowTestPackages || false,
        grantPermissions: options.grantPermissions || false,
        timeout: options.timeout || 60000,
      };

      await driver.installApp(appPath, installOptions);
      console.log('App installed successfully');
      return true;
    } catch (error) {
      console.error('Failed to install app:', error);
      return false;
    }
  }

  /**
   * Uninstall an app from the device
   * @param bundleId Bundle ID (Android) or App ID (iOS)
   * @returns Promise<boolean> True if uninstallation successful
   */
  static async uninstallApp(bundleId: string): Promise<boolean> {
    try {
      console.log(`Uninstalling app: ${bundleId}`);
      await driver.removeApp(bundleId);
      console.log('App uninstalled successfully');
      return true;
    } catch (error) {
      console.error('Failed to uninstall app:', error);
      return false;
    }
  }

  /**
   * Check if an app is installed
   * @param bundleId Bundle ID to check
   * @returns Promise<boolean> True if app is installed
   */
  static async isAppInstalled(bundleId: string): Promise<boolean> {
    try {
      const installed = await driver.isAppInstalled(bundleId);
      console.log(`App ${bundleId} installed: ${installed}`);
      return installed;
    } catch (error) {
      console.error('Failed to check if app is installed:', error);
      return false;
    }
  }

  /**
   * Launch the app
   * @param bundleId Optional bundle ID (if different from capabilities)
   * @returns Promise<void>
   */
  static async launchApp(bundleId?: string): Promise<void> {
    try {
      if (bundleId) {
        console.log(`Launching app: ${bundleId}`);
        await driver.activateApp(bundleId);
      } else {
        console.log('Launching app');
        await driver.launchApp();
      }
      console.log('App launched successfully');
    } catch (error) {
      console.error('Failed to launch app:', error);
      throw error;
    }
  }

  /**
   * Close/terminate the app
   * @param bundleId Optional bundle ID (if different from capabilities)
   * @returns Promise<void>
   */
  static async closeApp(bundleId?: string): Promise<void> {
    try {
      if (bundleId) {
        console.log(`Terminating app: ${bundleId}`);
        await driver.terminateApp(bundleId);
      } else {
        console.log('Closing app');
        await driver.closeApp();
      }
      console.log('App closed successfully');
    } catch (error) {
      console.error('Failed to close app:', error);
      throw error;
    }
  }

  /**
   * Reset the app (reinstall and clear data)
   * @returns Promise<void>
   */
  static async resetApp(): Promise<void> {
    try {
      console.log('Resetting app');
      await driver.reset();
      console.log('App reset successfully');
    } catch (error) {
      console.error('Failed to reset app:', error);
      throw error;
    }
  }

  /**
   * Send app to background for specified duration
   * @param duration Duration in seconds (default: -1 for indefinite)
   * @returns Promise<void>
   */
  static async backgroundApp(duration: number = -1): Promise<void> {
    try {
      console.log(`Sending app to background for ${duration} seconds`);
      await driver.background(duration);
      console.log('App sent to background');
    } catch (error) {
      console.error('Failed to background app:', error);
      throw error;
    }
  }

  /**
   * Activate/bring app to foreground
   * @param bundleId Bundle ID of the app
   * @returns Promise<void>
   */
  static async activateApp(bundleId: string): Promise<void> {
    try {
      console.log(`Activating app: ${bundleId}`);
      await driver.activateApp(bundleId);
      console.log('App activated successfully');
    } catch (error) {
      console.error('Failed to activate app:', error);
      throw error;
    }
  }

  /**
   * Terminate the app (force stop)
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if app was running
   */
  static async terminateApp(bundleId: string): Promise<boolean> {
    try {
      console.log(`Terminating app: ${bundleId}`);
      const wasRunning = await driver.terminateApp(bundleId);
      console.log(`App terminated. Was running: ${wasRunning}`);
      return wasRunning;
    } catch (error) {
      console.error('Failed to terminate app:', error);
      return false;
    }
  }

  /**
   * Get current app state
   * @param bundleId Bundle ID of the app
   * @returns Promise<number> App state (0-4)
   * 0 - not installed, 1 - not running, 2 - background suspended, 3 - background running, 4 - foreground
   */
  static async getAppState(bundleId: string): Promise<number> {
    try {
      const state = await driver.queryAppState(bundleId);
      console.log(`App ${bundleId} state: ${state}`);
      return state;
    } catch (error) {
      console.error('Failed to get app state:', error);
      return 0;
    }
  }

  /**
   * Check if app is running in foreground
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if app is in foreground
   */
  static async isAppInForeground(bundleId: string): Promise<boolean> {
    try {
      const state = await this.getAppState(bundleId);
      return state === 4; // 4 = foreground
    } catch (error) {
      console.error('Failed to check if app is in foreground:', error);
      return false;
    }
  }

  /**
   * Check if app is running (foreground or background)
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if app is running
   */
  static async isAppRunning(bundleId: string): Promise<boolean> {
    try {
      const state = await this.getAppState(bundleId);
      return state >= 2; // 2-4 = running states
    } catch (error) {
      console.error('Failed to check if app is running:', error);
      return false;
    }
  }

  /**
   * Clear app data (Android only)
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if successful
   */
  static async clearAppData(bundleId?: string): Promise<boolean> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        const capabilities = await driver.capabilities;
        const appId = bundleId || (capabilities.appPackage as string | undefined) || '';
        
        if (!appId) {
          console.error('No bundle ID provided and appPackage not found in capabilities');
          return false;
        }
        
        console.log(`Clearing app data for: ${appId}`);
        
        // Use ADB to clear app data
        await driver.execute('mobile: shell', { command: 'pm', args: ['clear', appId] });
        console.log('App data cleared successfully');
        return true;
      } else {
        console.log('Clear app data is only supported on Android');
        return false;
      }
    } catch (error) {
      console.error('Failed to clear app data:', error);
      return false;
    }
  }

  /**
   * Grant permissions to the app (Android only)
   * @param bundleId Bundle ID of the app
   * @param permissions Array of permission names
   * @returns Promise<boolean> True if successful
   */
  static async grantPermissions(bundleId: string, permissions: string[]): Promise<boolean> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        console.log(`Granting permissions to ${bundleId}:`, permissions);
        
        for (const permission of permissions) {
          await driver.execute('mobile: shell', {
            command: 'pm',
            args: ['grant', bundleId, permission]
          });
        }
        
        console.log('Permissions granted successfully');
        return true;
      } else {
        console.log('Grant permissions is only supported on Android');
        return false;
      }
    } catch (error) {
      console.error('Failed to grant permissions:', error);
      return false;
    }
  }

  /**
   * Revoke permissions from the app (Android only)
   * @param bundleId Bundle ID of the app
   * @param permissions Array of permission names
   * @returns Promise<boolean> True if successful
   */
  static async revokePermissions(bundleId: string, permissions: string[]): Promise<boolean> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        console.log(`Revoking permissions from ${bundleId}:`, permissions);
        
        for (const permission of permissions) {
          await driver.execute('mobile: shell', {
            command: 'pm',
            args: ['revoke', bundleId, permission]
          });
        }
        
        console.log('Permissions revoked successfully');
        return true;
      } else {
        console.log('Revoke permissions is only supported on Android');
        return false;
      }
    } catch (error) {
      console.error('Failed to revoke permissions:', error);
      return false;
    }
  }

  /**
   * Get app strings (localization strings)
   * @param language Optional language code (e.g., 'en', 'es')
   * @returns Promise<Record<string, string>> App strings
   */
  static async getAppStrings(language?: string): Promise<Record<string, string>> {
    try {
      console.log(`Getting app strings${language ? ` for language: ${language}` : ''}`);
      const strings = await driver.getAppStrings(language);
      return strings;
    } catch (error) {
      console.error('Failed to get app strings:', error);
      return {};
    }
  }

  /**
   * Reinstall app (uninstall and install)
   * @param bundleId Bundle ID to uninstall
   * @param appPath Path to app file to install
   * @param options Install options
   * @returns Promise<boolean> True if successful
   */
  static async reinstallApp(
    bundleId: string,
    appPath: string,
    options: InstallOptions = {}
  ): Promise<boolean> {
    try {
      console.log('Reinstalling app...');
      
      // Check if app is installed
      const isInstalled = await this.isAppInstalled(bundleId);
      
      // Uninstall if installed
      if (isInstalled) {
        await this.uninstallApp(bundleId);
      }
      
      // Install app
      const installed = await this.installApp(appPath, options);
      
      if (installed) {
        console.log('App reinstalled successfully');
      }
      
      return installed;
    } catch (error) {
      console.error('Failed to reinstall app:', error);
      return false;
    }
  }

  /**
   * Start app activity (Android only)
   * @param appPackage App package name
   * @param appActivity Activity name
   * @returns Promise<void>
   */
  static async startActivity(appPackage: string, appActivity: string): Promise<void> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        console.log(`Starting activity: ${appPackage}/${appActivity}`);
        await driver.startActivity(appPackage, appActivity);
        console.log('Activity started successfully');
      } else {
        console.log('Start activity is only supported on Android');
      }
    } catch (error) {
      console.error('Failed to start activity:', error);
      throw error;
    }
  }

  /**
   * Get current activity (Android only)
   * @returns Promise<string> Current activity name
   */
  static async getCurrentActivity(): Promise<string> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        const activity = await driver.getCurrentActivity();
        console.log(`Current activity: ${activity}`);
        return activity;
      } else {
        console.log('Get current activity is only supported on Android');
        return '';
      }
    } catch (error) {
      console.error('Failed to get current activity:', error);
      return '';
    }
  }

  /**
   * Get current package (Android only)
   * @returns Promise<string> Current package name
   */
  static async getCurrentPackage(): Promise<string> {
    try {
      const platform = (await driver.capabilities).platformName?.toLowerCase();
      
      if (platform === 'android') {
        const packageName = await driver.getCurrentPackage();
        console.log(`Current package: ${packageName}`);
        return packageName;
      } else {
        console.log('Get current package is only supported on Android');
        return '';
      }
    } catch (error) {
      console.error('Failed to get current package:', error);
      return '';
    }
  }

  /**
   * Wait for app to be in specific state
   * @param bundleId Bundle ID of the app
   * @param targetState Target state (1-4)
   * @param timeout Timeout in milliseconds
   * @param pollInterval Polling interval in milliseconds (default: 500)
   * @returns Promise<boolean> True if state reached
   */
  static async waitForAppState(
    bundleId: string,
    targetState: number,
    timeout: number = 10000,
    pollInterval: number = AppManagement.DEFAULT_POLL_INTERVAL
  ): Promise<boolean> {
    const startTime = Date.now();

    try {
      console.log(`Waiting for app ${bundleId} to reach state ${targetState}`);

      while (Date.now() - startTime < timeout) {
        const currentState = await this.getAppState(bundleId);
        
        if (currentState === targetState) {
          console.log(`App reached target state ${targetState}`);
          return true;
        }

        await driver.pause(pollInterval);
      }

      console.log(`Timeout waiting for app state ${targetState}`);
      return false;
    } catch (error) {
      console.error('Failed to wait for app state:', error);
      return false;
    }
  }

  /**
   * Get app info
   * @param bundleId Bundle ID of the app
   * @returns Promise<AppInfo | null> App information
   */
  static async getAppInfo(bundleId: string): Promise<AppInfo | null> {
    try {
      const isInstalled = await this.isAppInstalled(bundleId);
      
      if (!isInstalled) {
        return null;
      }

      const state = await this.getAppState(bundleId);
      let stateString: 'not_running' | 'running_in_background' | 'running_in_foreground' = 'not_running';
      
      if (state === 4) {
        stateString = 'running_in_foreground';
      } else if (state === 2 || state === 3) {
        stateString = 'running_in_background';
      }

      const info: AppInfo = {
        bundleId,
        state: stateString,
      };

      console.log('App info:', info);
      return info;
    } catch (error) {
      console.error('Failed to get app info:', error);
      return null;
    }
  }

  /**
   * Ensure app is in foreground (launch if not running, activate if in background)
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if app is now in foreground
   */
  static async ensureAppInForeground(bundleId: string): Promise<boolean> {
    try {
      console.log(`Ensuring app ${bundleId} is in foreground`);
      
      const state = await this.getAppState(bundleId);
      
      if (state === 4) {
        console.log('App is already in foreground');
        return true;
      }
      
      if (state === 0) {
        console.log('App is not installed');
        return false;
      }
      
      if (state === 1) {
        console.log('App is not running, launching...');
        await this.launchApp(bundleId);
      } else {
        console.log('App is in background, activating...');
        await this.activateApp(bundleId);
      }
      
      // Wait for app to be in foreground
      const inForeground = await this.waitForAppState(bundleId, 4, 5000);
      return inForeground;
    } catch (error) {
      console.error('Failed to ensure app in foreground:', error);
      return false;
    }
  }

  /**
   * Kill and restart app
   * @param bundleId Bundle ID of the app
   * @returns Promise<boolean> True if successful
   */
  static async restartApp(bundleId: string): Promise<boolean> {
    try {
      console.log(`Restarting app: ${bundleId}`);
      
      // Terminate app
      await this.terminateApp(bundleId);
      
      // Wait for app to reach 'not running' state
      await this.waitForAppState(bundleId, 1, 5000);
      
      // Launch app
      await this.launchApp(bundleId);
      
      // Wait for app to be in foreground
      const inForeground = await this.waitForAppState(bundleId, 4, 5000);
      
      if (inForeground) {
        console.log('App restarted successfully');
      }
      
      return inForeground;
    } catch (error) {
      console.error('Failed to restart app:', error);
      return false;
    }
  }
}

export default AppManagement;
