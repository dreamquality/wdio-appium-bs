# Element Interaction Helpers

Intelligent interaction methods with auto-retry, state validation, and error handling for robust mobile automation.

## Features

### Smart Click & Tap
- **smartClick**: Intelligent clicking with retry and state validation
- **smartTap**: Touch-based tap with coordinate support
- **smartDoubleTap**: Double tap gesture
- **smartLongPress**: Long press with configurable duration

### Input & Selection
- **smartInput**: Text input with validation and keyboard handling
- **smartSelect**: Dropdown/picker selection with multiple fallback methods
- **smartToggle**: Checkbox/toggle management with state verification

### Gestures
- **smartSwipe**: Directional swipe on elements
- **smartDrag**: Drag and drop between elements
- **smartScrollTo**: Scroll element into viewport

### Utilities
- **smartGetText**: Text retrieval with retry
- **verifyElementState**: Pre-interaction state validation
- **safeInteraction**: Error-safe interaction wrapper
- **chainInteractions**: Sequential interaction chain

## Usage Examples

### Smart Click

```typescript
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';

// Basic click with auto-retry
await ElementInteractionHelpers.smartClick('~loginButton');

// Click with custom options
await ElementInteractionHelpers.smartClick('~submitButton', {
  timeout: 20000,
  retries: 5,
  scrollIntoView: true,
  waitForClickable: true,
  takeScreenshotOnError: true
});

// Click that scrolls element into view first
await ElementInteractionHelpers.smartClick('~bottomButton', {
  scrollIntoView: true
});
```

### Smart Input

```typescript
// Basic text input
await ElementInteractionHelpers.smartInput('~username', 'testuser@example.com');

// Input with validation
await ElementInteractionHelpers.smartInput('~email', 'test@example.com', {
  clearFirst: true,
  hideKeyboard: true,
  validateInput: true,
  scrollIntoView: true
});

// Input without keyboard hiding (for multi-field forms)
await ElementInteractionHelpers.smartInput('~password', 'secret123', {
  hideKeyboard: false
});
```

### Smart Tap

```typescript
// Tap center of element
await ElementInteractionHelpers.smartTap('~imageView');

// Tap at specific coordinates within element
await ElementInteractionHelpers.smartTap('~canvas', {
  x: 100,
  y: 50,
  duration: 200
});
```

### Smart Swipe

```typescript
// Swipe up on element
await ElementInteractionHelpers.smartSwipe('~scrollView', {
  direction: 'up',
  distance: 300,
  duration: 500
});

// Swipe left on carousel
await ElementInteractionHelpers.smartSwipe('~carousel', {
  direction: 'left'
});

// All directions supported
await ElementInteractionHelpers.smartSwipe('~element', { direction: 'down' });
await ElementInteractionHelpers.smartSwipe('~element', { direction: 'right' });
```

### Long Press

```typescript
// Long press for 2 seconds
await ElementInteractionHelpers.smartLongPress('~menuItem', 2000);

// Long press with timeout
await ElementInteractionHelpers.smartLongPress('~contextMenu', 1500, {
  timeout: 10000
});
```

### Double Tap

```typescript
// Double tap to zoom
await ElementInteractionHelpers.smartDoubleTap('~imageView');
```

### Smart Select

```typescript
// Select from dropdown
await ElementInteractionHelpers.smartSelect('~countrySelector', 'United States');

// Select with retry options
await ElementInteractionHelpers.smartSelect('~citySelector', 'New York', {
  retries: 5,
  timeout: 15000
});
```

### Smart Toggle

```typescript
// Enable checkbox
await ElementInteractionHelpers.smartToggle('~agreeCheckbox', true);

// Disable toggle
await ElementInteractionHelpers.smartToggle('~notificationsToggle', false);

// Toggle with timeout
await ElementInteractionHelpers.smartToggle('~switch', true, {
  timeout: 10000
});
```

### Drag and Drop

```typescript
// Drag element to target
await ElementInteractionHelpers.smartDrag('~sourceItem', '~targetZone');

// Drag with timeout
await ElementInteractionHelpers.smartDrag('~draggable', '~dropZone', {
  timeout: 20000
});
```

### Scroll to Element

```typescript
// Scroll element into view
await ElementInteractionHelpers.smartScrollTo('~bottomElement');

// Scroll with retry
await ElementInteractionHelpers.smartScrollTo('~hiddenSection', {
  retries: 5
});
```

### Get Text

```typescript
// Get text with retry
const username = await ElementInteractionHelpers.smartGetText('~userLabel');

// Get text with custom timeout
const message = await ElementInteractionHelpers.smartGetText('~notification', {
  timeout: 5000,
  retries: 3
});
```

### Verify Element State

```typescript
// Verify element is clickable before interaction
const isReady = await ElementInteractionHelpers.verifyElementState('~button', {
  shouldBeVisible: true,
  shouldBeClickable: true,
  shouldBeEnabled: true,
  timeout: 10000
});

if (isReady) {
  await ElementInteractionHelpers.smartClick('~button');
}
```

### Safe Interaction

```typescript
// Wrap interaction in try-catch
const success = await ElementInteractionHelpers.safeInteraction(
  async () => {
    await ElementInteractionHelpers.smartClick('~optionalButton');
  }
);

if (success) {
  console.log('Button clicked successfully');
} else {
  console.log('Button not available, continuing...');
}

// Safe interaction with fallback
await ElementInteractionHelpers.safeInteraction(
  async () => {
    // Primary action
    await ElementInteractionHelpers.smartClick('~primaryButton');
  },
  async () => {
    // Fallback action
    await ElementInteractionHelpers.smartClick('~alternativeButton');
  }
);
```

### Chain Interactions

```typescript
// Execute multiple interactions sequentially
const success = await ElementInteractionHelpers.chainInteractions(
  async () => await ElementInteractionHelpers.smartClick('~step1'),
  async () => await ElementInteractionHelpers.smartInput('~input', 'value'),
  async () => await ElementInteractionHelpers.smartClick('~submit')
);

if (success) {
  console.log('All interactions completed successfully');
}
```

## Integration with Page Objects

```typescript
import Page from './page';
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';

class LoginPage extends Page {
  private usernameField = '~username';
  private passwordField = '~password';
  private loginButton = '~loginButton';
  private rememberMe = '~rememberMeCheckbox';

  async login(username: string, password: string, remember: boolean = false) {
    // Smart input with validation
    await ElementInteractionHelpers.smartInput(this.usernameField, username, {
      clearFirst: true,
      validateInput: true
    });

    await ElementInteractionHelpers.smartInput(this.passwordField, password, {
      clearFirst: true,
      hideKeyboard: true
    });

    // Toggle checkbox if needed
    if (remember) {
      await ElementInteractionHelpers.smartToggle(this.rememberMe, true);
    }

    // Smart click with scroll and retry
    await ElementInteractionHelpers.smartClick(this.loginButton, {
      scrollIntoView: true,
      retries: 3
    });
  }

  async fillRegistrationForm(data: any) {
    // Chain multiple interactions
    await ElementInteractionHelpers.chainInteractions(
      async () => await ElementInteractionHelpers.smartInput('~firstName', data.firstName),
      async () => await ElementInteractionHelpers.smartInput('~lastName', data.lastName),
      async () => await ElementInteractionHelpers.smartInput('~email', data.email),
      async () => await ElementInteractionHelpers.smartSelect('~country', data.country),
      async () => await ElementInteractionHelpers.smartToggle('~terms', true),
      async () => await ElementInteractionHelpers.smartClick('~submit')
    );
  }
}

export default new LoginPage();
```

## Configuration Options

### InteractionOptions

```typescript
interface InteractionOptions {
  timeout?: number;              // Wait timeout (default: 15000ms)
  retries?: number;              // Number of retry attempts (default: 3)
  retryDelay?: number;           // Delay between retries (default: 1000ms)
  waitForClickable?: boolean;    // Wait for clickable state (default: true)
  scrollIntoView?: boolean;      // Scroll before interaction (default: false)
  takeScreenshotOnError?: boolean; // Capture screenshot on error (default: true)
}
```

### InputOptions

```typescript
interface InputOptions extends InteractionOptions {
  clearFirst?: boolean;          // Clear field before input (default: true)
  hideKeyboard?: boolean;        // Hide keyboard after input (default: true)
  validateInput?: boolean;       // Verify entered value (default: true)
}
```

### SwipeOptions

```typescript
interface SwipeOptions {
  direction: 'up' | 'down' | 'left' | 'right'; // Swipe direction
  distance?: number;             // Swipe distance in pixels
  duration?: number;             // Swipe duration in ms (default: 500)
}
```

### TapOptions

```typescript
interface TapOptions extends InteractionOptions {
  duration?: number;             // Tap duration (default: 100ms)
  x?: number;                    // X coordinate offset
  y?: number;                    // Y coordinate offset
}
```

## Best Practices

### 1. Always Use Smart Methods
```typescript
// ✅ Good - Uses smart click with retry
await ElementInteractionHelpers.smartClick('~button');

// ❌ Avoid - Direct click without error handling
await $('~button').click();
```

### 2. Enable Validation for Critical Inputs
```typescript
// ✅ Good - Validates input
await ElementInteractionHelpers.smartInput('~email', 'user@example.com', {
  validateInput: true
});
```

### 3. Use Scroll for Off-Screen Elements
```typescript
// ✅ Good - Scrolls before clicking
await ElementInteractionHelpers.smartClick('~bottomButton', {
  scrollIntoView: true
});
```

### 4. Verify State Before Critical Interactions
```typescript
// ✅ Good - Verifies element is ready
await ElementInteractionHelpers.verifyElementState('~payButton', {
  shouldBeClickable: true,
  shouldBeEnabled: true
});
await ElementInteractionHelpers.smartClick('~payButton');
```

### 5. Use Safe Interaction for Optional Elements
```typescript
// ✅ Good - Gracefully handles missing elements
await ElementInteractionHelpers.safeInteraction(
  async () => await ElementInteractionHelpers.smartClick('~optionalDialog')
);
```

### 6. Chain Related Interactions
```typescript
// ✅ Good - Chains form filling
await ElementInteractionHelpers.chainInteractions(
  async () => await ElementInteractionHelpers.smartInput('~field1', 'value1'),
  async () => await ElementInteractionHelpers.smartInput('~field2', 'value2'),
  async () => await ElementInteractionHelpers.smartClick('~submit')
);
```

## Error Handling

All smart methods include built-in error handling:
- Automatic retry on failure
- Detailed error logging
- Optional screenshot capture
- State validation before interaction

```typescript
try {
  await ElementInteractionHelpers.smartClick('~button', {
    retries: 5,
    takeScreenshotOnError: true
  });
} catch (error) {
  console.log('All retry attempts failed');
  // Screenshot already captured
}
```

## Performance Tips

1. **Adjust Retry Count**: Use fewer retries for fast operations
2. **Customize Timeouts**: Longer timeouts for slow elements
3. **Disable Validation**: For non-critical inputs to improve speed
4. **Use Safe Interaction**: For optional UI elements
5. **Chain Interactions**: Reduce code and improve readability

## Troubleshooting

### Element Not Clickable
```typescript
// Solution: Enable scroll and increase timeout
await ElementInteractionHelpers.smartClick('~element', {
  scrollIntoView: true,
  timeout: 20000,
  waitForClickable: true
});
```

### Input Validation Fails
```typescript
// Solution: Add delay after input
await ElementInteractionHelpers.smartInput('~field', 'value', {
  validateInput: false  // Disable if field uses delayed updates
});
```

### Gesture Not Working
```typescript
// Solution: Increase duration for slow animations
await ElementInteractionHelpers.smartSwipe('~element', {
  direction: 'up',
  duration: 1000  // Slower swipe
});
```

## Integration with Smart Waits

Element Interaction Helpers work seamlessly with Smart Waits:

```typescript
import SmartWaits from '../utils/SmartWaits';
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';

// Wait for element, then interact
await SmartWaits.waitForElementVisible('~button');
await ElementInteractionHelpers.smartClick('~button');

// Or use built-in waiting in smart methods
await ElementInteractionHelpers.smartClick('~button', {
  timeout: 15000  // Includes wait
});
```

## Additional Resources

- [WebdriverIO Touch Actions](https://webdriver.io/docs/api/browser/touchAction/)
- [Mobile Gestures Guide](https://appium.io/docs/en/commands/interactions/touch/touch-perform/)
- [Smart Waits Documentation](./SMART_WAITS_README.md)
