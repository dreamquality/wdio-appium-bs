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
    },
    capabilities: [{
      // capabilities for local Appium web tests on an Android Emulator or Real device
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 13',
      "appium:app": join(process.cwd(), "./apps/ios/Spiderdoor.ipa"),
      'appium:platformVersion': '15.4',
      'appium:automationName': 'XCUITest',
      'appium:newCommandTimeout': 240,
      'appium:noReset': true,
      'appium:autoWebview': true,
  }],

}
