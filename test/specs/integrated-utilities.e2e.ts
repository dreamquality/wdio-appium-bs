import { expect } from '@wdio/globals'
import entry from '../pageobjects/entry.page.js'

/**
 * Integrated Utilities Test Suite
 * 
 * This test demonstrates how all utility features are now integrated into the base Page class
 * and accessible from any page object (like entry page).
 * 
 * Available utilities:
 * - entry.smartWaits: Smart wait strategies
 * - entry.elementHelpers: Intelligent element interactions
 * - entry.platform: Platform detection and handling
 * - entry.testData: Test data management
 * - entry.gestures: Advanced gesture controls
 * - entry.appMgmt: App lifecycle management
 * - entry.network: Network mocking and proxy
 */

describe('Integrated Utilities - Usage Examples', () => {

    describe('Smart Waits Integration', () => {
        it('should use smart waits from page object', async () => {
            // Access SmartWaits through the page object
            await entry.smartWaits.waitForElementVisible('~button', { timeout: 5000 });
            
            // Use fluent wait
            const result = await entry.smartWaits.fluentWait(
                async () => await entry.isEntryTitleDisplayed('~title'),
                { timeout: 10000, pollingInterval: 500 }
            );
            expect(result).toBe(true);
        });

        it('should use retry operation from page object', async () => {
            // Smart retry with auto-retry mechanism
            await entry.smartWaits.retryOperation(
                async () => {
                    // Unstable operation
                    await entry.clickSignUpButton('~signUp');
                },
                { maxRetries: 3, delay: 1000 }
            );
        });
    });

    describe('Element Interaction Helpers Integration', () => {
        it('should use smart click with scroll', async () => {
            // Smart click with automatic scrolling and retries
            await entry.elementHelpers.smartClick('~button', {
                scrollIntoView: true,
                retries: 3,
                takeScreenshotOnError: true
            });
        });

        it('should use smart input with validation', async () => {
            // Smart input with automatic validation and keyboard handling
            await entry.elementHelpers.smartInput('~emailField', 'user@example.com', {
                validateInput: true,
                hideKeyboard: true,
                clearFirst: true
            });
        });

        it('should chain multiple interactions', async () => {
            // Chain multiple interactions with automatic error handling
            await entry.elementHelpers.chainInteractions(
                async () => await entry.elementHelpers.smartInput('~username', 'testuser'),
                async () => await entry.elementHelpers.smartInput('~password', 'password123'),
                async () => await entry.elementHelpers.smartClick('~loginBtn')
            );
        });
    });

    describe('Platform Detection Integration', () => {
        it('should detect platform and use platform-specific logic', async () => {
            // Check platform
            const isAndroid = entry.platform.isAndroid();
            const isIOS = entry.platform.isIOS();
            
            console.log(`Running on: ${entry.platform.getPlatform()}`);
            
            // Use platform-specific selector
            const buttonSelector = entry.platform.selectPlatformSelector({
                android: '//android.widget.Button[@text="Login"]',
                ios: '//XCUIElementTypeButton[@label="Login"]'
            });
            
            await entry.elementHelpers.smartClick(buttonSelector);
        });

        it('should build platform-specific XPath', async () => {
            // Auto-generate platform-specific XPath
            const xpath = entry.platform.buildPlatformXPath({
                text: 'Submit',
                className: 'Button'
            });
            
            await entry.smartWaits.waitForElementVisible(xpath);
        });

        it('should use platform-specific actions', async () => {
            // Platform-specific keyboard hiding
            await entry.platform.hideKeyboard();
            
            // Android-specific back button (no-op on iOS)
            if (entry.platform.isAndroid()) {
                await entry.platform.pressBackButton();
            }
        });
    });

    describe('Test Data Management Integration', () => {
        it('should load and use test data', async () => {
            // Get user data
            const user = entry.testData.getUser('default');
            console.log(`Testing with user: ${user.username}`);
            
            // Use in test
            await entry.elementHelpers.smartInput('~username', user.username);
            await entry.elementHelpers.smartInput('~password', user.password);
        });

        it('should use configuration values', async () => {
            // Get timeout from config
            const timeout = entry.testData.getConfig<number>('timeouts.default');
            
            await entry.smartWaits.waitForElementVisible('~element', { timeout });
        });

        it('should generate random test data', async () => {
            // Generate random data on-the-fly
            const email = entry.testData.generateRandomEmail('test');
            const username = entry.testData.generateRandomUsername('user');
            const password = entry.testData.generateRandomPassword(12);
            
            console.log(`Generated credentials: ${username}, ${email}`);
            
            // Use in test
            await entry.elementHelpers.smartInput('~email', email);
        });

        it('should switch environments', async () => {
            // Switch to staging environment
            entry.testData.setEnvironment('staging');
            
            // Get staging-specific user
            const stagingUser = entry.testData.getUser('default');
            
            // Get staging API endpoint
            const apiUrl = entry.testData.getEndpoint('api');
            
            console.log(`Testing on staging with: ${stagingUser.username}`);
        });
    });

    describe('Advanced Gestures Integration', () => {
        it('should perform pinch to zoom', async () => {
            // Pinch out to zoom in on map
            await entry.gestures.pinchOut('~mapView', {
                scale: 2.0,
                duration: 500
            });
        });

        it('should perform rotate gesture', async () => {
            // Rotate image 90 degrees
            await entry.gestures.rotate('~imageView', {
                angle: 90,
                duration: 1000
            });
        });

        it('should perform edge swipe', async () => {
            // Swipe from left edge to open navigation drawer
            await entry.gestures.edgeSwipe('left', {
                distance: 300,
                duration: 500
            });
        });

        it('should perform circular swipe', async () => {
            // Circular swipe for volume knob
            await entry.gestures.circularSwipe('~volumeKnob', {
                angle: 180,
                radius: 100,
                duration: 1000
            });
        });

        it('should chain multiple gestures', async () => {
            // Execute gesture sequence
            await entry.gestures.gestureChain(
                async () => await entry.gestures.pinchOut('~map', { scale: 2.0 }),
                async () => await entry.gestures.scrollByPercentage(0.5, { duration: 500 })
            );
        });
    });

    describe('App Management Integration', () => {
        it('should manage app lifecycle', async () => {
            const bundleId = 'com.example.app';
            
            // Check if app is installed
            const isInstalled = await entry.appMgmt.isAppInstalled(bundleId);
            
            if (isInstalled) {
                // Get app state
                const state = await entry.appMgmt.getAppState(bundleId);
                console.log(`App state: ${state}`);
                
                // Ensure app is in foreground
                await entry.appMgmt.ensureAppInForeground(bundleId);
            }
        });

        it('should manage app data', async () => {
            const bundleId = 'com.example.app';
            
            if (entry.platform.isAndroid()) {
                // Clear app data
                await entry.appMgmt.clearAppData(bundleId);
            }
            
            // Restart app
            await entry.appMgmt.restartApp(bundleId);
        });

        it('should grant permissions (Android)', async () => {
            if (entry.platform.isAndroid()) {
                const bundleId = 'com.example.app';
                
                // Grant camera permission
                await entry.appMgmt.grantPermissions(bundleId, [
                    'android.permission.CAMERA'
                ]);
            }
        });

        it('should wait for app state', async () => {
            const bundleId = 'com.example.app';
            
            // Wait for app to be in foreground (state 4)
            await entry.appMgmt.waitForAppState(bundleId, 4, {
                timeout: 10000,
                pollInterval: 500
            });
        });
    });

    describe('Network Mocking Integration', () => {
        it('should start mock server and add routes', async () => {
            // Start mock server
            await entry.network.startMockServer({ port: 8080 });
            
            // Add mock API route
            entry.network.addMockRoute({
                method: 'GET',
                path: '/api/users',
                response: {
                    status: 200,
                    body: { users: [{ id: 1, name: 'Test User' }] }
                }
            });
            
            // Configure app to use mock server
            const mockUrl = entry.network.getMockServerUrl();
            console.log(`Mock server running at: ${mockUrl}`);
        });

        it('should add request interceptor', async () => {
            // Intercept and modify requests
            entry.network.addRequestInterceptor((request) => ({
                ...request,
                headers: {
                    ...request.headers,
                    'X-Test-Header': 'test-value'
                }
            }));
        });

        it('should log and assert requests', async () => {
            // Perform some actions that make API calls
            await entry.elementHelpers.smartClick('~loginBtn');
            
            // Wait for specific request
            await entry.network.waitForRequest({
                method: 'POST',
                urlPattern: /\/api\/login/,
                timeout: 5000
            });
            
            // Assert request was made
            entry.network.assertRequestMade({
                method: 'POST',
                urlPattern: /\/api\/login/
            });
            
            // Get all requests
            const requests = entry.network.getRequestLogs();
            console.log(`Total requests: ${requests.length}`);
        });

        after(async () => {
            // Cleanup network mocking
            await entry.network.cleanup();
        });
    });

    describe('Combined Usage - Real-World Scenario', () => {
        it('should demonstrate combined utility usage', async () => {
            // 1. Get test data
            const user = entry.testData.getUser('default');
            const timeout = entry.testData.getConfig<number>('timeouts.default');
            
            // 2. Start network mocking
            await entry.network.startMockServer({ port: 8080 });
            entry.network.addMockRoute({
                method: 'POST',
                path: '/api/auth/login',
                response: {
                    status: 200,
                    body: { token: 'mock-token-123', success: true }
                }
            });
            
            // 3. Ensure app is ready
            const bundleId = 'com.example.app';
            await entry.appMgmt.ensureAppInForeground(bundleId);
            
            // 4. Wait for login screen with smart waits
            const loginButton = entry.platform.selectPlatformSelector({
                android: '//android.widget.Button[@text="Login"]',
                ios: '//XCUIElementTypeButton[@label="Login"]'
            });
            
            await entry.smartWaits.waitForElementVisible(loginButton, { timeout });
            
            // 5. Perform login with element helpers
            await entry.elementHelpers.chainInteractions(
                async () => await entry.elementHelpers.smartInput('~username', user.username, {
                    clearFirst: true,
                    validateInput: true
                }),
                async () => await entry.elementHelpers.smartInput('~password', user.password, {
                    clearFirst: true,
                    hideKeyboard: true
                }),
                async () => await entry.elementHelpers.smartClick(loginButton, {
                    scrollIntoView: true,
                    retries: 3
                })
            );
            
            // 6. Assert login request was made
            entry.network.assertRequestMade({
                method: 'POST',
                urlPattern: /\/api\/auth\/login/
            });
            
            // 7. Use gesture if needed (e.g., swipe to refresh)
            await entry.gestures.scrollByPercentage(0.3, { duration: 500 });
            
            // 8. Platform-specific action
            if (entry.platform.isAndroid()) {
                await entry.platform.hideKeyboard();
            }
            
            // 9. Cleanup
            await entry.network.cleanup();
            
            console.log('Complex workflow completed successfully!');
        });
    });

    describe('Documentation Examples', () => {
        it('should show quick start examples', async () => {
            // All utilities are now accessible from any page object:
            
            // Smart Waits
            await entry.smartWaits.waitForElementClickable('~button');
            
            // Element Helpers
            await entry.elementHelpers.smartClick('~button', { retries: 3 });
            
            // Platform Detection
            const platform = entry.platform.getPlatform();
            
            // Test Data
            const user = entry.testData.getUser('default');
            
            // Gestures
            await entry.gestures.pinchOut('~map', { scale: 2.0 });
            
            // App Management
            await entry.appMgmt.ensureAppInForeground('com.app');
            
            // Network Mocking
            entry.network.addMockRoute({
                method: 'GET',
                path: '/api/data',
                response: { status: 200, body: { success: true } }
            });
            
            console.log('All utilities accessible from page object!');
        });
    });
});
