import { config as sharedConfig } from './wdio.conf.js';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

// Load environment variables
dotenv.config();

const storage = new Storage();
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Set scopes here
});

export const config = {
  ...sharedConfig,

  hostname: 'localhost',
  port: 4723,
  path: '/wd/hub',

  capabilities: [
    {
      platformName: 'iOS',
      deviceName: 'iPhone 12',
      platformVersion: '15.0',
      automationName: 'XCUITest',
      app: process.env.FIREBASE_IOS_APP_PATH, // Path to your .ipa file
      autoAcceptAlerts: true,
      autoDismissAlerts: true,
    },
  ],

  beforeSession: async () => {
    const bucketName: any = process.env.FIREBASE_BUCKET_NAME; // Your storage bucket name
    const unresolvedIosAppPath: any = process.env.FIREBASE_IOS_APP_PATH; 
    const bucket = storage.bucket(bucketName);
    const iosAppPath = path.resolve(unresolvedIosAppPath);

    try {
      // Upload the .ipa file to Google Cloud Storage
      await bucket.upload(iosAppPath, {
        destination: `apps/${path.basename(iosAppPath)}`,
      });
    } catch (error) {
      console.error('Error uploading the app to Google Cloud Storage:', error);
      throw error; // Stop the session on upload error
    }

    const gcsAppPath = `gs://${bucketName}/apps/${path.basename(iosAppPath)}`; // url if you decided to upload the app manually
    
    // Create test matrix via Firebase REST API
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const accessToken = await getAccessToken(); // Get access token

    const testMatrixUrl = `https://testing.googleapis.com/v1/projects/${projectId}/testMatrices`;
    
    try {
      const response = await axios.post(testMatrixUrl, {
        testSpecification: {
          iosXcTest: {
            appBundleId: 'com.your.bundle.id', // Your app's bundle ID
            testType: 'INSTRUMENTATION',
          },
        },
        environmentMatrix: {
          iosDeviceList: {
            iosDevices: [
              {
                iosModelId: 'iphone12',
                iosVersionId: '15.0',
                locale: 'en',
                orientation: 'portrait',
              },
            ],
          },
        },
        resultStorage: {
          googleCloudStorage: {
            gcsPath: `gs://${bucketName}/results/`,
          },
        },
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Test Matrix ID:', response.data.testMatrixId);
    } catch (error) {
      console.error('Error creating test matrix:', error);
    }
  },
};

async function getAccessToken() {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}
