# Advanced Gestures for Mobile Automation

Comprehensive gesture library for mobile test automation with multi-touch support, pinch/zoom, rotation, and complex gesture chains.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Overview

The `AdvancedGestures` utility provides a complete set of advanced gesture operations for mobile automation, including:
- Multi-touch gestures (pinch, zoom, rotate)
- Precise coordinate-based swipes
- Flick/fling gestures with velocity control
- Edge swipes
- Two-finger tap
- Complex gesture chains
- Circular swipes
- Percentage-based scrolling

## Features

### Multi-Touch Gestures
- **Pinch In/Out**: Zoom in and out on elements
- **Rotate**: Rotate elements with two fingers
- **Two-Finger Tap**: Tap with two fingers simultaneously
- **Custom Multi-Touch**: Define custom multi-touch points

### Precise Control
- **Coordinate-Based Swipes**: Exact control over swipe paths
- **Velocity-Based Flicks**: Fast swipes with configurable velocity
- **Percentage Scrolling**: Scroll by screen percentage
- **Edge Swipes**: Swipe from screen edges

### Complex Gestures
- **Gesture Chains**: Execute multiple gestures in sequence
- **Circular Swipes**: Perform circular motions
- **Drag and Drop**: Smooth drag between elements

## Installation

The utility is already available in your test framework:

```typescript
import AdvancedGestures from '../utils/AdvancedGestures';
```

## API Reference

### Pinch & Zoom

#### `pinch(selector, options)`
Perform pinch gesture on an element.

**Parameters:**
- `selector` (string): Element selector
- `options` (PinchOptions):
  - `scale` (number): Scale factor (< 1 for pinch in, > 1 for pinch out)
  - `duration?` (number): Duration in milliseconds (default: 1000)

```typescript
await AdvancedGestures.pinch('~mapView', { scale: 0.5, duration: 800 });
```

#### `pinchIn(selector, options?)`
Pinch in (zoom out) on an element.

```typescript
await AdvancedGestures.pinchIn('~imageView');
```

#### `pinchOut(selector, options?)`
Pinch out (zoom in) on an element.

```typescript
await AdvancedGestures.pinchOut('~imageView', { duration: 1500 });
```

### Rotation

#### `rotate(selector, options)`
Rotate an element using two fingers.

**Parameters:**
- `selector` (string): Element selector
- `options` (RotateOptions):
  - `rotation` (number): Degrees to rotate (positive for clockwise)
  - `duration?` (number): Duration in milliseconds

```typescript
// Rotate 90 degrees clockwise
await AdvancedGestures.rotate('~imageView', { rotation: 90 });

// Rotate 45 degrees counter-clockwise
await AdvancedGestures.rotate('~imageView', { rotation: -45 });
```

### Coordinate-Based Swipes

#### `swipeWithCoordinates(options)`
Swipe with precise coordinate control.

**Parameters:**
- `options` (SwipeCoordinateOptions):
  - `startX` (number): Starting X coordinate
  - `startY` (number): Starting Y coordinate
  - `endX` (number): Ending X coordinate
  - `endY` (number): Ending Y coordinate
  - `duration?` (number): Swipe duration

```typescript
await AdvancedGestures.swipeWithCoordinates({
  startX: 100,
  startY: 500,
  endX: 300,
  endY: 500,
  duration: 800
});
```

#### `flick(options)`
Perform fast swipe with velocity control.

**Parameters:**
- `options` (FlickOptions):
  - `startX`, `startY`, `endX`, `endY` (number): Coordinates
  - `velocity?` (number): Pixels per second (default: 2000)

```typescript
// Fast flick gesture
await AdvancedGestures.flick({
  startX: 200,
  startY: 800,
  endX: 200,
  endY: 200,
  velocity: 3000
});
```

### Multi-Touch

#### `twoFingerTap(selector, options?)`
Tap with two fingers simultaneously.

```typescript
await AdvancedGestures.twoFingerTap('~textView');
```

#### `multiTouch(touchPoints, duration?)`
Perform custom multi-touch gesture.

**Parameters:**
- `touchPoints` (MultiTouchPoint[]): Array of touch points with x, y coordinates
- `duration?` (number): Gesture duration

```typescript
await AdvancedGestures.multiTouch([
  { x: 100, y: 200 },
  { x: 300, y: 200 },
  { x: 200, y: 400 }
], 1000);
```

### Edge Swipes

#### `edgeSwipe(edge, options?)`
Swipe from screen edge.

**Parameters:**
- `edge` ('left' | 'right' | 'top' | 'bottom'): Screen edge
- `options?` (GestureOptions): Duration and timeout

```typescript
// Swipe from left edge (e.g., open navigation drawer)
await AdvancedGestures.edgeSwipe('left');

// Swipe from right edge
await AdvancedGestures.edgeSwipe('right', { duration: 500 });
```

### Scrolling

#### `scrollByPercentage(direction, percentage?, options?)`
Scroll by screen percentage.

**Parameters:**
- `direction` ('up' | 'down' | 'left' | 'right'): Scroll direction
- `percentage?` (number): Distance as percentage (0-1, default: 0.5)
- `options?` (GestureOptions): Duration and timeout

```typescript
// Scroll down 50% of screen
await AdvancedGestures.scrollByPercentage('down', 0.5);

// Scroll up 30% of screen
await AdvancedGestures.scrollByPercentage('up', 0.3, { duration: 800 });
```

### Complex Gestures

#### `gestureChain(...gestures)`
Execute multiple gestures in sequence.

**Parameters:**
- `gestures` (Array<() => Promise<void>>): Array of gesture functions

```typescript
await AdvancedGestures.gestureChain(
  async () => await AdvancedGestures.pinchOut('~imageView'),
  async () => await AdvancedGestures.rotate('~imageView', { rotation: 90 }),
  async () => await AdvancedGestures.pinchIn('~imageView')
);
```

#### `dragAndDrop(sourceSelector, targetSelector, options?)`
Drag element from source to target with smooth animation.

```typescript
await AdvancedGestures.dragAndDrop('~dragItem', '~dropZone', { duration: 1200 });
```

#### `circularSwipe(selector, clockwise?, options?)`
Perform circular swipe gesture.

**Parameters:**
- `selector` (string): Element selector
- `clockwise?` (boolean): Direction (default: true)
- `options?` (GestureOptions): Duration and timeout

```typescript
// Clockwise circular swipe
await AdvancedGestures.circularSwipe('~dialControl', true);

// Counter-clockwise
await AdvancedGestures.circularSwipe('~dialControl', false, { duration: 1500 });
```

### Utility

#### `releaseActions()`
Release all touch actions (cleanup).

```typescript
await AdvancedGestures.releaseActions();
```

## Usage Examples

### Example 1: Zoom In/Out on Map
```typescript
import AdvancedGestures from '../utils/AdvancedGestures';

describe('Map Zoom', () => {
  it('should zoom in and out on map', async () => {
    const mapView = '~mapView';
    
    // Zoom in (pinch out)
    await AdvancedGestures.pinchOut(mapView, { scale: 2.5 });
    await browser.pause(1000);
    
    // Zoom out (pinch in)
    await AdvancedGestures.pinchIn(mapView, { scale: 0.3 });
  });
});
```

### Example 2: Rotate Image
```typescript
describe('Image Rotation', () => {
  it('should rotate image 90 degrees', async () => {
    await AdvancedGestures.rotate('~photoView', {
      rotation: 90,
      duration: 1000
    });
  });
});
```

### Example 3: Edge Swipe Navigation
```typescript
describe('Navigation', () => {
  it('should open side menu with edge swipe', async () => {
    // Swipe from left edge to open menu
    await AdvancedGestures.edgeSwipe('left');
    
    // Verify menu is visible
    const menu = await $('~sideMenu');
    await expect(menu).toBeDisplayed();
  });
});
```

### Example 4: Complex Gesture Chain
```typescript
describe('Photo Editor', () => {
  it('should perform multiple gestures on photo', async () => {
    const photo = '~photoEditor';
    
    await AdvancedGestures.gestureChain(
      // Zoom in
      async () => await AdvancedGestures.pinchOut(photo, { scale: 2 }),
      // Rotate 45 degrees
      async () => await AdvancedGestures.rotate(photo, { rotation: 45 }),
      // Zoom out
      async () => await AdvancedGestures.pinchIn(photo, { scale: 0.5 })
    );
  });
});
```

### Example 5: Flick to Dismiss
```typescript
describe('Dismiss Card', () => {
  it('should flick card to dismiss', async () => {
    const windowSize = await browser.getWindowSize();
    
    await AdvancedGestures.flick({
      startX: windowSize.width / 2,
      startY: windowSize.height / 2,
      endX: windowSize.width / 2,
      endY: 0,
      velocity: 3000
    });
  });
});
```

### Example 6: Two-Finger Tap
```typescript
describe('Context Menu', () => {
  it('should open context menu with two-finger tap', async () => {
    await AdvancedGestures.twoFingerTap('~textContent');
    
    const contextMenu = await $('~contextMenu');
    await expect(contextMenu).toBeDisplayed();
  });
});
```

### Example 7: Percentage-Based Scrolling
```typescript
describe('Scrolling', () => {
  it('should scroll down 75% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('down', 0.75);
  });
  
  it('should scroll left 50% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('left', 0.5);
  });
});
```

### Example 8: Circular Gesture for Dial Control
```typescript
describe('Dial Control', () => {
  it('should adjust volume with circular swipe', async () => {
    // Turn dial clockwise
    await AdvancedGestures.circularSwipe('~volumeDial', true);
    
    // Turn dial counter-clockwise
    await AdvancedGestures.circularSwipe('~volumeDial', false);
  });
});
```

### Example 9: Custom Multi-Touch
```typescript
describe('Multi-Touch', () => {
  it('should perform three-finger gesture', async () => {
    await AdvancedGestures.multiTouch([
      { x: 100, y: 300 },
      { x: 300, y: 300 },
      { x: 200, y: 500 }
    ], 1000);
  });
});
```

### Example 10: Drag and Drop
```typescript
describe('Drag and Drop', () => {
  it('should drag item to target zone', async () => {
    await AdvancedGestures.dragAndDrop(
      '~draggableItem',
      '~dropZone',
      { duration: 1500 }
    );
  });
});
```

## Best Practices

### 1. Use Appropriate Durations
- Short duration (300-500ms): Quick, snappy gestures
- Medium duration (800-1200ms): Normal, natural gestures
- Long duration (1500-2000ms): Slow, deliberate gestures

```typescript
// Quick pinch
await AdvancedGestures.pinchOut('~image', { duration: 500 });

// Smooth rotation
await AdvancedGestures.rotate('~image', { rotation: 90, duration: 1200 });
```

### 2. Add Pauses Between Gestures
Allow UI to settle between complex gestures:

```typescript
await AdvancedGestures.pinchOut('~map');
await browser.pause(500); // Let zoom settle
await AdvancedGestures.scrollByPercentage('down', 0.3);
```

### 3. Clean Up After Gestures
Release actions after complex multi-touch sequences:

```typescript
try {
  await AdvancedGestures.multiTouch([...]);
} finally {
  await AdvancedGestures.releaseActions();
}
```

### 4. Handle Platform Differences
Some gestures may behave differently on Android vs iOS:

```typescript
import PlatformDetection from '../utils/PlatformDetection';

if (PlatformDetection.isIOS()) {
  // iOS may need different duration
  await AdvancedGestures.pinchOut('~image', { duration: 1500 });
} else {
  await AdvancedGestures.pinchOut('~image', { duration: 1000 });
}
```

### 5. Use Gesture Chains for Complex Interactions
Combine multiple gestures for complex test scenarios:

```typescript
await AdvancedGestures.gestureChain(
  async () => await AdvancedGestures.edgeSwipe('left'),
  async () => await AdvancedGestures.scrollByPercentage('down', 0.5),
  async () => await AdvancedGestures.pinchOut('~content')
);
```

### 6. Adjust Velocity for Natural Feel
Match gesture velocity to expected user behavior:

```typescript
// Slow, careful swipe
await AdvancedGestures.flick({
  startX: 100, startY: 500,
  endX: 300, endY: 500,
  velocity: 1000 // Slow
});

// Fast flick to dismiss
await AdvancedGestures.flick({
  startX: 100, startY: 500,
  endX: 300, endY: 500,
  velocity: 4000 // Fast
});
```

### 7. Test with Different Scale Factors
Try various scale factors to ensure robust zooming:

```typescript
// Test zoom in at different levels
await AdvancedGestures.pinchOut('~map', { scale: 1.5 });
await AdvancedGestures.pinchOut('~map', { scale: 2.0 });
await AdvancedGestures.pinchOut('~map', { scale: 3.0 });
```

### 8. Combine with Smart Waits
Wait for elements before performing gestures:

```typescript
import SmartWaits from '../utils/SmartWaits';

await SmartWaits.waitForElementVisible('~imageView');
await AdvancedGestures.pinchOut('~imageView');
```

### 9. Error Handling
Wrap gestures in try-catch for robust tests:

```typescript
try {
  await AdvancedGestures.rotate('~image', { rotation: 90 });
} catch (error) {
  console.error('Rotation failed:', error);
  await browser.saveScreenshot('./error-rotation.png');
  throw error;
}
```

### 10. Document Complex Gesture Sequences
Add clear comments for multi-step gestures:

```typescript
// Simulate user adjusting photo:
// 1. Zoom in to see details
await AdvancedGestures.pinchOut('~photo', { scale: 2 });
// 2. Rotate to correct orientation
await AdvancedGestures.rotate('~photo', { rotation: 90 });
// 3. Zoom out to see full image
await AdvancedGestures.pinchIn('~photo', { scale: 0.7 });
```

## Troubleshooting

### Gesture Not Working
- Ensure element is visible and interactable
- Check if element size is sufficient for gesture
- Verify coordinates are within screen bounds
- Try adjusting duration or velocity

### Inconsistent Behavior
- Add pauses between gestures
- Release actions between complex sequences
- Check platform-specific behavior
- Verify element state before gesture

### Performance Issues
- Reduce gesture duration for faster execution
- Use fewer points in multi-touch gestures
- Clean up actions after use
- Avoid unnecessary pauses

## Advanced Tips

### Custom Gesture Patterns
Create reusable gesture patterns:

```typescript
async function zoomAndInspect(selector: string) {
  await AdvancedGestures.pinchOut(selector, { scale: 2.5 });
  await browser.pause(1000);
  await AdvancedGestures.scrollByPercentage('down', 0.3);
  await AdvancedGestures.pinchIn(selector, { scale: 0.5 });
}
```

### Platform-Specific Gestures
Adapt gestures based on platform:

```typescript
async function platformAwareSwipe() {
  const duration = PlatformDetection.getPlatformValue({
    android: 800,
    ios: 1200
  });
  
  await AdvancedGestures.scrollByPercentage('down', 0.5, { duration });
}
```

### Gesture Recording
Record and replay gesture sequences:

```typescript
const gestureSequence = [
  () => AdvancedGestures.pinchOut('~image'),
  () => AdvancedGestures.rotate('~image', { rotation: 45 }),
  () => AdvancedGestures.pinchIn('~image')
];

await AdvancedGestures.gestureChain(...gestureSequence);
```

## Related Utilities

- **SmartWaits**: Wait for elements before gestures
- **ElementInteractionHelpers**: Basic interaction methods
- **PlatformDetection**: Platform-specific handling

## Support

For issues or questions, refer to the main project documentation or open an issue in the repository.
