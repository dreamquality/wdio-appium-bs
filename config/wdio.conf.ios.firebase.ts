import { config as sharedConfig } from './wdio.conf.js';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

// Промисифицированный exec для создания архива
const execPromise = promisify(exec);

// Загрузка переменных окружения
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
      app: process.env.FIREBASE_IOS_APP_PATH, // Путь к вашему .ipa файлу
      autoAcceptAlerts: true,
      autoDismissAlerts: true,
    },
  ],

  beforeSession: async () => {
    const bucketName = process.env.FIREBASE_BUCKET_NAME;
    const unresolvedIosAppPath = process.env.FIREBASE_IOS_APP_PATH;
    const iosAppPath = path.resolve(unresolvedIosAppPath);
    const iosTestsZipPath = path.resolve('./ios-tests.zip'); // Архив с тестами
    const bucket = storage.bucket(bucketName);

    // Создание архива тестов
    try {
      console.log('Создание архива с тестами...');
      await execPromise(`zip -r ${iosTestsZipPath} ./test`);
      console.log('Архив с тестами создан:', iosTestsZipPath);
    } catch (error) {
      console.error('Ошибка при создании архива тестов:', error);
      throw error;
    }

    // Загрузка .ipa и архива тестов в Google Cloud Storage
    try {
      await bucket.upload(iosAppPath, { destination: `apps/${path.basename(iosAppPath)}` });
      await bucket.upload(iosTestsZipPath, { destination: `tests/${path.basename(iosTestsZipPath)}` });
      console.log('Приложение и тесты загружены в Google Cloud Storage');
    } catch (error) {
      console.error('Ошибка загрузки в Google Cloud Storage:', error);
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
      console.error('Ошибка создания тестовой матрицы:', error.message);
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
      console.log(`Файлы приложения и тестов удалены из Google Cloud Storage.`);
    } catch (error) {
      console.error('Ошибка удаления файлов из Google Cloud Storage:', error);
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
