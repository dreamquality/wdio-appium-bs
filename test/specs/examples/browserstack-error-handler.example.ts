/**
 * Example test demonstrating BrowserStack error handling
 * 
 * This file demonstrates how the BrowserStack timeout/expiration error handler works.
 * The handler automatically detects and reports BrowserStack-specific errors to Allure.
 * 
 * Note: This is an example file. The actual error detection happens automatically
 * when BrowserStack errors occur during normal test execution.
 * 
 * When BrowserStack errors occur (e.g., "Automate plan expired", "Account limit exceeded"),
 * the framework will:
 * 1. Detect the error automatically in the afterTest hook
 * 2. Add detailed information to the Allure report
 * 3. Include actionable steps to resolve the issue
 * 4. Attach error details in JSON format
 */

import { expect, browser } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';

describe('BrowserStack Error Handler Example', () => {
    /**
     * This test demonstrates normal test execution.
     * If a BrowserStack error occurs (timeout, expiration, limit exceeded),
     * the error handler in wdio.conf.ts will automatically:
     * - Detect the error
     * - Add detailed information to Allure report
     * - Mark the test with special labels
     * - Provide actionable resolution steps
     */
    it('demonstrates automatic BrowserStack error detection', async () => {
        allureReporter.addFeature('Error Handling');
        allureReporter.addStory('BrowserStack Timeout Detection');
        
        allureReporter.addDescription(
            'This test demonstrates how BrowserStack errors are automatically detected and reported.\n\n' +
            'The error handler detects these BrowserStack-specific errors:\n' +
            '- Automate plan expired\n' +
            '- Account limit exceeded\n' +
            '- Parallel session limit reached\n' +
            '- Session timeout errors\n\n' +
            'When detected, the Allure report will include:\n' +
            '- Clear error identification\n' +
            '- Detailed error information\n' +
            '- Actionable resolution steps\n' +
            '- Error details in JSON format',
            'text'
        );
        
        // Normal test execution
        // If a BrowserStack error occurs at any point, it will be caught
        // and properly reported in the Allure report
        try {
            const pageSource = await browser.getPageSource();
            expect(pageSource.length).toBeGreaterThan(0);
        } catch (error) {
            // The afterTest hook in wdio.conf.ts will process this error
            // and detect if it's a BrowserStack-specific issue
            throw error;
        }
    });
    
    /**
     * Example of what error messages are detected:
     * 
     * The following error messages will trigger the BrowserStack error handler:
     * - "Automate plan expired" or "Plan expired"
     * - "Account limit exceeded"
     * - "Parallel limit exceeded"
     * - "Session limit reached"
     * - Any BrowserStack error containing "timeout", "expired", or "limit exceeded"
     * 
     * When these errors occur, check the Allure report for:
     * 1. Label: "BROWSERSTACK_TIME_EXPIRED"
     * 2. Detailed description with error information
     * 3. Attachment: "BrowserStack Error Details" (JSON)
     * 4. Actionable steps to resolve the issue
     */
    it.skip('example error messages that trigger the handler', async () => {
        // This is a documentation test - it's skipped and won't run
        // It demonstrates what the error handler looks for
        
        const exampleErrors = [
            'Automate plan expired - please renew your subscription',
            'Account limit exceeded - upgrade your plan',
            'Parallel session limit reached',
            'BrowserStack session timeout',
            'BrowserStack: limit exceeded for parallel tests'
        ];
        
        // These error patterns would all be detected by the handler
        // and properly reported in the Allure report
        console.log('Example BrowserStack errors detected:', exampleErrors);
    });
});
