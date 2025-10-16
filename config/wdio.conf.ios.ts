import { config as sharedConfig } from "./wdio.conf.js";
import { join } from "path"
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

export const config = {
    ...sharedConfig,
    port: 4723,
    services: ["appium"],
    appium: {
      // For options see
      // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
      args: [
        "--allow-insecure=xcuitest:get_server_logs,xcuitest:chromedriver_autodownload",
        "--relaxed-security",
        "--session-override", // Allow session override for better connection stability
        "--log-level", "error:info" // Reduce log noise but keep important info
      ],
      command: 'appium',
      logPath: './appium.log', // Log to file for debugging
      // Connection stability settings
      timeout: 300000, // 5 minutes timeout for server startup
      killTimeout: 30000, // 30 seconds to kill existing server process
      killSignal: 'SIGTERM', // Graceful shutdown signal
      forceKillTimeout: 10000, // Force kill after 10 seconds if graceful fails
    },
    capabilities: [{
      // capabilities for local Appium web tests on an Android Emulator or Real device
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 13',
      "appium:app": join(process.cwd(), "./apps/ios/Spiderdoor.ipa"),
      'appium:platformVersion': '15.4',
      'appium:automationName': 'XCUITest',
      'appium:newCommandTimeout': 300, // 5 minutes timeout for commands (was 240)
      'appium:noReset': false, // Always reset app state for clean runs (was true)
      'appium:autoWebview': true,
      // Additional connection stability improvements
      'appium:fullReset': false, // Don't uninstall/reinstall unless needed
      'appium:clearSystemFiles': true, // Clear Appium system files between sessions
      'appium:sessionTimeout': 600000, // 10 minutes session timeout
      'appium:eventTimings': true, // Enable event timing for debugging
      'appium:printPageSourceOnFindFailure': false, // Reduce log noise
      'appium:connectHardwareKeyboard': false, // Disable hardware keyboard for stability
      'appium:shouldUseSingletonTestManager': false // Avoid singleton issues
  }],

}
