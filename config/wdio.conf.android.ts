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
      args: ["--allow-insecure"],
      command: 'appium',
      // 'session-override': true,
    },
    capabilities: [{
      // capabilities for local Appium web tests on an Android Emulator or Real device
      "appium:platformName": 'Android',
      'appium:deviceName': 'ZE2232TTQ8',
      "appium:app": join(process.cwd(), "./apps/android/app-staging-debug.apk"),
      'appium:platformVersion': '10.0',
      'appium:automationName': 'UiAutomator2'
  }],

}
