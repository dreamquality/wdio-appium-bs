import { browser } from '@wdio/globals'

/**
 * Advanced Gestures for Mobile Automation
 * Provides comprehensive gesture support including multi-touch, pinch/zoom, and complex gesture chains
 */

export interface GestureOptions {
  duration?: number;
}

export interface SwipeCoordinateOptions extends GestureOptions {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface PinchOptions extends GestureOptions {
  scale: number; // < 1 for pinch in, > 1 for pinch out
}

export interface RotateOptions extends GestureOptions {
  rotation: number; // degrees, positive for clockwise
}

export interface MultiTouchPoint {
  x: number;
  y: number;
}

export interface FlickOptions {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  velocity?: number; // pixels per second
}

export class AdvancedGestures {
  private static readonly DEFAULT_DURATION = 1000;
  private static readonly DEFAULT_VELOCITY = 2000;
  private static readonly EDGE_MARGIN = 10;
  private static readonly EDGE_SWIPE_LENGTH = 200;
  private static readonly TWO_FINGER_TAP_OFFSET = 50;
  private static readonly CIRCULAR_SWIPE_STEPS = 8;

  /**
   * Perform pinch gesture on an element (pinch in to zoom out, pinch out to zoom in)
   * @param selector Element selector
   * @param options Pinch options with scale (< 1 for pinch in, > 1 for zoom)
   */
  static async pinch(
    selector: string,
    options: PinchOptions
  ): Promise<void> {
    try {
      const element = await $(selector);
      const { scale, duration = this.DEFAULT_DURATION } = options;

      // Get element location and size
      const location = await element.getLocation();
      const size = await element.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      // Calculate pinch points based on scale
      const distance = Math.min(size.width, size.height) / 2;
      const startDistance = scale < 1 ? distance : distance / 2;
      const endDistance = scale < 1 ? distance / 2 : distance * scale;

      // Perform pinch gesture using W3C Actions API
      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: centerX - startDistance, y: centerY },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerMove', duration, x: centerX - endDistance, y: centerY },
            { type: 'pointerUp', button: 0 }
          ]
        },
        {
          type: 'pointer',
          id: 'finger2',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: centerX + startDistance, y: centerY },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerMove', duration, x: centerX + endDistance, y: centerY },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);

      await browser.pause(300);
      console.log(`✓ Pinch gesture performed on ${selector} with scale ${scale}`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Pinch gesture failed on ${selector}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Pinch in (zoom out) on an element
   */
  static async pinchIn(
    selector: string,
    options: Partial<PinchOptions> = {}
  ): Promise<void> {
    await this.pinch(selector, { scale: 0.5, ...options });
  }

  /**
   * Pinch out (zoom in) on an element
   */
  static async pinchOut(
    selector: string,
    options: Partial<PinchOptions> = {}
  ): Promise<void> {
    await this.pinch(selector, { scale: 2.0, ...options });
  }

  /**
   * Perform rotation gesture on an element
   * @param selector Element selector
   * @param options Rotation options with degrees (positive for clockwise)
   */
  static async rotate(
    selector: string,
    options: RotateOptions
  ): Promise<void> {
    try {
      const element = await $(selector);
      const { rotation, duration = this.DEFAULT_DURATION } = options;

      // Get element center
      const location = await element.getLocation();
      const size = await element.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      // Calculate rotation points
      const radius = Math.min(size.width, size.height) / 3;
      const angleRad = (rotation * Math.PI) / 180;

      const startX1 = centerX + radius;
      const startY1 = centerY;
      const endX1 = centerX + radius * Math.cos(angleRad);
      const endY1 = centerY + radius * Math.sin(angleRad);

      const startX2 = centerX - radius;
      const startY2 = centerY;
      const endX2 = centerX - radius * Math.cos(angleRad);
      const endY2 = centerY - radius * Math.sin(angleRad);

      // Perform rotation using two fingers
      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(startX1), y: Math.round(startY1) },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerMove', duration, x: Math.round(endX1), y: Math.round(endY1) },
            { type: 'pointerUp', button: 0 }
          ]
        },
        {
          type: 'pointer',
          id: 'finger2',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(startX2), y: Math.round(startY2) },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerMove', duration, x: Math.round(endX2), y: Math.round(endY2) },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);

      await browser.pause(300);
      console.log(`✓ Rotation gesture performed on ${selector} by ${rotation} degrees`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Rotation gesture failed on ${selector}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Swipe with precise coordinate control
   */
  static async swipeWithCoordinates(
    options: SwipeCoordinateOptions
  ): Promise<void> {
    try {
      const { startX, startY, endX, endY, duration = this.DEFAULT_DURATION } = options;

      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(startX), y: Math.round(startY) },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerMove', duration, x: Math.round(endX), y: Math.round(endY) },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);

      await browser.pause(300);
      console.log(`✓ Swipe performed from (${startX}, ${startY}) to (${endX}, ${endY})`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Swipe with coordinates failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform flick gesture (fast swipe with velocity)
   */
  static async flick(options: FlickOptions): Promise<void> {
    try {
      const { startX, startY, endX, endY, velocity = this.DEFAULT_VELOCITY } = options;

      // Calculate duration based on velocity and distance
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const duration = Math.round((distance / velocity) * 1000);

      await this.swipeWithCoordinates({
        startX,
        startY,
        endX,
        endY,
        duration: Math.max(duration, 100) // Minimum 100ms for flick
      });

      console.log(`✓ Flick gesture performed with velocity ${velocity}px/s`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Flick gesture failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform two-finger tap
   */
  static async twoFingerTap(
    selector: string,
    options: GestureOptions = {}
  ): Promise<void> {
    try {
      const element = await $(selector);
      const { duration = 100 } = options;

      // Get element center and offset points
      const location = await element.getLocation();
      const size = await element.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: centerX - this.TWO_FINGER_TAP_OFFSET, y: centerY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration },
            { type: 'pointerUp', button: 0 }
          ]
        },
        {
          type: 'pointer',
          id: 'finger2',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: centerX + this.TWO_FINGER_TAP_OFFSET, y: centerY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);

      await browser.pause(300);
      console.log(`✓ Two-finger tap performed on ${selector}`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Two-finger tap failed on ${selector}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform multi-touch gesture with custom points
   * @param touchPoints Array of touch points (minimum 2 required), each with x and y coordinates
   * @param duration Gesture duration in milliseconds
   */
  static async multiTouch(
    touchPoints: MultiTouchPoint[],
    duration: number = this.DEFAULT_DURATION
  ): Promise<void> {
    try {
      if (touchPoints.length < 2) {
        throw new Error('Multi-touch requires at least 2 touch points for simultaneous interaction');
      }

      const actions = touchPoints.map((point, index) => ({
        type: 'pointer' as const,
        id: `finger${index + 1}`,
        parameters: { pointerType: 'touch' as const },
        actions: [
          { type: 'pointerMove' as const, duration: 0, x: Math.round(point.x), y: Math.round(point.y) },
          { type: 'pointerDown' as const, button: 0 },
          { type: 'pause' as const, duration },
          { type: 'pointerUp' as const, button: 0 }
        ]
      }));

      await browser.performActions(actions);
      await browser.pause(300);
      console.log(`✓ Multi-touch gesture performed with ${touchPoints.length} points`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Multi-touch gesture failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform edge swipe (swipe from screen edge)
   * @param edge Screen edge: 'left', 'right', 'top', 'bottom'
   * @param options Gesture options
   */
  static async edgeSwipe(
    edge: 'left' | 'right' | 'top' | 'bottom',
    options: GestureOptions = {}
  ): Promise<void> {
    try {
      const { duration = this.DEFAULT_DURATION } = options;
      const windowSize = await browser.getWindowSize();

      let startX: number, startY: number, endX: number, endY: number;

      switch (edge) {
        case 'left':
          startX = this.EDGE_MARGIN;
          startY = windowSize.height / 2;
          endX = startX + this.EDGE_SWIPE_LENGTH;
          endY = startY;
          break;
        case 'right':
          startX = windowSize.width - this.EDGE_MARGIN;
          startY = windowSize.height / 2;
          endX = startX - this.EDGE_SWIPE_LENGTH;
          endY = startY;
          break;
        case 'top':
          startX = windowSize.width / 2;
          startY = this.EDGE_MARGIN;
          endX = startX;
          endY = startY + this.EDGE_SWIPE_LENGTH;
          break;
        case 'bottom':
          startX = windowSize.width / 2;
          startY = windowSize.height - this.EDGE_MARGIN;
          endX = startX;
          endY = startY - this.EDGE_SWIPE_LENGTH;
          break;
      }

      await this.swipeWithCoordinates({ startX, startY, endX, endY, duration });
      console.log(`✓ Edge swipe performed from ${edge} edge`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Edge swipe failed from ${edge}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform scroll with precise control (percentage-based)
   * @param direction Scroll direction: 'up', 'down', 'left', 'right'
   * @param percentage Scroll distance as percentage of screen (0-1)
   * @param options Gesture options
   */
  static async scrollByPercentage(
    direction: 'up' | 'down' | 'left' | 'right',
    percentage: number = 0.5,
    options: GestureOptions = {}
  ): Promise<void> {
    try {
      const { duration = this.DEFAULT_DURATION } = options;
      const windowSize = await browser.getWindowSize();
      
      const centerX = windowSize.width / 2;
      const centerY = windowSize.height / 2;
      const distanceX = windowSize.width * percentage;
      const distanceY = windowSize.height * percentage;

      let startX: number, startY: number, endX: number, endY: number;

      switch (direction) {
        case 'up':
          startX = centerX;
          startY = windowSize.height * 0.8;
          endX = centerX;
          endY = startY - distanceY;
          break;
        case 'down':
          startX = centerX;
          startY = windowSize.height * 0.2;
          endX = centerX;
          endY = startY + distanceY;
          break;
        case 'left':
          startX = windowSize.width * 0.8;
          startY = centerY;
          endX = startX - distanceX;
          endY = centerY;
          break;
        case 'right':
          startX = windowSize.width * 0.2;
          startY = centerY;
          endX = startX + distanceX;
          endY = centerY;
          break;
      }

      await this.swipeWithCoordinates({ startX, startY, endX, endY, duration });
      console.log(`✓ Scroll ${direction} by ${percentage * 100}% performed`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Scroll by percentage failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform complex gesture chain (sequence of gestures)
   * @param gestures Array of gesture functions to execute in sequence
   */
  static async gestureChain(...gestures: Array<() => Promise<void>>): Promise<void> {
    try {
      for (let i = 0; i < gestures.length; i++) {
        await gestures[i]();
        await browser.pause(500); // Pause between gestures
      }
      console.log(`✓ Gesture chain completed with ${gestures.length} gestures`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Gesture chain failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Drag and drop between two elements with smooth animation
   */
  static async dragAndDrop(
    sourceSelector: string,
    targetSelector: string,
    options: GestureOptions = {}
  ): Promise<void> {
    try {
      const { duration = this.DEFAULT_DURATION } = options;

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

      await this.swipeWithCoordinates({ startX, startY, endX, endY, duration });
      console.log(`✓ Drag and drop from ${sourceSelector} to ${targetSelector}`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Drag and drop failed: ${err.message}`);
      throw error;
    }
  }

  /**
   * Perform circular swipe gesture
   * @param selector Element selector
   * @param clockwise Direction of rotation
   * @param options Gesture options
   */
  static async circularSwipe(
    selector: string,
    clockwise: boolean = true,
    options: GestureOptions = {}
  ): Promise<void> {
    try {
      const element = await $(selector);
      const { duration = this.DEFAULT_DURATION } = options;

      const location = await element.getLocation();
      const size = await element.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;
      const radius = Math.min(size.width, size.height) / 3;

      const points: MultiTouchPoint[] = [];
      const angleStep = (2 * Math.PI) / this.CIRCULAR_SWIPE_STEPS;

      for (let i = 0; i <= this.CIRCULAR_SWIPE_STEPS; i++) {
        const angle = clockwise ? i * angleStep : -i * angleStep;
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      }

      // Create smooth circular motion
      const actions = [{
        type: 'pointer' as const,
        id: 'finger1',
        parameters: { pointerType: 'touch' as const },
        actions: [
          { type: 'pointerMove' as const, duration: 0, x: Math.round(points[0].x), y: Math.round(points[0].y) },
          { type: 'pointerDown' as const, button: 0 },
          ...points.slice(1).map(point => ({
            type: 'pointerMove' as const,
            duration: Math.round(duration / this.CIRCULAR_SWIPE_STEPS),
            x: Math.round(point.x),
            y: Math.round(point.y)
          })),
          { type: 'pointerUp' as const, button: 0 }
        ]
      }];

      await browser.performActions(actions);
      await browser.pause(300);
      console.log(`✓ Circular swipe performed on ${selector} (${clockwise ? 'clockwise' : 'counter-clockwise'})`);
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Circular swipe failed on ${selector}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Release all touch actions (cleanup after gestures)
   */
  static async releaseActions(): Promise<void> {
    try {
      await browser.releaseActions();
      console.log('✓ All touch actions released');
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Failed to release actions: ${err.message}`);
    }
  }
}

export default AdvancedGestures;
