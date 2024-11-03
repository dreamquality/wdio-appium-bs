import { config as sharedConfig } from './wdio.conf.js';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

// Promisified exec for creating the archive
const execPromise = promisify(exec);

// Load environment variables
dotenv.config();

const storage = new Storage();
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
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
    const bucketName = process.env.FIREBASE_BUCKET_NAME;
    const unresolvedIosAppPath = process.env.FIREBASE_IOS_APP_PATH;
    const iosAppPath = path.resolve(unresolvedIosAppPath);
    const iosTestsZipPath = path.resolve('./ios-tests.zip'); // Archive with entire project
    const bucket = storage.bucket(bucketName);

    // Create archive of the entire project
    try {
      console.log('Creating project archive...');
      await execPromise(`rm -f ${iosTestsZipPath} && zip -r ${iosTestsZipPath} ./*`);
      console.log('Project archive created:', iosTestsZipPath);
    } catch (error) {
      console.error('Error creating project archive:', error);
      throw error;
    }

    // Upload .ipa and project archive to Google Cloud Storage
    try {
      await bucket.upload(iosAppPath, { destination: `apps/${path.basename(iosAppPath)}` });
      await bucket.upload(iosTestsZipPath, { destination: `tests/${path.basename(iosTestsZipPath)}` });
      console.log('App and project files uploaded to Google Cloud Storage');
    } catch (error) {
      console.error('Error uploading to Google Cloud Storage:', error);
      throw error;
    }

    const gcsAppPath = `gs://${bucketName}/apps/${path.basename(iosAppPath)}`;
    const gcsTestsZipPath = `gs://${bucketName}/tests/${path.basename(iosTestsZipPath)}`;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const accessToken = await getAccessToken();
    const testMatrixUrl = `https://testing.googleapis.com/v1/projects/${projectId}/testMatrices`;

    try {
      const response = await axios.post(testMatrixUrl, {
        testSpecification: {
          iosXcTest: {
            testsZip: gcsTestsZipPath,
            appBundleId: 'com.spiderdoor',
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
      console.error('Error creating test matrix:', error.message);
      if (error.response) {
        console.error('Error response headers:', error.response.headers);
        console.error('Error response status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  },

  afterSession: async () => {
    const bucketName = process.env.FIREBASE_BUCKET_NAME;
    const iosAppPath = path.basename(process.env.FIREBASE_IOS_APP_PATH);
    const iosTestsZipPath = path.basename('./ios-tests.zip');

    try {
      const bucket = storage.bucket(bucketName);
      await bucket.file(`apps/${iosAppPath}`).delete();
      await bucket.file(`tests/${iosTestsZipPath}`).delete();
      console.log(`App and project files deleted from Google Cloud Storage.`);
    } catch (error) {
      console.error('Error deleting files from Google Cloud Storage:', error);
      if (error.response) {
        console.error('Error response headers:', error.response.headers);
        console.error('Error response status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  },
};

async function getAccessToken() {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}
