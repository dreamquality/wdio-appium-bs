# BrowserStack Timeout/Expiration Error Handler

## Overview

This document describes the BrowserStack timeout and expiration error handler feature that automatically detects and reports BrowserStack-specific errors in the Allure test reports.

## Problem Statement

When running tests on BrowserStack, various errors can occur related to account limitations:
- Testing time/minutes expired
- Account limit exceeded
- Parallel session limit reached
- Session timeout errors

Previously, these errors would appear as generic test failures without clear indication of the root cause, making it difficult to quickly identify and resolve BrowserStack-specific issues.

## Solution

The framework now includes an automatic error detection and reporting system that:

1. **Detects BrowserStack-specific errors** during test execution
2. **Reports detailed information** in the Allure test report
3. **Provides actionable steps** to resolve the issue
4. **Includes error details** in structured format for debugging

## How It Works

### Error Detection

The error handler is implemented in the `afterTest` and `before` hooks in `config/wdio.conf.ts`. It scans error messages and stack traces for BrowserStack-specific patterns:

**Detected Error Patterns:**
- "Automate plan expired" or "Plan expired"
- "Account limit exceeded"
- "Parallel limit exceeded" or "Session limit"
- BrowserStack errors containing "timeout", "expired", or "limit exceeded"

### Automatic Reporting

When a BrowserStack error is detected, the handler automatically:

1. **Adds Allure Labels:**
   - `testType: browserstack_timeout`
   - `issue: BROWSERSTACK_TIME_EXPIRED`

2. **Creates Detailed Description:**
   - Clear identification of the issue
   - Error message details
   - Action required section with specific steps
   - Test duration and retry information

3. **Attaches Error Details (JSON):**
   ```json
   {
     "testName": "Test name",
     "errorMessage": "Automate plan expired",
     "duration": 5000,
     "retries": {"attempts": 1, "limit": 1},
     "timestamp": "2024-01-01T00:00:00.000Z",
     "errorType": "BrowserStack Timeout/Expiration",
     "possibleCauses": [
       "Testing time/minutes expired on BrowserStack account",
       "Account limit exceeded",
       "Parallel session limit reached",
       "Plan expired or requires renewal"
     ]
   }
   ```

4. **Logs to Console:**
   ```
   ⚠️  BrowserStack timeout/expiration detected
   BrowserStack error details added to Allure report
   ```

## Usage

### Viewing BrowserStack Errors in Allure

1. **Run tests** on BrowserStack (may encounter timeout/expiration):
   ```bash
   npm run test:android:bs
   ```

2. **Generate Allure report:**
   ```bash
   npm run allure:generate
   ```

3. **View Allure report:**
   ```bash
   npm run allure
   ```

4. **In the Allure report:**
   - Failed tests with BrowserStack issues will have special labels
   - Click on the failed test to see detailed information
   - Check the "Description" section for error details and action steps
   - Review the "BrowserStack Error Details" attachment for structured data

### Example Error in Allure Report

When a BrowserStack timeout occurs, the Allure report will show:

**Test Status:** Failed ❌  
**Labels:**
- `testType: browserstack_timeout`
- `issue: BROWSERSTACK_TIME_EXPIRED`

**Description:**
```
🚨 BrowserStack Testing Time Expired

This test failed because the BrowserStack account testing time has expired or limit was exceeded.

Error Details:
Automate plan has expired. Please renew your subscription.

Action Required:
- Check BrowserStack account status and plan limits
- Verify account has sufficient testing minutes remaining
- Review parallel session limits

Duration: 5000ms
Retries: 1/1
```

**Attachments:**
- `BrowserStack Error Details` (JSON with structured error information)
- `Failure Screenshot` (if captured before session loss)
- `Page Source` (if captured before session loss)

## Implementation Details

### File Modified: `config/wdio.conf.ts`

#### 1. Enhanced `afterTest` Hook

The `afterTest` hook now includes BrowserStack error detection:

```typescript
afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
        // Check for BrowserStack-specific timeout/expiration errors
        const errorMessage = error ? error.message : '';
        const errorStack = error ? error.stack : '';
        const fullErrorText = `${errorMessage} ${errorStack}`.toLowerCase();
        
        const isBrowserStackTimeoutError = 
            fullErrorText.includes('automate plan expired') ||
            fullErrorText.includes('plan expired') ||
            // ... other patterns
        
        if (isBrowserStackTimeoutError) {
            // Add detailed information to Allure report
            allureReporter.addLabel('testType', 'browserstack_timeout');
            allureReporter.addLabel('issue', 'BROWSERSTACK_TIME_EXPIRED');
            // ... additional reporting
        }
    }
}
```

#### 2. Enhanced `before` Hook

The `before` hook catches session creation errors:

```typescript
before: async function (capabilities, specs) {
    try {
        // Connection verification
        // ...
    } catch (error) {
        // Check for BrowserStack-specific errors during session creation
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('automate plan expired') || /* ... */) {
            // Report to Allure and provide clear error message
            allureReporter.addLabel('issue', 'BROWSERSTACK_SESSION_FAILED');
            // ...
        }
    }
}
```

## Benefits

1. **Quick Issue Identification:** Instantly recognize BrowserStack-specific issues in test reports
2. **Actionable Information:** Clear steps to resolve the problem
3. **Better Debugging:** Structured error data for analysis
4. **Improved CI/CD:** Easier to identify infrastructure vs. test issues in CI pipelines
5. **Time Savings:** Reduce time spent investigating generic test failures

## CI/CD Integration

When running in CI/CD (GitHub Actions, Jenkins, etc.), BrowserStack timeout errors will be:

1. **Clearly logged** in CI console output with ⚠️ warnings
2. **Properly tagged** in Allure reports uploaded as artifacts
3. **Easy to identify** when reviewing failed CI jobs

Example CI log output:
```
Test failed: should sign up with valid credentials
Error: Automate plan expired - please renew your subscription
⚠️  BrowserStack timeout/expiration detected
BrowserStack error details added to Allure report
```

## Maintenance

### Adding New Error Patterns

To detect additional BrowserStack error patterns, modify the error detection logic in `config/wdio.conf.ts`:

```typescript
const isBrowserStackTimeoutError = 
    fullErrorText.includes('automate plan expired') ||
    fullErrorText.includes('new error pattern here') ||
    // ... existing patterns
```

### Customizing Allure Report Content

To customize the information shown in Allure reports, modify the `allureReporter.addDescription()` call in the `afterTest` hook.

## Troubleshooting

### Error Handler Not Triggering

If the error handler doesn't trigger when you expect:

1. Check console logs for the error message
2. Verify the error message matches one of the detected patterns
3. Review `config/wdio.conf.ts` error detection logic

### Missing Allure Report Information

If Allure report doesn't show BrowserStack error details:

1. Ensure Allure reporter is properly configured
2. Check that `allureReporter` is imported in `wdio.conf.ts`
3. Verify Allure results directory exists: `reporters/allure-results/`
4. Regenerate Allure report: `npm run allure:generate`

## Related Documentation

- [WebdriverIO Hooks Documentation](https://webdriver.io/docs/options#hooks)
- [Allure Reporter Documentation](https://webdriver.io/docs/allure-reporter)
- [BrowserStack Error Codes](https://www.browserstack.com/docs/automate/api-reference/selenium/errors)

## Support

For issues or questions about this feature:
1. Check the troubleshooting section above
2. Review the example test in `test/specs/examples/browserstack-error-handler.example.ts`
3. Open an issue in the repository
