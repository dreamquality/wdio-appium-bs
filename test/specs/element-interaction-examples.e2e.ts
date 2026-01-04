import { expect } from '@wdio/globals';
import ElementInteractionHelpers from '../utils/ElementInteractionHelpers';

/**
 * Example tests demonstrating Element Interaction Helpers functionality
 * These examples show how to use various interaction methods in your tests
 */

describe('Element Interaction Helpers Examples', () => {

  it('Example 1: Smart Click', async () => {
    // Basic smart click with auto-retry
    await ElementInteractionHelpers.smartClick('~loginButton');

    // Click with scroll into view
    await ElementInteractionHelpers.smartClick('~submitButton', {
      scrollIntoView: true,
      retries: 5
    });

    // Click with custom timeout and screenshot on error
    await ElementInteractionHelpers.smartClick('~confirmButton', {
      timeout: 20000,
      takeScreenshotOnError: true
    });
  });

  it('Example 2: Smart Input', async () => {
    // Basic text input
    await ElementInteractionHelpers.smartInput('~username', 'testuser');

    // Input with validation
    await ElementInteractionHelpers.smartInput('~email', 'test@example.com', {
      clearFirst: true,
      validateInput: true,
      hideKeyboard: true
    });

    // Input without clearing (append)
    await ElementInteractionHelpers.smartInput('~notes', ' - additional text', {
      clearFirst: false
    });
  });

  it('Example 3: Smart Tap', async () => {
    // Tap center of element
    await ElementInteractionHelpers.smartTap('~imageView');

    // Tap at specific coordinates
    await ElementInteractionHelpers.smartTap('~canvas', {
      x: 100,
      y: 50,
      duration: 200
    });
  });

  it('Example 4: Gestures - Swipe', async () => {
    // Swipe up
    await ElementInteractionHelpers.smartSwipe('~scrollView', {
      direction: 'up',
      distance: 300
    });

    // Swipe left (carousel)
    await ElementInteractionHelpers.smartSwipe('~carousel', {
      direction: 'left',
      duration: 500
    });

    // Swipe down
    await ElementInteractionHelpers.smartSwipe('~refreshable', {
      direction: 'down'
    });

    // Swipe right
    await ElementInteractionHelpers.smartSwipe('~slider', {
      direction: 'right'
    });
  });

  it('Example 5: Long Press', async () => {
    // Long press for 1.5 seconds
    await ElementInteractionHelpers.smartLongPress('~listItem', 1500);

    // Long press with timeout
    await ElementInteractionHelpers.smartLongPress('~contextMenuTrigger', 2000, {
      timeout: 15000
    });
  });

  it('Example 6: Double Tap', async () => {
    // Double tap to zoom
    await ElementInteractionHelpers.smartDoubleTap('~imageView');

    // Double tap with timeout
    await ElementInteractionHelpers.smartDoubleTap('~zoomableContent', {
      timeout: 10000
    });
  });

  it('Example 7: Smart Select', async () => {
    // Select from dropdown
    await ElementInteractionHelpers.smartSelect('~countrySelector', 'United States');

    // Select with retries
    await ElementInteractionHelpers.smartSelect('~citySelector', 'New York', {
      retries: 5,
      timeout: 15000
    });
  });

  it('Example 8: Smart Toggle', async () => {
    // Enable checkbox
    await ElementInteractionHelpers.smartToggle('~agreeToTerms', true);

    // Disable toggle
    await ElementInteractionHelpers.smartToggle('~notifications', false);

    // Toggle switch
    await ElementInteractionHelpers.smartToggle('~darkMode', true, {
      timeout: 5000
    });
  });

  it('Example 9: Drag and Drop', async () => {
    // Drag item to target zone
    await ElementInteractionHelpers.smartDrag('~draggableItem', '~dropZone');

    // Drag with timeout
    await ElementInteractionHelpers.smartDrag('~source', '~target', {
      timeout: 20000
    });
  });

  it('Example 10: Scroll to Element', async () => {
    // Scroll element into viewport
    await ElementInteractionHelpers.smartScrollTo('~bottomSection');

    // Scroll with retries
    await ElementInteractionHelpers.smartScrollTo('~hiddenElement', {
      retries: 5,
      timeout: 15000
    });
  });

  it('Example 11: Get Text', async () => {
    // Get text with retry
    const username = await ElementInteractionHelpers.smartGetText('~userLabel');
    expect(username).toBeTruthy();

    // Get text with custom options
    const message = await ElementInteractionHelpers.smartGetText('~notificationText', {
      timeout: 10000,
      retries: 3
    });
    console.log(`Message: ${message}`);
  });

  it('Example 12: Verify Element State', async () => {
    // Verify element is ready for interaction
    const isReady = await ElementInteractionHelpers.verifyElementState('~submitButton', {
      shouldBeVisible: true,
      shouldBeClickable: true,
      shouldBeEnabled: true,
      timeout: 15000
    });

    expect(isReady).toBe(true);

    if (isReady) {
      await ElementInteractionHelpers.smartClick('~submitButton');
    }
  });

  it('Example 13: Safe Interaction', async () => {
    // Safe interaction with optional element
    const success = await ElementInteractionHelpers.safeInteraction(
      async () => {
        await ElementInteractionHelpers.smartClick('~optionalDialog');
      }
    );

    console.log(`Optional interaction ${success ? 'succeeded' : 'skipped'}`);

    // Safe interaction with fallback
    await ElementInteractionHelpers.safeInteraction(
      async () => {
        // Try primary action
        await ElementInteractionHelpers.smartClick('~primaryButton');
      },
      async () => {
        // Fallback action
        await ElementInteractionHelpers.smartClick('~alternativeButton');
      }
    );
  });

  it('Example 14: Chain Interactions', async () => {
    // Chain form filling
    const success = await ElementInteractionHelpers.chainInteractions(
      async () => await ElementInteractionHelpers.smartInput('~firstName', 'John'),
      async () => await ElementInteractionHelpers.smartInput('~lastName', 'Doe'),
      async () => await ElementInteractionHelpers.smartInput('~email', 'john@example.com'),
      async () => await ElementInteractionHelpers.smartToggle('~subscribe', true),
      async () => await ElementInteractionHelpers.smartClick('~submit')
    );

    expect(success).toBe(true);
  });

  it('Example 15: Complex Login Flow', async () => {
    // Complete login flow with smart methods
    await ElementInteractionHelpers.smartScrollTo('~loginForm');

    await ElementInteractionHelpers.smartInput('~username', 'testuser@example.com', {
      clearFirst: true,
      validateInput: true
    });

    await ElementInteractionHelpers.smartInput('~password', 'SecurePass123!', {
      clearFirst: true,
      hideKeyboard: true
    });

    await ElementInteractionHelpers.smartToggle('~rememberMe', true);

    await ElementInteractionHelpers.smartClick('~loginButton', {
      scrollIntoView: true,
      retries: 3
    });
  });

  it('Example 16: Form with Dropdown', async () => {
    // Fill registration form
    await ElementInteractionHelpers.chainInteractions(
      async () => await ElementInteractionHelpers.smartInput('~name', 'Jane Smith'),
      async () => await ElementInteractionHelpers.smartSelect('~country', 'Canada'),
      async () => await ElementInteractionHelpers.smartSelect('~state', 'Ontario'),
      async () => await ElementInteractionHelpers.smartInput('~city', 'Toronto'),
      async () => await ElementInteractionHelpers.smartToggle('~terms', true),
      async () => await ElementInteractionHelpers.smartClick('~register')
    );
  });

  it('Example 17: Carousel Navigation', async () => {
    // Navigate through carousel
    for (let i = 0; i < 3; i++) {
      await ElementInteractionHelpers.smartSwipe('~carousel', {
        direction: 'left',
        duration: 500
      });
      await browser.pause(1000); // Wait for animation
    }

    // Swipe back
    await ElementInteractionHelpers.smartSwipe('~carousel', {
      direction: 'right'
    });
  });

  it('Example 18: Context Menu', async () => {
    // Open context menu with long press
    await ElementInteractionHelpers.smartLongPress('~listItem', 1500);

    // Select option from context menu
    await ElementInteractionHelpers.smartClick('~deleteOption');

    // Confirm deletion
    await ElementInteractionHelpers.smartClick('~confirmButton');
  });

  it('Example 19: Multi-step Wizard', async () => {
    // Step 1
    await ElementInteractionHelpers.smartInput('~step1Input', 'Step 1 data');
    await ElementInteractionHelpers.smartClick('~nextButton');

    // Step 2
    await ElementInteractionHelpers.smartSelect('~step2Select', 'Option A');
    await ElementInteractionHelpers.smartClick('~nextButton');

    // Step 3
    await ElementInteractionHelpers.smartToggle('~step3Toggle', true);
    await ElementInteractionHelpers.smartClick('~finishButton');
  });

  it('Example 20: Error Recovery', async () => {
    // Attempt interaction with fallback
    const loginSuccess = await ElementInteractionHelpers.safeInteraction(
      async () => {
        // Try quick login
        await ElementInteractionHelpers.smartClick('~quickLoginButton');
      },
      async () => {
        // Fallback to manual login
        await ElementInteractionHelpers.smartInput('~username', 'user');
        await ElementInteractionHelpers.smartInput('~password', 'pass');
        await ElementInteractionHelpers.smartClick('~loginButton');
      }
    );

    expect(loginSuccess).toBe(true);
  });

  it('Example 21: Conditional Interactions', async () => {
    // Verify and interact only if element is ready
    const canProceed = await ElementInteractionHelpers.verifyElementState('~continueButton', {
      shouldBeVisible: true,
      shouldBeClickable: true
    });

    if (canProceed) {
      await ElementInteractionHelpers.smartClick('~continueButton');
    } else {
      // Alternative path
      await ElementInteractionHelpers.smartClick('~backButton');
    }
  });

  it('Example 22: Dynamic Content Interaction', async () => {
    // Wait and interact with dynamically loaded content
    await ElementInteractionHelpers.smartScrollTo('~dynamicSection', {
      retries: 5
    });

    const text = await ElementInteractionHelpers.smartGetText('~dynamicContent', {
      timeout: 20000,
      retries: 5
    });

    console.log(`Dynamic content loaded: ${text}`);
    expect(text).toBeTruthy();
  });

  it('Example 23: Drag to Reorder', async () => {
    // Drag list item to reorder
    await ElementInteractionHelpers.smartDrag('~listItem1', '~listItem3');

    // Verify order changed
    const firstItemText = await ElementInteractionHelpers.smartGetText('~listItem1');
    console.log(`New first item: ${firstItemText}`);
  });

  it('Example 24: Image Zoom', async () => {
    // Double tap to zoom
    await ElementInteractionHelpers.smartDoubleTap('~photoView');

    // Wait for zoom animation
    await browser.pause(1000);

    // Double tap again to zoom out
    await ElementInteractionHelpers.smartDoubleTap('~photoView');
  });
});
