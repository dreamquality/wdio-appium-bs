import { browser } from '@wdio/globals'

/**
 * Platform Detection utility for automatic Android/iOS detection
 * Provides platform-specific handling and configuration
 */

export type Platform = 'android' | 'ios' | 'unknown';
export type PlatformContext = 'native' | 'web' | 'hybrid' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  platformVersion: string;
  deviceName: string;
  context: PlatformContext;
  isNative: boolean;
  isWeb: boolean;
  isHybrid: boolean;
  capabilities: any;
}

export interface PlatformSpecificSelectors {
  android: string;
  ios: string;
}

export interface PlatformSpecificConfig<T> {
  android?: T;
  ios?: T;
  default?: T;
}

export class PlatformDetection {
  private static cachedPlatformInfo: PlatformInfo | null = null;

  /**
   * Get current platform (Android or iOS)
   */
  static getPlatform(): Platform {
    if (browser.isAndroid) {
      return 'android';
    } else if (browser.isIOS) {
      return 'ios';
    }
    return 'unknown';
  }

  /**
   * Check if running on Android
   */
  static isAndroid(): boolean {
    return browser.isAndroid;
  }

  /**
   * Check if running on iOS
   */
  static isIOS(): boolean {
    return browser.isIOS;
  }

  /**
   * Get detailed platform information
   */
  static async getPlatformInfo(): Promise<PlatformInfo> {
    if (this.cachedPlatformInfo) {
      return this.cachedPlatformInfo;
    }

    const capabilities = browser.capabilities;
    const platform = this.getPlatform();
    
    // Determine context
    let context: PlatformContext = 'unknown';
    let isNative = false;
    let isWeb = false;
    let isHybrid = false;

    try {
      const currentContext = await browser.getContext();
      
      if (currentContext === 'NATIVE_APP') {
        context = 'native';
        isNative = true;
      } else if (currentContext.includes('WEBVIEW')) {
        context = 'hybrid';
        isHybrid = true;
      } else {
        context = 'web';
        isWeb = true;
      }
    } catch {
      // Default to native for mobile apps
      context = 'native';
      isNative = true;
    }

    this.cachedPlatformInfo = {
      platform,
      platformVersion: capabilities.platformVersion || capabilities.os_version || 'unknown',
      deviceName: capabilities.deviceName || capabilities.device || 'unknown',
      context,
      isNative,
      isWeb,
      isHybrid,
      capabilities
    };

    return this.cachedPlatformInfo;
  }

  /**
   * Clear cached platform info (useful if context changes)
   */
  static clearCache(): void {
    this.cachedPlatformInfo = null;
  }

  /**
   * Select platform-specific selector
   */
  static selectPlatformSelector(selectors: PlatformSpecificSelectors): string {
    return this.isAndroid() ? selectors.android : selectors.ios;
  }

  /**
   * Get platform-specific value from configuration
   */
  static getPlatformValue<T>(config: PlatformSpecificConfig<T>): T | undefined {
    const platform = this.getPlatform();
    
    if (platform === 'android' && config.android !== undefined) {
      return config.android;
    } else if (platform === 'ios' && config.ios !== undefined) {
      return config.ios;
    }
    
    return config.default;
  }

  /**
   * Execute platform-specific action
   */
  static async executePlatformSpecific<T>(
    androidAction: () => Promise<T>,
    iosAction: () => Promise<T>
  ): Promise<T> {
    if (this.isAndroid()) {
      return await androidAction();
    } else {
      return await iosAction();
    }
  }

  /**
   * Get platform-specific locator strategy
   */
  static getPlatformLocatorStrategy(): {
    accessibility: string;
    id: string;
    xpath: string;
  } {
    if (this.isAndroid()) {
      return {
        accessibility: '~', // accessibility id
        id: 'android=new UiSelector().resourceId("', // resource-id
        xpath: '//' // xpath
      };
    } else {
      return {
        accessibility: '~', // accessibility id
        id: 'ios=.name == "', // name
        xpath: '//' // xpath
      };
    }
  }

  /**
   * Build platform-specific XPath
   */
  static buildPlatformXPath(config: {
    text?: string;
    contentDesc?: string;
    resourceId?: string;
    className?: string;
  }): string {
    const { text, contentDesc, resourceId, className } = config;
    
    if (this.isAndroid()) {
      const parts: string[] = [];
      
      if (className) {
        parts.push(`android.widget.${className}`);
      } else {
        parts.push('*');
      }
      
      const attributes: string[] = [];
      if (text) attributes.push(`@text='${text}'`);
      if (contentDesc) attributes.push(`@content-desc='${contentDesc}'`);
      if (resourceId) attributes.push(`@resource-id='${resourceId}'`);
      
      if (attributes.length > 0) {
        return `//${parts[0]}[${attributes.join(' and ')}]`;
      }
      return `//${parts[0]}`;
      
    } else {
      // iOS
      const parts: string[] = [];
      
      if (className) {
        parts.push(`XCUIElementType${className}`);
      } else {
        parts.push('*');
      }
      
      const attributes: string[] = [];
      if (text) attributes.push(`@label='${text}' or @value='${text}'`);
      if (contentDesc) attributes.push(`@name='${contentDesc}'`);
      
      if (attributes.length > 0) {
        return `//${parts[0]}[${attributes.join(' and ')}]`;
      }
      return `//${parts[0]}`;
    }
  }

  /**
   * Hide keyboard in platform-specific way
   */
  static async hideKeyboard(): Promise<void> {
    try {
      if (this.isAndroid()) {
        await browser.hideKeyboard();
      } else if (this.isIOS()) {
        try {
          await browser.execute('mobile: hideKeyboard');
        } catch {
          // Fallback: tap outside keyboard area
          const windowSize = await browser.getWindowSize();
          await browser.touchAction({
            action: 'tap',
            x: windowSize.width / 2,
            y: windowSize.height - 50
          });
        }
      }
    } catch (error) {
      console.log('Keyboard hide failed, might not be visible:', (error as Error).message);
    }
  }

  /**
   * Press back button (Android only)
   */
  static async pressBackButton(): Promise<void> {
    if (this.isAndroid()) {
      await browser.pressKeyCode(4); // Android back button
    } else {
      console.log('Back button is Android-specific');
    }
  }

  /**
   * Get platform-specific app package/bundle identifier
   */
  static getAppIdentifier(): string | undefined {
    const capabilities = browser.capabilities;
    
    if (this.isAndroid()) {
      return capabilities.appPackage || capabilities['appium:appPackage'];
    } else if (this.isIOS()) {
      return capabilities.bundleId || capabilities['appium:bundleId'];
    }
    
    return undefined;
  }

  /**
   * Terminate app (platform-specific)
   */
  static async terminateApp(): Promise<void> {
    const appId = this.getAppIdentifier();
    
    if (!appId) {
      throw new Error('Cannot terminate app: app identifier not found in capabilities');
    }

    await browser.terminateApp(appId);
  }

  /**
   * Activate app (platform-specific)
   */
  static async activateApp(): Promise<void> {
    const appId = this.getAppIdentifier();
    
    if (!appId) {
      throw new Error('Cannot activate app: app identifier not found in capabilities');
    }

    await browser.activateApp(appId);
  }

  /**
   * Get platform-specific alert text
   */
  static async getAlertText(): Promise<string | null> {
    try {
      return await browser.getAlertText();
    } catch {
      return null;
    }
  }

  /**
   * Accept alert (platform-specific handling)
   * Note: iOS WebDriver has reversed terminology - dismissAlert accepts the alert
   */
  static async acceptAlert(): Promise<void> {
    if (this.isAndroid()) {
      await browser.acceptAlert();
    } else if (this.isIOS()) {
      // iOS has reversed semantics: dismissAlert actually accepts
      await browser.dismissAlert();
    }
  }

  /**
   * Dismiss alert (platform-specific handling)
   * Note: iOS WebDriver has reversed terminology - acceptAlert dismisses the alert
   */
  static async dismissAlert(): Promise<void> {
    if (this.isAndroid()) {
      await browser.dismissAlert();
    } else if (this.isIOS()) {
      // iOS has reversed semantics: acceptAlert actually dismisses
      await browser.acceptAlert();
    }
  }

  /**
   * Set device orientation (platform-specific)
   */
  static async setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE'): Promise<void> {
    await browser.setOrientation(orientation);
  }

  /**
   * Get device orientation
   */
  static async getOrientation(): Promise<string> {
    return await browser.getOrientation();
  }

  /**
   * Check if device is in portrait mode
   */
  static async isPortrait(): Promise<boolean> {
    const orientation = await this.getOrientation();
    return orientation === 'PORTRAIT';
  }

  /**
   * Check if device is in landscape mode
   */
  static async isLandscape(): Promise<boolean> {
    const orientation = await this.getOrientation();
    return orientation === 'LANDSCAPE';
  }

  /**
   * Get platform-specific element attribute name
   */
  static getAttributeName(attribute: 'text' | 'enabled' | 'selected' | 'checked'): string {
    const attributeMap: Record<string, { android: string; ios: string }> = {
      text: { android: 'text', ios: 'label' },
      enabled: { android: 'enabled', ios: 'enabled' },
      selected: { android: 'selected', ios: 'selected' },
      checked: { android: 'checked', ios: 'value' }
    };

    const mapping = attributeMap[attribute];
    return this.isAndroid() ? mapping.android : mapping.ios;
  }

  /**
   * Perform platform-specific scroll
   */
  static async scrollDown(distance: number = 0.5): Promise<void> {
    const windowSize = await browser.getWindowSize();
    const startX = windowSize.width / 2;
    const startY = windowSize.height * 0.8;
    const endY = windowSize.height * (1 - distance);

    await browser.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: 500 },
      { action: 'moveTo', x: startX, y: endY },
      'release'
    ]);
  }

  /**
   * Perform platform-specific scroll up
   */
  static async scrollUp(distance: number = 0.5): Promise<void> {
    const windowSize = await browser.getWindowSize();
    const startX = windowSize.width / 2;
    const startY = windowSize.height * 0.2;
    const endY = windowSize.height * (0.2 + distance);

    await browser.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: 500 },
      { action: 'moveTo', x: startX, y: endY },
      'release'
    ]);
  }

  /**
   * Get platform-specific system bars height (status bar + navigation bar)
   * Note: These are approximate values that may vary by device, screen size, and OS version
   * For accurate values, consider using device-specific calculations
   */
  static async getSystemBarsHeight(): Promise<{ top: number; bottom: number }> {
    // Approximate values - actual heights may vary
    if (this.isAndroid()) {
      return { top: 75, bottom: 100 }; // Approximate: Status bar + nav bar
    } else {
      return { top: 88, bottom: 34 }; // Approximate: Status bar + home indicator
    }
  }

  /**
   * Log platform information
   */
  static async logPlatformInfo(): Promise<void> {
    const info = await this.getPlatformInfo();
    
    console.log('=== Platform Information ===');
    console.log(`Platform: ${info.platform}`);
    console.log(`Version: ${info.platformVersion}`);
    console.log(`Device: ${info.deviceName}`);
    console.log(`Context: ${info.context}`);
    console.log(`Is Native: ${info.isNative}`);
    console.log(`Is Web: ${info.isWeb}`);
    console.log(`Is Hybrid: ${info.isHybrid}`);
    console.log('===========================');
  }

  /**
   * Simple pause for platform initialization
   * Note: This is a basic delay, not an actual platform readiness check
   * Consider implementing specific readiness checks based on your app's needs
   */
  static async pauseForPlatform(delay: number = 5000): Promise<void> {
    await browser.pause(delay);
    console.log(`Platform ${this.getPlatform()} initialization pause completed`);
  }

  /**
   * Get platform-specific gesture duration
   */
  static getGestureDuration(gestureType: 'tap' | 'swipe' | 'longPress'): number {
    const durations = {
      tap: { android: 100, ios: 100 },
      swipe: { android: 500, ios: 500 },
      longPress: { android: 1000, ios: 1500 }
    };

    const duration = durations[gestureType];
    return this.isAndroid() ? duration.android : duration.ios;
  }
}

export default PlatformDetection;
