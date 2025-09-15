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
        "--allow-insecure",
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
      "appium:platformName": 'Android',
      'appium:deviceName': 'ZE2232TTQ8',
      "appium:app": join(process.cwd(), "./apps/android/app-staging-debug.apk"),
      'appium:platformVersion': '10.0',
      'appium:automationName': 'UiAutomator2',
      // Connection stability improvements
      'appium:newCommandTimeout': 300, // 5 minutes timeout for commands
      'appium:noReset': false, // Always reset app state for clean runs
      'appium:fullReset': false, // But don't uninstall/reinstall unless needed
      'appium:clearSystemFiles': true, // Clear Appium system files between sessions
      'appium:enforceXPath1': true, // Use consistent XPath version
      // Session management
      'appium:sessionTimeout': 600000, // 10 minutes session timeout
      'appium:eventTimings': true, // Enable event timing for debugging
      'appium:printPageSourceOnFindFailure': false // Reduce log noise
  }],

}
