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
          deviceName: 'iPhone 14 Pro Max',
          osVersion: '16',
          deviceOrientation: 'portrait',
        },
        'appium:options': {
          autoAcceptAlerts: true,
          newCommandTimeout: 300000, // 5 minutes
        }
      }],
    services: [
        [
          'browserstack',
          {
            app: process.env.BROWSERSTACK_IOS_APP_ID,
            buildIdentifier: "${BUILD_NUMBER}",
            browserstackLocal: true,
            testObservability: true,
            testObservabilityOptions: { 
                projectName: "BrowserStack IOS app testing",
                buildName: 'browserstack IOS build',
              },
            debug: true,
            networkLogs: true,
            consoleLogs: "warn"
          },
        ]
      ],
}
