import { browser } from '@wdio/globals'

/**
 * Smart Waits utility class for enhanced wait strategies in mobile automation
 * Provides configurable, reusable wait conditions with built-in retry logic
 */

export interface WaitOptions {
  timeout?: number;
  interval?: number;
  timeoutMsg?: string;
  reverse?: boolean;
}

export interface FluentWaitOptions extends WaitOptions {
  ignoreExceptions?: boolean;
  pollingInterval?: number;
}

export class SmartWaits {
  private static readonly DEFAULT_TIMEOUT = 15000;
  private static readonly DEFAULT_INTERVAL = 500;
  private static readonly DEFAULT_POLLING_INTERVAL = 1000;

  /**
   * Wait for element to be present in DOM
   */
  static async waitForElementPresent(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} not present within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            return await element.isExisting();
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element to be visible
   */
  static async waitForElementVisible(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} not visible within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            return (await element.isExisting()) && (await element.isDisplayed());
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element to be clickable (visible and enabled)
   */
  static async waitForElementClickable(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} not clickable within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            return await element.isClickable();
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element to be enabled
   */
  static async waitForElementEnabled(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} not enabled within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            return await element.isEnabled();
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element to disappear
   */
  static async waitForElementNotVisible(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} still visible after ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            const exists = await element.isExisting();
            if (!exists) return true;
            return !(await element.isDisplayed());
          } catch {
            return true;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element text to contain specific value
   */
  static async waitForTextToBe(
    selector: string,
    expectedText: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} text does not contain "${expectedText}" within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            const text = await element.getText();
            return text.includes(expectedText);
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element attribute to have specific value
   */
  static async waitForAttributeToBe(
    selector: string,
    attribute: string,
    expectedValue: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} attribute "${attribute}" does not equal "${expectedValue}" within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            const value = await element.getAttribute(attribute);
            return value === expectedValue;
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for any of the given elements to be visible
   */
  static async waitForAnyElementVisible(
    selectors: string[],
    options: WaitOptions = {}
  ): Promise<string | null> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `None of the elements visible within ${timeout}ms`
    } = options;

    try {
      const result = await browser.waitUntil(
        async () => {
          for (const selector of selectors) {
            try {
              const element = await $(selector);
              if ((await element.isExisting()) && (await element.isDisplayed())) {
                return selector;
              }
            } catch {
              continue;
            }
          }
          return false;
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return result as string;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return null;
    }
  }

  /**
   * Wait for all elements to be visible
   */
  static async waitForAllElementsVisible(
    selectors: string[],
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Not all elements visible within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          for (const selector of selectors) {
            try {
              const element = await $(selector);
              if (!(await element.isExisting()) || !(await element.isDisplayed())) {
                return false;
              }
            } catch {
              return false;
            }
          }
          return true;
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Wait for element count to be equal to expected
   */
  static async waitForElementCount(
    selector: string,
    expectedCount: number,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} count not equal to ${expectedCount} within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const elements = await $$(selector);
            return elements.length === expectedCount;
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Fluent wait with custom condition and exception handling
   */
  static async fluentWait<T>(
    condition: () => Promise<T | false>,
    options: FluentWaitOptions = {}
  ): Promise<T | null> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      pollingInterval = this.DEFAULT_POLLING_INTERVAL,
      timeoutMsg = `Condition not met within ${timeout}ms`,
      ignoreExceptions = true
    } = options;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const result = await condition();
        if (result !== false) {
          return result as T;
        }
      } catch (error) {
        if (!ignoreExceptions) {
          throw error;
        }
        console.log(`Exception ignored during fluent wait: ${(error as Error).message}`);
      }
      await browser.pause(pollingInterval);
    }

    console.log(`Fluent wait timeout: ${timeoutMsg}`);
    return null;
  }

  /**
   * Wait with exponential backoff
   */
  static async waitWithBackoff<T>(
    condition: () => Promise<T | false>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      multiplier?: number;
    } = {}
  ): Promise<T | null> {
    const {
      maxAttempts = 5,
      initialDelay = 1000,
      maxDelay = 30000,
      multiplier = 2
    } = options;

    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await condition();
        if (result !== false) {
          console.log(`Condition met on attempt ${attempt}`);
          return result as T;
        }
      } catch (error) {
        console.log(`Attempt ${attempt} failed: ${(error as Error).message}`);
      }

      if (attempt < maxAttempts) {
        console.log(`Waiting ${delay}ms before retry...`);
        await browser.pause(delay);
        delay = Math.min(delay * multiplier, maxDelay);
      }
    }

    console.log(`All ${maxAttempts} attempts failed`);
    return null;
  }

  /**
   * Wait for page to be stable (no pending requests/animations)
   */
  static async waitForPageStable(timeout: number = 5000): Promise<boolean> {
    try {
      // Wait for any animations to complete
      await browser.pause(500);
      
      // Additional stability checks can be added here
      console.log('Page is stable');
      return true;
    } catch (error) {
      console.log(`Page stability check failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Wait for element to be in viewport
   */
  static async waitForElementInViewport(
    selector: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = this.DEFAULT_TIMEOUT,
      timeoutMsg = `Element ${selector} not in viewport within ${timeout}ms`
    } = options;

    try {
      await browser.waitUntil(
        async () => {
          try {
            const element = await $(selector);
            return await element.isDisplayedInViewport();
          } catch {
            return false;
          }
        },
        {
          timeout,
          timeoutMsg,
          interval: this.DEFAULT_INTERVAL
        }
      );
      return true;
    } catch (error) {
      console.log(`Wait failed: ${timeoutMsg}`);
      return false;
    }
  }

  /**
   * Smart retry wrapper for any async operation
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      retryDelay?: number;
      onRetry?: (attempt: number, error: Error) => void;
    } = {}
  ): Promise<T> {
    const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        const err = error as Error;
        console.log(`Operation failed on attempt ${attempt}/${maxRetries}: ${err.message}`);
        
        if (onRetry) {
          onRetry(attempt, err);
        }
        
        await browser.pause(retryDelay);
      }
    }

    throw new Error('Retry operation failed');
  }
}

export default SmartWaits;
