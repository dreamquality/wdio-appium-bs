# Appium 2 to Appium 3 Migration Notes

## Summary

This repository has been successfully migrated from Appium 2 to Appium 3, along with updating WebdriverIO from v8 to v9.

## Changes Made

### 1. Dependency Updates

#### package.json
- **Node.js requirement**: Updated from `^16.17.0 || >=18.0.0` to `>=20.19.0` (Appium 3 requirement)
- **Appium**: Added `appium@^3.1.0` as devDependency
- **WebdriverIO packages**: Updated all @wdio packages from v8.14.x to v9.20.0:
  - `@wdio/allure-reporter`: ^8.14.0 → ^9.20.0
  - `@wdio/appium-service`: ^8.14.3 → ^9.20.0
  - `@wdio/browserstack-service`: ^8.14.3 → ^9.20.0
  - `@wdio/cli`: ^8.14.4 → ^9.20.0
  - `@wdio/junit-reporter`: ^8.14.0 → ^9.20.0
  - `@wdio/local-runner`: ^8.14.3 → ^9.20.0
  - `@wdio/mocha-framework`: ^8.14.0 → ^9.20.0
  - `@wdio/spec-reporter`: ^8.15.0 → ^9.20.0
- **Removed**: `appium-uiautomator2-driver` (drivers are now installed via Appium CLI)
- **Added**: postinstall script to automatically install Appium drivers

### 2. Configuration Updates

#### Security Flags (Breaking Change in Appium 3)
The `--allow-insecure` flag now requires driver scope prefixes:

**Before (Appium 2):**
```javascript
args: [
  "--allow-insecure",
  "--relaxed-security"
]
```

**After (Appium 3):**
```javascript
// For Android (wdio.conf.android.ts)
args: [
  "--allow-insecure=uiautomator2:chromedriver_autodownload",
  "--relaxed-security"
]

// For iOS (wdio.conf.ios.ts)
args: [
  "--allow-insecure=xcuitest:get_server_logs,xcuitest:chromedriver_autodownload",
  "--relaxed-security"
]

// For appium-manager.js (both platforms)
args: [
  "--allow-insecure=uiautomator2:chromedriver_autodownload,xcuitest:get_server_logs,xcuitest:chromedriver_autodownload",
  "--relaxed-security"
]
```

### 3. Code Updates

#### TypeScript Type Compatibility
Updated `test/pageobjects/page.ts` to fix type compatibility with WebdriverIO v9:
- Changed `getElement()` and `getAllElements()` to use `await` for proper type inference
- Removed explicit return type annotations that were causing type conflicts with ChainablePromiseElement

### 4. Driver Installation

Drivers are now installed via Appium CLI instead of npm:

```bash
npx appium driver install uiautomator2
npx appium driver install xcuitest
```

**Installed Versions:**
- uiautomator2: 5.0.5 (compatible with Appium 3)
- xcuitest: 10.2.1 (compatible with Appium 3)

### 5. Documentation Updates

Updated README.md:
- Changed title from "WebdriverIO v8, Appium v2" to "WebdriverIO v9, Appium v3"
- Updated Node.js requirement to 20.19 or higher
- Updated Appium installation instructions
- Added driver installation steps

## Verification

The migration was verified by:
1. TypeScript compilation passes without errors
2. Appium 3.1.0 server starts successfully with new configuration
3. Both uiautomator2 and xcuitest drivers are properly installed and recognized

## Breaking Changes Summary

### For Users:
1. **Node.js 20.19.0+ required** - Older versions will not work
2. **Driver installation** - Run `npm install` which will automatically install drivers via postinstall script
3. **Configuration files** - No manual changes needed, already updated in this migration

### For Developers:
1. **Security flags syntax** - Use scoped prefixes like `uiautomator2:feature_name`
2. **TypeScript types** - WebdriverIO v9 uses ChainablePromise types, await all element operations
3. **Driver management** - Drivers installed via `appium driver install` command, not npm packages

## Next Steps

To use this migrated repository:

1. Ensure you have Node.js 20.19.0 or newer installed
2. Run `npm install` to install dependencies and drivers
3. Verify installation: `npx appium --version` should show 3.1.0
4. Check drivers: `npx appium driver list` should show uiautomator2 and xcuitest as installed
5. Run tests as before: `npm run test:android:bs` or `npm run test:ios:bs`

## Troubleshooting

### If drivers are not installed:
```bash
npx appium driver install uiautomator2
npx appium driver install xcuitest
```

### If using older Node.js version:
Upgrade to Node.js 20.19.0 or newer using nvm:
```bash
nvm install 20
nvm use 20
```

### If encountering network issues during install:
Set the environment variable to skip chromedriver download:
```bash
export APPIUM_SKIP_CHROMEDRIVER_INSTALL=1
npm install
```

## References

- [Appium 3 Migration Guide](https://appium.io/docs/en/3.0/guides/migrating-2-to-3/)
- [WebdriverIO v9 Release Notes](https://webdriver.io/blog/)
- [Appium Security Guide](https://appium.io/docs/en/latest/guides/security/)
