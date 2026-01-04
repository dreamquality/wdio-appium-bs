import { browser } from '@wdio/globals'
import SmartWaits from './SmartWaits'

/**
 * Element Interaction Helpers for robust mobile automation
 * Provides intelligent interaction methods with auto-retry, state validation, and error handling
 */

export interface InteractionOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  waitForClickable?: boolean;
  scrollIntoView?: boolean;
  takeScreenshotOnError?: boolean;
}

export interface TapOptions extends InteractionOptions {
  duration?: number;
  x?: number;
  y?: number;
}

export interface SwipeOptions {
  direction: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
}

export interface InputOptions extends InteractionOptions {
  clearFirst?: boolean;
  hideKeyboard?: boolean;
  validateInput?: boolean;
}

export class ElementInteractionHelpers {
  private static readonly DEFAULT_TIMEOUT = 15000;
  private static readonly DEFAULT_RETRIES = 3;
  private static readonly DEFAULT_RETRY_DELAY = 1000;

  /**
   * Smart click with automatic retries and state validation
   */
  static async smartClick(
    selector: string,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES,
      retryDelay = this.DEFAULT_RETRY_DELAY,
      waitForClickable = true,
      scrollIntoView = false,
      takeScreenshotOnError = true
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Wait for element to be visible
        await SmartWaits.waitForElementVisible(selector, { timeout });

        // Scroll into view if requested
        if (scrollIntoView) {
          const element = await $(selector);
          await element.scrollIntoView();
          await browser.pause(500);
        }

        // Wait for element to be clickable
        if (waitForClickable) {
          await SmartWaits.waitForElementClickable(selector, { timeout });
        }

        // Perform click
        const element = await $(selector);
        await element.click();

        console.log(`✓ Successfully clicked element ${selector} on attempt ${attempt}`);
        return true;

      } catch (error) {
        const err = error as Error;
        console.log(`✗ Click attempt ${attempt}/${retries} failed for ${selector}: ${err.message}`);

        if (attempt === retries) {
          if (takeScreenshotOnError) {
            try {
              const screenshot = await browser.saveScreenshot(`./error-click-${Date.now()}.png`);
              console.log(`Screenshot saved: ${screenshot}`);
            } catch {}
          }
          throw new Error(`Failed to click ${selector} after ${retries} attempts: ${err.message}`);
        }

        await browser.pause(retryDelay);
      }
    }

    return false;
  }

  /**
   * Smart tap with coordinates or element
   */
  static async smartTap(
    selector: string,
    options: TapOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES,
      duration = 100
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await SmartWaits.waitForElementVisible(selector, { timeout });

        const element = await $(selector);
        
        if (options.x !== undefined && options.y !== undefined) {
          // Tap at specific coordinates within element
          const location = await element.getLocation();
          const size = await element.getSize();
          const x = location.x + (options.x || size.width / 2);
          const y = location.y + (options.y || size.height / 2);
          
          await browser.touchAction([
            { action: 'tap', x, y }
          ]);
        } else {
          // Tap center of element
          await element.touchAction('tap');
        }

        console.log(`✓ Successfully tapped element ${selector}`);
        return true;

      } catch (error) {
        console.log(`✗ Tap attempt ${attempt}/${retries} failed for ${selector}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        await browser.pause(this.DEFAULT_RETRY_DELAY);
      }
    }

    return false;
  }

  /**
   * Smart input with validation and keyboard handling
   */
  static async smartInput(
    selector: string,
    value: string,
    options: InputOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES,
      clearFirst = true,
      hideKeyboard = true,
      validateInput = true,
      scrollIntoView = false
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Wait for element to be visible and enabled
        await SmartWaits.waitForElementVisible(selector, { timeout });
        await SmartWaits.waitForElementEnabled(selector, { timeout });

        const element = await $(selector);

        // Scroll if needed
        if (scrollIntoView) {
          await element.scrollIntoView();
          await browser.pause(500);
        }

        // Clear existing value
        if (clearFirst) {
          await element.clearValue();
          await browser.pause(300);
        }

        // Set value
        await element.setValue(value);
        await browser.pause(300);

        // Validate input if requested
        if (validateInput) {
          const actualValue = await element.getValue();
          if (actualValue !== value) {
            throw new Error(`Input validation failed. Expected: ${value}, Got: ${actualValue}`);
          }
        }

        // Hide keyboard
        if (hideKeyboard) {
          try {
            if (browser.isAndroid) {
              await browser.hideKeyboard();
            } else if (browser.isIOS) {
              await browser.execute('mobile: hideKeyboard');
            }
          } catch {
            // Keyboard might not be visible
          }
        }

        console.log(`✓ Successfully entered text in ${selector}`);
        return true;

      } catch (error) {
        console.log(`✗ Input attempt ${attempt}/${retries} failed for ${selector}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        await browser.pause(this.DEFAULT_RETRY_DELAY);
      }
    }

    return false;
  }

  /**
   * Smart swipe on element
   */
  static async smartSwipe(
    selector: string,
    options: SwipeOptions
  ): Promise<boolean> {
    try {
      await SmartWaits.waitForElementVisible(selector, { timeout: this.DEFAULT_TIMEOUT });

      const element = await $(selector);
      const location = await element.getLocation();
      const size = await element.getSize();

      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      const distance = options.distance || (options.direction === 'up' || options.direction === 'down' ? size.height * 0.5 : size.width * 0.5);
      const duration = options.duration || 500;

      let startX = centerX;
      let startY = centerY;
      let endX = centerX;
      let endY = centerY;

      switch (options.direction) {
        case 'up':
          startY = centerY + distance / 2;
          endY = centerY - distance / 2;
          break;
        case 'down':
          startY = centerY - distance / 2;
          endY = centerY + distance / 2;
          break;
        case 'left':
          startX = centerX + distance / 2;
          endX = centerX - distance / 2;
          break;
        case 'right':
          startX = centerX - distance / 2;
          endX = centerX + distance / 2;
          break;
      }

      await browser.touchAction([
        { action: 'press', x: startX, y: startY },
        { action: 'wait', ms: duration },
        { action: 'moveTo', x: endX, y: endY },
        'release'
      ]);

      console.log(`✓ Successfully swiped ${options.direction} on ${selector}`);
      return true;

    } catch (error) {
      console.log(`✗ Swipe failed for ${selector}: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Long press with duration
   */
  static async smartLongPress(
    selector: string,
    duration: number = 1000,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const { timeout = this.DEFAULT_TIMEOUT } = options;

    try {
      await SmartWaits.waitForElementVisible(selector, { timeout });

      const element = await $(selector);
      const location = await element.getLocation();
      const size = await element.getSize();

      const x = location.x + size.width / 2;
      const y = location.y + size.height / 2;

      await browser.touchAction([
        { action: 'press', x, y },
        { action: 'wait', ms: duration },
        'release'
      ]);

      console.log(`✓ Successfully long pressed ${selector} for ${duration}ms`);
      return true;

    } catch (error) {
      console.log(`✗ Long press failed for ${selector}`);
      throw error;
    }
  }

  /**
   * Double tap element
   */
  static async smartDoubleTap(
    selector: string,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const { timeout = this.DEFAULT_TIMEOUT } = options;

    try {
      await SmartWaits.waitForElementClickable(selector, { timeout });

      const element = await $(selector);
      await element.touchAction('tap');
      await browser.pause(100);
      await element.touchAction('tap');

      console.log(`✓ Successfully double tapped ${selector}`);
      return true;

    } catch (error) {
      console.log(`✗ Double tap failed for ${selector}`);
      throw error;
    }
  }

  /**
   * Select option from dropdown/picker
   */
  static async smartSelect(
    selector: string,
    value: string,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await SmartWaits.waitForElementVisible(selector, { timeout });

        const element = await $(selector);

        // Try different selection methods
        try {
          // Method 1: Direct select
          await element.selectByVisibleText(value);
        } catch {
          try {
            // Method 2: Click and select
            await element.click();
            await browser.pause(500);
            // Sanitize value to prevent XPath injection
            const sanitizedValue = value.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
            const option = await $(`//*[@text='${sanitizedValue}' or @label='${sanitizedValue}']`);
            await option.click();
          } catch {
            // Method 3: Set value directly
            await element.setValue(value);
          }
        }

        console.log(`✓ Successfully selected "${value}" in ${selector}`);
        return true;

      } catch (error) {
        console.log(`✗ Select attempt ${attempt}/${retries} failed for ${selector}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        await browser.pause(this.DEFAULT_RETRY_DELAY);
      }
    }

    return false;
  }

  /**
   * Check/uncheck checkbox or toggle
   */
  static async smartToggle(
    selector: string,
    checked: boolean,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const { timeout = this.DEFAULT_TIMEOUT } = options;

    try {
      await SmartWaits.waitForElementVisible(selector, { timeout });

      const element = await $(selector);
      const isChecked = await element.getAttribute('checked') === 'true' || 
                        await element.getAttribute('selected') === 'true';

      // Only toggle if current state differs from desired state
      if (isChecked !== checked) {
        await element.click();
        await browser.pause(500);

        // Verify state changed
        const newState = await element.getAttribute('checked') === 'true' || 
                         await element.getAttribute('selected') === 'true';
        
        if (newState !== checked) {
          throw new Error(`Toggle state verification failed for ${selector}`);
        }
      }

      console.log(`✓ Successfully set toggle ${selector} to ${checked}`);
      return true;

    } catch (error) {
      console.log(`✗ Toggle failed for ${selector}`);
      throw error;
    }
  }

  /**
   * Drag element to target
   */
  static async smartDrag(
    sourceSelector: string,
    targetSelector: string,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const { timeout = this.DEFAULT_TIMEOUT } = options;

    try {
      await SmartWaits.waitForElementVisible(sourceSelector, { timeout });
      await SmartWaits.waitForElementVisible(targetSelector, { timeout });

      const source = await $(sourceSelector);
      const target = await $(targetSelector);

      const sourceLocation = await source.getLocation();
      const sourceSize = await source.getSize();
      const targetLocation = await target.getLocation();
      const targetSize = await target.getSize();

      const startX = sourceLocation.x + sourceSize.width / 2;
      const startY = sourceLocation.y + sourceSize.height / 2;
      const endX = targetLocation.x + targetSize.width / 2;
      const endY = targetLocation.y + targetSize.height / 2;

      await browser.touchAction([
        { action: 'press', x: startX, y: startY },
        { action: 'wait', ms: 500 },
        { action: 'moveTo', x: endX, y: endY },
        'release'
      ]);

      console.log(`✓ Successfully dragged ${sourceSelector} to ${targetSelector}`);
      return true;

    } catch (error) {
      console.log(`✗ Drag failed from ${sourceSelector} to ${targetSelector}`);
      throw error;
    }
  }

  /**
   * Scroll to element and ensure it's in viewport
   */
  static async smartScrollTo(
    selector: string,
    options: InteractionOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Wait for element to exist
        await SmartWaits.waitForElementPresent(selector, { timeout });

        const element = await $(selector);
        
        // Scroll into view (works for both web and native contexts)
        try {
          await element.scrollIntoView();
        } catch {
          // Fallback for native apps - try touch actions
          try {
            const location = await element.getLocation();
            const windowSize = await browser.getWindowSize();
            
            // Check if element is below viewport
            if (location.y > windowSize.height) {
              await browser.touchAction([
                { action: 'press', x: windowSize.width / 2, y: windowSize.height * 0.8 },
                { action: 'wait', ms: 100 },
                { action: 'moveTo', x: windowSize.width / 2, y: windowSize.height * 0.2 },
                'release'
              ]);
            }
          } catch {
            // Ignore if native scrolling fails
          }
        }
        await browser.pause(500);

        console.log(`✓ Successfully scrolled to ${selector}`);
        return true;

      } catch (error) {
        console.log(`✗ Scroll attempt ${attempt}/${retries} failed for ${selector}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        await browser.pause(this.DEFAULT_RETRY_DELAY);
      }
    }

    return false;
  }

  /**
   * Get text with retry and trimming
   */
  static async smartGetText(
    selector: string,
    options: InteractionOptions = {}
  ): Promise<string> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.DEFAULT_RETRIES
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await SmartWaits.waitForElementVisible(selector, { timeout });

        const element = await $(selector);
        const text = await element.getText();

        return text.trim();

      } catch (error) {
        console.log(`✗ Get text attempt ${attempt}/${retries} failed for ${selector}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        await browser.pause(this.DEFAULT_RETRY_DELAY);
      }
    }

    return '';
  }

  /**
   * Wait and verify element state before interaction
   */
  static async verifyElementState(
    selector: string,
    options: {
      shouldBeVisible?: boolean;
      shouldBeClickable?: boolean;
      shouldBeEnabled?: boolean;
      timeout?: number;
    } = {}
  ): Promise<boolean> {
    const {
      shouldBeVisible = true,
      shouldBeClickable = false,
      shouldBeEnabled = false,
      timeout = this.DEFAULT_TIMEOUT
    } = options;

    try {
      if (shouldBeVisible) {
        await SmartWaits.waitForElementVisible(selector, { timeout });
      }

      if (shouldBeClickable) {
        await SmartWaits.waitForElementClickable(selector, { timeout });
      }

      if (shouldBeEnabled) {
        await SmartWaits.waitForElementEnabled(selector, { timeout });
      }

      return true;

    } catch (error) {
      console.log(`✗ Element state verification failed for ${selector}`);
      return false;
    }
  }

  /**
   * Safe interaction wrapper - catches errors and returns boolean
   */
  static async safeInteraction(
    interaction: () => Promise<void>,
    fallback?: () => Promise<void>
  ): Promise<boolean> {
    try {
      await interaction();
      return true;
    } catch (error) {
      console.log(`✗ Interaction failed: ${(error as Error).message}`);
      
      if (fallback) {
        try {
          await fallback();
          return true;
        } catch {
          return false;
        }
      }
      
      return false;
    }
  }

  /**
   * Chain multiple interactions with automatic error handling
   */
  static async chainInteractions(
    ...interactions: Array<() => Promise<void>>
  ): Promise<boolean> {
    for (const interaction of interactions) {
      try {
        await interaction();
      } catch (error) {
        console.log(`✗ Interaction chain failed: ${(error as Error).message}`);
        return false;
      }
    }
    return true;
  }
}

export default ElementInteractionHelpers;
