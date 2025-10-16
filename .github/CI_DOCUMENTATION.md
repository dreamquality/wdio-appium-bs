# GitHub Actions CI Configuration

This repository includes GitHub Actions workflows for automated testing with Appium 3 and WebdriverIO v9.

## Workflow Files

### 1. `ci.yml` - Comprehensive CI Pipeline

**Purpose**: Full CI/CD pipeline with linting, type checking, and parallel test execution.

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs**:

#### `lint-and-typecheck`
- Runs on: Ubuntu Latest
- Validates TypeScript code with `tsc --noEmit`
- Must pass before tests run

#### `test-browserstack-android`
- Runs on: Ubuntu Latest
- Executes Android tests on BrowserStack
- Generates and uploads Allure reports
- Artifacts: `allure-report-android`, `test-results-android`

#### `test-browserstack-ios`
- Runs on: Ubuntu Latest
- Executes iOS tests on BrowserStack
- Generates and uploads Allure reports
- Artifacts: `allure-report-ios`, `test-results-ios`

#### `publish-reports`
- Runs on: Ubuntu Latest
- Merges test reports from Android and iOS
- Publishes to GitHub Pages (only on `main` branch)
- Reports available at: `https://<username>.github.io/<repo>/test-reports/`

### 2. `browserstack.yml` - Legacy BrowserStack Tests

**Purpose**: Simplified BrowserStack Android testing workflow.

**Triggers**:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

**Features**:
- Runs on: macOS Latest
- Android tests only
- Publishes Allure reports to GitHub Pages

## Required Secrets

Configure these secrets in your repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `BROWSERSTACK_USERNAME` | BrowserStack account username | All tests |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack access key | All tests |
| `BROWSERSTACK_ANDROID_APP_ID` | Android app ID (e.g., `bs://abc123`) | Android tests |
| `BROWSERSTACK_IOS_APP_ID` | iOS app ID (e.g., `bs://xyz789`) | iOS tests |

### How to Get BrowserStack App IDs

1. Upload your app to BrowserStack:
   ```bash
   curl -u "USERNAME:ACCESS_KEY" \
     -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
     -F "file=@/path/to/app.apk"
   ```

2. The response will include the `app_url` (your app ID):
   ```json
   {
     "app_url": "bs://abc123def456"
   }
   ```

3. Add this as `BROWSERSTACK_ANDROID_APP_ID` or `BROWSERSTACK_IOS_APP_ID` in GitHub Secrets.

## Key Features

### Appium 3 Compatibility
- Uses Node.js 20.19.0 (required by Appium 3)
- Automatically installs Appium drivers via `postinstall` script
- Skips chromedriver download during CI with `APPIUM_SKIP_CHROMEDRIVER_INSTALL=1`

### Reliability Features
- `continue-on-error: true` on test steps (tests can fail without blocking pipeline)
- 60-minute timeout for test jobs
- Automatic retry and artifact upload even on failures

### Artifact Management
- Test reports retained for 30 days
- Separate artifacts for Android and iOS results
- Automatic Allure report generation

## Workflow Diagram

```
┌─────────────────────────────────────────┐
│  Push/PR to main, master, or develop    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Lint and Type Check                     │
│  - TypeScript validation                 │
│  - Code quality checks                   │
└──────────────┬───────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌─────────────┐  ┌─────────────┐
│  Android    │  │  iOS Tests  │
│  Tests      │  │  (parallel) │
└──────┬──────┘  └──────┬──────┘
       │                │
       └────────┬───────┘
                ▼
   ┌────────────────────────┐
   │  Publish Reports       │
   │  (only on main branch) │
   └────────────────────────┘
```

## Local Testing

Before pushing, you can test locally:

```bash
# Type check
npx tsc --noEmit

# Install dependencies (installs Appium drivers)
npm ci

# Verify Appium installation
npx appium --version
npx appium driver list

# Run tests (requires .env file with BrowserStack credentials)
npm run test:android:bs
npm run test:ios:bs

# Generate Allure report
npm run allure:generate
npm run allure
```

## Troubleshooting

### Tests Failing in CI but Passing Locally

**Check**:
1. Node.js version (must be 20.19.0+)
2. BrowserStack secrets are correctly configured
3. App IDs are up to date in secrets

### Driver Installation Failures

The `postinstall` script handles driver installation. If it fails:
- Check network connectivity to npm registry
- Ensure Node.js version is compatible
- Try setting `APPIUM_SKIP_CHROMEDRIVER_INSTALL=1`

### Allure Report Not Generated

**Possible causes**:
1. Test results directory missing (`reporters/allure-results/`)
2. Allure commandline not installed
3. Tests didn't produce any results

**Fix**: Check test execution logs in GitHub Actions for errors.

### GitHub Pages Not Updating

**Requirements**:
1. GitHub Pages must be enabled in repository settings
2. Workflow must run on `main` branch
3. `GITHUB_TOKEN` must have pages write permissions

**Enable GitHub Pages**:
1. Go to `Settings > Pages`
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`

## Upgrading Workflows

When updating Appium or WebdriverIO versions:

1. Update `node-version` in all workflows
2. Test locally first
3. Update documentation
4. Monitor first CI run for issues

## Best Practices

1. **Always run type check before tests** - Catches issues early
2. **Use artifact uploads** - Debugging failed tests is easier with reports
3. **Keep secrets updated** - Rotate BrowserStack keys regularly
4. **Monitor test duration** - Optimize if tests exceed 30 minutes
5. **Review failed jobs** - Don't ignore `continue-on-error` failures

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [BrowserStack App Automate](https://www.browserstack.com/docs/app-automate)
- [Appium 3 Documentation](https://appium.io/docs/en/3.0/)
- [WebdriverIO Documentation](https://webdriver.io/)
- [Allure Report](https://docs.qameta.io/allure/)
