import { expect } from '@wdio/globals';
import SmartWaits from '../utils/SmartWaits';

/**
 * Example test demonstrating Smart Waits functionality
 * This file shows how to use various wait strategies in your tests
 */

describe('Smart Waits Examples', () => {
  
  it('Example 1: Basic element waits', async () => {
    // Wait for element to be present
    const isPresent = await SmartWaits.waitForElementPresent('~loginButton', {
      timeout: 10000
    });
    expect(isPresent).toBe(true);

    // Wait for element to be visible
    await SmartWaits.waitForElementVisible('~loginButton');

    // Wait for element to be clickable
    const isClickable = await SmartWaits.waitForElementClickable('~loginButton');
    expect(isClickable).toBe(true);
  });

  it('Example 2: Text and attribute waits', async () => {
    // Wait for specific text to appear
    await SmartWaits.waitForTextToBe(
      '~statusLabel',
      'Ready',
      { timeout: 5000 }
    );

    // Wait for attribute to have specific value
    await SmartWaits.waitForAttributeToBe(
      '~inputField',
      'enabled',
      'true',
      { timeout: 3000 }
    );
  });

  it('Example 3: Multiple element waits', async () => {
    // Wait for any of these elements (useful for conditional flows)
    const visibleElement = await SmartWaits.waitForAnyElementVisible([
      '~errorMessage',
      '~successMessage',
      '~loadingSpinner'
    ], { timeout: 15000 });

    console.log(`First visible element: ${visibleElement}`);

    // Wait for all elements to be visible
    const allVisible = await SmartWaits.waitForAllElementsVisible([
      '~header',
      '~content',
      '~footer'
    ], { timeout: 10000 });

    expect(allVisible).toBe(true);
  });

  it('Example 4: Element count wait', async () => {
    // Wait for specific number of list items
    await SmartWaits.waitForElementCount(
      '~listItem',
      5,
      { timeout: 10000 }
    );
  });

  it('Example 5: Fluent wait with custom condition', async () => {
    // Custom wait condition with exception handling
    const userData = await SmartWaits.fluentWait(
      async () => {
        try {
          const element = await $('~userProfile');
          const text = await element.getText();
          return text.length > 0 ? text : false;
        } catch {
          return false;
        }
      },
      {
        timeout: 15000,
        pollingInterval: 1000,
        ignoreExceptions: true
      }
    );

    expect(userData).not.toBeNull();
  });

  it('Example 6: Exponential backoff wait', async () => {
    // Wait with increasing delays between attempts
    const result = await SmartWaits.waitWithBackoff(
      async () => {
        const element = await $('~dynamicContent');
        const isDisplayed = await element.isDisplayed();
        return isDisplayed ? 'Success' : false;
      },
      {
        maxAttempts: 4,
        initialDelay: 1000,
        maxDelay: 10000,
        multiplier: 2
      }
    );

    expect(result).toBe('Success');
  });

  it('Example 7: Smart retry for operations', async () => {
    // Wrap operation with automatic retry
    await SmartWaits.retryOperation(
      async () => {
        const button = await $('~submitButton');
        await button.click();
        
        // Verify action succeeded
        const confirmationDisplayed = await $('~confirmation').isDisplayed();
        if (!confirmationDisplayed) {
          throw new Error('Confirmation not shown');
        }
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt}: ${error.message}`);
        }
      }
    );
  });

  it('Example 8: Element disappearance wait', async () => {
    // Click button that triggers loading spinner
    await $('~loadButton').click();

    // Wait for loading spinner to disappear
    const disappeared = await SmartWaits.waitForElementNotVisible(
      '~loadingSpinner',
      { timeout: 20000 }
    );

    expect(disappeared).toBe(true);
  });

  it('Example 9: Viewport wait', async () => {
    // Scroll and wait for element to be in viewport
    await SmartWaits.waitForElementInViewport(
      '~footerElement',
      { timeout: 5000 }
    );
  });

  it('Example 10: Combining multiple wait strategies', async () => {
    // Complex scenario with multiple waits
    
    // 1. Wait for page to load
    await SmartWaits.waitForAllElementsVisible([
      '~header',
      '~mainContent'
    ]);

    // 2. Wait for dynamic content
    const contentType = await SmartWaits.waitForAnyElementVisible([
      '~videoContent',
      '~imageContent',
      '~textContent'
    ]);

    // 3. Based on content type, perform different waits
    if (contentType === '~videoContent') {
      await SmartWaits.waitForAttributeToBe(
        '~videoPlayer',
        'state',
        'ready',
        { timeout: 15000 }
      );
    }

    // 4. Smart retry for interaction
    await SmartWaits.retryOperation(
      async () => {
        await $(contentType!).click();
      },
      { maxRetries: 2 }
    );

    // 5. Wait for result with backoff
    const result = await SmartWaits.waitWithBackoff(
      async () => {
        const resultElement = await $('~result');
        return (await resultElement.isDisplayed()) ? resultElement : false;
      },
      { maxAttempts: 3 }
    );

    expect(result).not.toBeNull();
  });

  it('Example 11: Page stability wait', async () => {
    // Wait for page animations to complete
    const isStable = await SmartWaits.waitForPageStable(500);
    expect(isStable).toBe(true);
  });

  it('Example 12: Error handling patterns', async () => {
    // Non-throwing wait - handle result
    const isVisible = await SmartWaits.waitForElementVisible(
      '~optionalElement',
      { timeout: 3000 }
    );

    if (isVisible) {
      console.log('Element found - proceed with interaction');
      await $('~optionalElement').click();
    } else {
      console.log('Element not found - using alternative flow');
      // Alternative logic
    }

    // Fluent wait with custom error handling
    const data = await SmartWaits.fluentWait(
      async () => {
        try {
          const element = await $('~dataElement');
          return await element.getText();
        } catch (error) {
          console.log(`Error getting data: ${(error as Error).message}`);
          return false;
        }
      },
      {
        timeout: 10000,
        ignoreExceptions: true
      }
    );

    // Handle null result
    expect(data).toBeDefined();
  });
});
