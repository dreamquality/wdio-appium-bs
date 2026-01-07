# Smart Waits Enhancement

A comprehensive wait strategy utility for WebdriverIO mobile automation, providing robust, configurable wait conditions with intelligent retry mechanisms.

## Features

### Core Wait Strategies

1. **Element Presence Wait** - Wait for element to exist in DOM
2. **Element Visibility Wait** - Wait for element to be visible
3. **Element Clickability Wait** - Wait for element to be clickable (visible + enabled)
4. **Element Disappearance Wait** - Wait for element to disappear
5. **Text Content Wait** - Wait for specific text in element
6. **Attribute Value Wait** - Wait for specific attribute value
7. **Element Count Wait** - Wait for specific number of elements

### Advanced Wait Strategies

1. **Fluent Wait** - Custom condition with exception handling
2. **Exponential Backoff Wait** - Progressive retry delays
3. **Multiple Element Wait** - Wait for any/all elements
4. **Viewport Wait** - Wait for element in viewport
5. **Page Stability Wait** - Wait for page to be stable
6. **Smart Retry** - Wrapper for any operation with retry logic

## Installation

The SmartWaits utility is already included in the repository at `test/utils/SmartWaits.ts`.

## Usage Examples

### Basic Element Waits

```typescript
import SmartWaits from '../utils/SmartWaits';

// Wait for element to be present
await SmartWaits.waitForElementPresent('~loginButton', {
  timeout: 15000,
  timeoutMsg: 'Login button not found'
});

// Wait for element to be visible
await SmartWaits.waitForElementVisible('~welcomeText', {
  timeout: 10000
});

// Wait for element to be clickable
const isClickable = await SmartWaits.waitForElementClickable('~submitButton');
```

### Text and Attribute Waits

```typescript
// Wait for specific text
await SmartWaits.waitForTextToBe(
  '~statusLabel',
  'Success',
  { timeout: 5000 }
);

// Wait for attribute value
await SmartWaits.waitForAttributeToBe(
  '~input',
  'value',
  'test@example.com',
  { timeout: 3000 }
);
```

### Multiple Element Waits

```typescript
// Wait for any element (useful for conditional flows)
const visibleElement = await SmartWaits.waitForAnyElementVisible([
  '~errorMessage',
  '~successMessage',
  '~loadingSpinner'
], { timeout: 20000 });

if (visibleElement === '~errorMessage') {
  // Handle error case
} else if (visibleElement === '~successMessage') {
  // Handle success case
}

// Wait for all elements
await SmartWaits.waitForAllElementsVisible([
  '~header',
  '~footer',
  '~mainContent'
]);
```

### Fluent Wait

```typescript
// Custom condition with exception handling
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
    ignoreExceptions: true,
    timeoutMsg: 'User data not loaded'
  }
);
```

### Exponential Backoff Wait

```typescript
// Progressive retry delays for unstable conditions
const result = await SmartWaits.waitWithBackoff(
  async () => {
    const element = await $('~dynamicContent');
    const isDisplayed = await element.isDisplayed();
    return isDisplayed ? element : false;
  },
  {
    maxAttempts: 5,
    initialDelay: 1000,  // 1s, 2s, 4s, 8s, 16s
    maxDelay: 30000,
    multiplier: 2
  }
);
```

### Smart Retry for Operations

```typescript
// Wrap any operation with automatic retry
await SmartWaits.retryOperation(
  async () => {
    await $('~submitButton').click();
    // Verify click was successful
    const success = await $('~confirmationMessage').isDisplayed();
    if (!success) throw new Error('Click failed');
  },
  {
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retry ${attempt}: ${error.message}`);
    }
  }
);
```

### Element Count Wait

```typescript
// Wait for specific number of list items
await SmartWaits.waitForElementCount(
  '//android.widget.ListView/android.widget.TextView',
  5,
  { timeout: 10000 }
);
```

### Viewport Wait

```typescript
// Ensure element is in visible viewport
await SmartWaits.waitForElementInViewport('~scrollTarget', {
  timeout: 5000
});
```

## Integration with Page Objects

Example of integrating SmartWaits into page objects:

```typescript
import Page from './page';
import SmartWaits from '../utils/SmartWaits';

class LoginPage extends Page {
  private usernameField = '~username';
  private passwordField = '~password';
  private loginButton = '~loginButton';

  async waitForLoginPage() {
    await SmartWaits.waitForAllElementsVisible([
      this.usernameField,
      this.passwordField,
      this.loginButton
    ], { timeout: 15000 });
  }

  async login(username: string, password: string) {
    await SmartWaits.retryOperation(async () => {
      await SmartWaits.waitForElementClickable(this.usernameField);
      await $(this.usernameField).setValue(username);
      
      await SmartWaits.waitForElementClickable(this.passwordField);
      await $(this.passwordField).setValue(password);
      
      await SmartWaits.waitForElementClickable(this.loginButton);
      await $(this.loginButton).click();
    }, { maxRetries: 2 });

    // Wait for either success or error message
    const result = await SmartWaits.waitForAnyElementVisible([
      '~successMessage',
      '~errorMessage'
    ], { timeout: 10000 });

    return result === '~successMessage';
  }
}

export default new LoginPage();
```

## Configuration

### Default Timeouts

- `DEFAULT_TIMEOUT`: 15000ms (15 seconds)
- `DEFAULT_INTERVAL`: 500ms (polling interval)
- `DEFAULT_POLLING_INTERVAL`: 1000ms (for fluent wait)

These can be overridden in individual wait calls via the `options` parameter.

### Custom Configuration

```typescript
// Override defaults for specific waits
await SmartWaits.waitForElementVisible('~slowElement', {
  timeout: 30000,  // 30 seconds
  interval: 1000,  // Check every second
  timeoutMsg: 'Custom timeout message'
});
```

## Best Practices

1. **Use Appropriate Wait Type**: Choose the most specific wait for your needs
   - Use `waitForElementClickable` before clicking
   - Use `waitForElementVisible` for visibility checks
   - Use `waitForTextToBe` for text verification

2. **Set Reasonable Timeouts**: Balance between test reliability and execution speed
   - Fast operations: 5-10 seconds
   - Network requests: 15-20 seconds
   - Heavy operations: 30+ seconds

3. **Leverage Fluent Wait**: For complex conditions that don't fit standard waits

4. **Use Smart Retry**: Wrap unstable operations that might fail intermittently

5. **Multiple Element Waits**: Handle conditional flows gracefully
   ```typescript
   const element = await SmartWaits.waitForAnyElementVisible([
     '~option1',
     '~option2'
   ]);
   // Handle based on which element appeared
   ```

6. **Exponential Backoff**: For operations that might need varying wait times

## Error Handling

All wait methods include built-in error handling:
- Return `false` or `null` on timeout (non-throwing behavior)
- Log descriptive timeout messages
- Optionally ignore exceptions (fluent wait)

Example with error handling:

```typescript
const isVisible = await SmartWaits.waitForElementVisible('~element');
if (!isVisible) {
  console.log('Element not visible, handling gracefully...');
  // Alternative flow
}
```

## Performance Tips

1. **Adjust Polling Intervals**: Longer intervals for slow operations
2. **Use Exponential Backoff**: For unstable network conditions
3. **Combine Waits**: Use `waitForAllElementsVisible` instead of multiple individual waits
4. **Cache Elements**: When checking multiple conditions on the same element

## Troubleshooting

### Element Not Found
```typescript
// Use fluent wait with exception handling
const element = await SmartWaits.fluentWait(
  async () => {
    const el = await $('~selector');
    return (await el.isExisting()) ? el : false;
  },
  { ignoreExceptions: true }
);
```

### Timing Issues
```typescript
// Use exponential backoff for variable timing
await SmartWaits.waitWithBackoff(
  async () => {
    // Your condition
  },
  { maxAttempts: 5 }
);
```

### Flaky Operations
```typescript
// Wrap with smart retry
await SmartWaits.retryOperation(
  async () => {
    // Your operation
  },
  { maxRetries: 3, retryDelay: 2000 }
);
```

## Additional Resources

- [WebdriverIO Wait Documentation](https://webdriver.io/docs/api/browser/waitUntil/)
- [Mobile Testing Best Practices](https://appium.io/docs/en/writing-running-appium/web/mobile-web/)
- [Handling Synchronization in Tests](https://webdriver.io/docs/sync-vs-async/)
