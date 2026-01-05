import AdvancedGestures from '../utils/AdvancedGestures';
import { browser } from '@wdio/globals';

describe('Advanced Gestures Examples', () => {
  /**
   * Example 1: Pinch In (Zoom Out)
   */
  it('should pinch in on an element', async () => {
    const imageView = '~imageView';
    
    await AdvancedGestures.pinchIn(imageView, {
      duration: 1000
    });
    
    console.log('✓ Pinch in gesture completed');
  });

  /**
   * Example 2: Pinch Out (Zoom In)
   */
  it('should pinch out on an element', async () => {
    const mapView = '~mapView';
    
    await AdvancedGestures.pinchOut(mapView, {
      scale: 2.5,
      duration: 1200
    });
    
    console.log('✓ Pinch out gesture completed');
  });

  /**
   * Example 3: Custom Pinch with Scale
   */
  it('should perform custom pinch with specific scale', async () => {
    const photoView = '~photoView';
    
    // Zoom in significantly
    await AdvancedGestures.pinch(photoView, {
      scale: 3.0,
      duration: 1500
    });
    
    await browser.pause(1000);
    
    // Zoom back out
    await AdvancedGestures.pinch(photoView, {
      scale: 0.3,
      duration: 1000
    });
  });

  /**
   * Example 4: Rotate Clockwise
   */
  it('should rotate element clockwise', async () => {
    const imageView = '~imageView';
    
    await AdvancedGestures.rotate(imageView, {
      rotation: 90,
      duration: 1000
    });
    
    console.log('✓ Rotated 90 degrees clockwise');
  });

  /**
   * Example 5: Rotate Counter-Clockwise
   */
  it('should rotate element counter-clockwise', async () => {
    const imageView = '~imageView';
    
    await AdvancedGestures.rotate(imageView, {
      rotation: -45,
      duration: 800
    });
    
    console.log('✓ Rotated 45 degrees counter-clockwise');
  });

  /**
   * Example 6: Swipe with Coordinates
   */
  it('should swipe with precise coordinates', async () => {
    await AdvancedGestures.swipeWithCoordinates({
      startX: 100,
      startY: 500,
      endX: 300,
      endY: 500,
      duration: 800
    });
    
    console.log('✓ Swipe with coordinates completed');
  });

  /**
   * Example 7: Flick Gesture with Velocity
   */
  it('should perform flick gesture', async () => {
    const windowSize = await browser.getWindowSize();
    
    await AdvancedGestures.flick({
      startX: windowSize.width / 2,
      startY: windowSize.height * 0.8,
      endX: windowSize.width / 2,
      endY: windowSize.height * 0.2,
      velocity: 3000
    });
    
    console.log('✓ Flick gesture completed');
  });

  /**
   * Example 8: Two-Finger Tap
   */
  it('should perform two-finger tap', async () => {
    const textView = '~textView';
    
    await AdvancedGestures.twoFingerTap(textView, {
      duration: 100
    });
    
    console.log('✓ Two-finger tap completed');
  });

  /**
   * Example 9: Multi-Touch with Three Fingers
   */
  it('should perform three-finger multi-touch', async () => {
    await AdvancedGestures.multiTouch([
      { x: 100, y: 300 },
      { x: 300, y: 300 },
      { x: 200, y: 500 }
    ], 1000);
    
    console.log('✓ Three-finger multi-touch completed');
  });

  /**
   * Example 10: Edge Swipe from Left
   */
  it('should swipe from left edge', async () => {
    await AdvancedGestures.edgeSwipe('left', {
      duration: 500
    });
    
    console.log('✓ Left edge swipe completed');
  });

  /**
   * Example 11: Edge Swipe from Right
   */
  it('should swipe from right edge', async () => {
    await AdvancedGestures.edgeSwipe('right', {
      duration: 500
    });
    
    console.log('✓ Right edge swipe completed');
  });

  /**
   * Example 12: Edge Swipe from Top
   */
  it('should swipe from top edge', async () => {
    await AdvancedGestures.edgeSwipe('top', {
      duration: 600
    });
    
    console.log('✓ Top edge swipe completed');
  });

  /**
   * Example 13: Edge Swipe from Bottom
   */
  it('should swipe from bottom edge', async () => {
    await AdvancedGestures.edgeSwipe('bottom', {
      duration: 600
    });
    
    console.log('✓ Bottom edge swipe completed');
  });

  /**
   * Example 14: Scroll Down by Percentage
   */
  it('should scroll down 50% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('down', 0.5, {
      duration: 1000
    });
    
    console.log('✓ Scrolled down 50%');
  });

  /**
   * Example 15: Scroll Up by Percentage
   */
  it('should scroll up 30% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('up', 0.3, {
      duration: 800
    });
    
    console.log('✓ Scrolled up 30%');
  });

  /**
   * Example 16: Scroll Left by Percentage
   */
  it('should scroll left 40% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('left', 0.4, {
      duration: 900
    });
    
    console.log('✓ Scrolled left 40%');
  });

  /**
   * Example 17: Scroll Right by Percentage
   */
  it('should scroll right 60% of screen', async () => {
    await AdvancedGestures.scrollByPercentage('right', 0.6, {
      duration: 1000
    });
    
    console.log('✓ Scrolled right 60%');
  });

  /**
   * Example 18: Drag and Drop
   */
  it('should drag element to target', async () => {
    const draggable = '~draggableItem';
    const dropZone = '~dropZone';
    
    await AdvancedGestures.dragAndDrop(draggable, dropZone, {
      duration: 1200
    });
    
    console.log('✓ Drag and drop completed');
  });

  /**
   * Example 19: Circular Swipe Clockwise
   */
  it('should perform clockwise circular swipe', async () => {
    const dialControl = '~dialControl';
    
    await AdvancedGestures.circularSwipe(dialControl, true, {
      duration: 1500
    });
    
    console.log('✓ Clockwise circular swipe completed');
  });

  /**
   * Example 20: Circular Swipe Counter-Clockwise
   */
  it('should perform counter-clockwise circular swipe', async () => {
    const dialControl = '~dialControl';
    
    await AdvancedGestures.circularSwipe(dialControl, false, {
      duration: 1500
    });
    
    console.log('✓ Counter-clockwise circular swipe completed');
  });

  /**
   * Example 21: Gesture Chain - Zoom and Rotate
   */
  it('should perform gesture chain with zoom and rotate', async () => {
    const imageView = '~imageView';
    
    await AdvancedGestures.gestureChain(
      async () => await AdvancedGestures.pinchOut(imageView, { scale: 2 }),
      async () => await AdvancedGestures.rotate(imageView, { rotation: 90 }),
      async () => await AdvancedGestures.pinchIn(imageView, { scale: 0.5 })
    );
    
    console.log('✓ Gesture chain completed');
  });

  /**
   * Example 22: Gesture Chain - Edge Swipe and Scroll
   */
  it('should perform gesture chain with edge swipe and scroll', async () => {
    await AdvancedGestures.gestureChain(
      async () => await AdvancedGestures.edgeSwipe('left'),
      async () => await AdvancedGestures.scrollByPercentage('down', 0.5),
      async () => await AdvancedGestures.edgeSwipe('right')
    );
    
    console.log('✓ Edge swipe and scroll chain completed');
  });

  /**
   * Example 23: Complex Multi-Touch Pattern
   */
  it('should perform complex multi-touch pattern', async () => {
    // Simulate a 4-finger gesture
    await AdvancedGestures.multiTouch([
      { x: 100, y: 200 },
      { x: 300, y: 200 },
      { x: 100, y: 600 },
      { x: 300, y: 600 }
    ], 1200);
    
    console.log('✓ Complex multi-touch pattern completed');
  });

  /**
   * Example 24: Release Actions (Cleanup)
   */
  it('should release all touch actions', async () => {
    // Perform some gestures
    await AdvancedGestures.twoFingerTap('~element');
    
    // Clean up
    await AdvancedGestures.releaseActions();
    
    console.log('✓ Touch actions released');
  });

  /**
   * Example 25: Combined Gesture Scenario - Photo Editor
   */
  it('should simulate photo editing workflow', async () => {
    const photo = '~photoEditor';
    
    // Zoom in to see details
    await AdvancedGestures.pinchOut(photo, { scale: 2.5 });
    await browser.pause(500);
    
    // Rotate to correct orientation
    await AdvancedGestures.rotate(photo, { rotation: 90 });
    await browser.pause(500);
    
    // Adjust position with swipe
    await AdvancedGestures.scrollByPercentage('left', 0.2);
    await browser.pause(500);
    
    // Zoom out to see full image
    await AdvancedGestures.pinchIn(photo, { scale: 0.4 });
    
    console.log('✓ Photo editing workflow completed');
  });

  /**
   * Example 26: Map Navigation Scenario
   */
  it('should simulate map navigation', async () => {
    const map = '~mapView';
    
    // Zoom in on location
    await AdvancedGestures.pinchOut(map, { scale: 3.0 });
    await browser.pause(500);
    
    // Pan to different area
    await AdvancedGestures.swipeWithCoordinates({
      startX: 200,
      startY: 400,
      endX: 100,
      endY: 300,
      duration: 800
    });
    await browser.pause(500);
    
    // Zoom back out
    await AdvancedGestures.pinchIn(map, { scale: 0.3 });
    
    console.log('✓ Map navigation completed');
  });

  /**
   * Example 27: Swipe to Dismiss Card
   */
  it('should swipe card to dismiss', async () => {
    const windowSize = await browser.getWindowSize();
    
    // Fast upward flick to dismiss
    await AdvancedGestures.flick({
      startX: windowSize.width / 2,
      startY: windowSize.height / 2,
      endX: windowSize.width / 2,
      endY: 50,
      velocity: 3500
    });
    
    console.log('✓ Card dismissed with flick');
  });

  /**
   * Example 28: Volume Control with Circular Swipe
   */
  it('should adjust volume with circular swipe', async () => {
    const volumeDial = '~volumeControl';
    
    // Increase volume (clockwise)
    await AdvancedGestures.circularSwipe(volumeDial, true, { duration: 1000 });
    await browser.pause(500);
    
    // Decrease volume (counter-clockwise)
    await AdvancedGestures.circularSwipe(volumeDial, false, { duration: 1000 });
    
    console.log('✓ Volume adjusted with circular swipe');
  });
});
