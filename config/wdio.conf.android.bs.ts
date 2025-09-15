import { config as sharedConfig } from "./wdio.conf.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
export const config = {
    ...sharedConfig,
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: 'hub.browserstack.com',

    capabilities: [{
        'bstack:options': {
          deviceName: 'Samsung Galaxy S22 Ultra',
          osVersion: '12.0',
          deviceOrientation: 'portrait',
          // Add stability configurations
          acceptInsecureCerts: true,
          autoAcceptAlerts: true,
          autoGrantPermissions: true,
          newCommandTimeout: 300000, // 5 minutes
          commandTimeouts: {
            default: 60000,
            implicit: 30000,
            pageLoad: 60000,
            script: 60000
          }
        }
      }],
    services: [
        [
          'browserstack',
          {
            app: process.env.BROWSERSTACK_ANDROID_APP_ID,
            buildIdentifier: "${BUILD_NUMBER}",
            // opts: { forcelocal: false, localIdentifier: "webdriverio-appium-app-browserstack-repo" },
            browserstackLocal: true,
            testObservability: true,
            testObservabilityOptions: { 
                  projectName: "BrowserStack Android app testing",
                  buildName: 'browserstack Android build',
              },
            debug: true,
            networkLogs: true,
            consoleLogs: "warn",
            // Add retry and stability configurations
            maxSessions: 1,
            connectionRetryTimeout: 300000,
            connectionRetryCount: 5
          },
        ]
      ],
}
