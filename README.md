# e2e-tests, wdio v8, appium v2, hybrid app (android, ios), browserstack

e2e-test template with hybrid mob apps

```sh

```

## Setup

### Install software and check out the project

- Download and install Node.JS ( at least 16.17 )
- Typescript 5+ version
- Install Visual Studio Code
- Clone and checkout the github project
- npm install

## Setup with Browserstack

- Add .env file with next variables `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, `BROWSERSTACK_ANDROID_APP_ID` and `BROWSERSTACK_IOS_APP_ID`
- Sign in inside browserstack and upload your mobile apps (.apk and .ipa)
- Update `.env` file
- `npm run test:android:bs`

### How to run the android tests on windows

```sh

```

We defined a default configuration (config/wdio.android.conf.js) for Android which will be executed when you run "npm run test:android".

Be sure that you have:

- Install Java latest via https://www.java.com/ru/download/manual.jsp
- Set the environment variable called `JAVA_HOME` to the jre directory (C:\Program Files\Android\Android Studio\jre\)
- Install Node v16+ https://nodejs.org/uk
- installed the latest Android Studio version https://developer.android.com/studio
- Add `ANDROID_HOME` to path in OS system variables
- Install Appium by command: `npm install -g appium`
- Install Appium inspector v2+ https://github.com/appium/appium-inspector/releases
- Install Appium drivers (uiautomator2, xcuitest and etc..; `appium driver install uiautomator2`)
- Allow virtualization in BIOS https://www.youtube.com/watch?v=UgDxU0jZAe4
- plugged in any android device into your computer. Leave it unlocked.
- allowed USB-Debugging on the connected android device
- run `adb devices` to check device name( device id )
- set the platform version, device name and path to apps(apk/ipa) inside android config (config/wdio.adndroid.conf.js) to the version on your android device.
- run `appium` in cmd
- now you can interact with your apps through the appium inspector on your PC

### Linter

We use eslint to lint the typescript files. The prettier plugin in eslint tries to autoformat the code on every run.

### Test structure

All test cases should be coded inside the test folder. There you can organize tests for different apps (e.g. msb-app) and define generic classes with getters and setters to use classes those methods inside other classes.

We work with the Page Object Pattern described in <https://webdriver.io/docs/pageobjects.html>. The main idea is to encapsulate logic into page classes and use the logic in the spec files to run the tests.
For instance we defined the LoginPage and the element as attributes in a class and reuse them in the code.



# Setting Up Google Cloud and Firebase Test Lab

## Step 1: Create a Project in Google Cloud

1. **Go to Google Cloud Console**: Open [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a new project**:
   - Click on the dropdown menu at the top of the page, next to the Google Cloud logo.
   - Select "New Project".
   - Enter a name for your project. Something like "MyMobileTestingProject" would work.
   - (Optional) Select an organization if you have one.
   - Click "Create".

3. **Save the project**: Make sure your new project is active. The name of your project should be visible in the top right corner.

## Step 2: Enable Required APIs

1. **Go to "API & Services"**:
   - In the left menu, select "API & Services", then "Library".

2. **Find and enable APIs**:
   - In the search bar, type "Google Cloud Storage API" and click on it. Then click "Enable".
   - Repeat the process for "Firebase Test Lab API".

## Step 3: Create Credentials

1. **Go to "Credentials"**:
   - In the left sidebar, select "API & Services" -> "Credentials".

2. **Create credentials**:
   - Click the "Create Credentials" button and select "Service Account".
   - Enter a name for the service account, such as "Firebase Test Lab Service Account", and optionally add a description. Click "Create".

3. **Select roles for the service account**:
   - On the next screen, choose roles:
     - **Viewer**: for general project access.
     - **Storage Admin**: for managing storage.
   - Click "Continue", then "Done".

4. **Download the service account key**:
   - Find the service account you just created in the list and click on it.
   - Go to the "Keys" section.
   - Click "Add Key" and select "JSON". This will create and download a key file. Save it in a secure location, as it contains your authentication details.

## Step 4: Set Up Storage

1. **Go to "Storage"**:
   - In the left menu, select "Storage" -> "Browser".

2. **Create a bucket**:
   - Click "Create Bucket".
   - Enter a unique name for your bucket (e.g., `my-mobile-testing-bucket`).
   - Choose the storage settings and availability that suit you (e.g., region, storage class).
   - Click "Create".

3. **Record the bucket name**: This will be your `FIREBASE_BUCKET_NAME`, which you will use in your code.

## Step 5: Upload the .ipa File to the Bucket

- **Manual Upload**:
  - You can upload the `.ipa` file to the created bucket using the Google Cloud Console. Click on your bucket, then "Upload Files" and select the file.

- **Automatic Upload via Code**:
  - You can set up your code to automatically upload the `.ipa` file to the bucket using the `@google-cloud/storage` library.

## Step 6: Set Up Environment Variables

1. **Create a `.env` file**:
   - In the root of your project, create a `.env` file if you don't have one.

2. **Add necessary variables**:
   In your `.env` file, specify the following variables:
   ```plaintext
   FIREBASE_PROJECT_ID=your-google-cloud-project-id
   FIREBASE_BUCKET_NAME=my-mobile-testing-bucket
   FIREBASE_IOS_APP_PATH=C:/Users/alexx/Documents/myTemplates/mobAutomation/apps/ios/Spiderdoor.ipa
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   ```

   - Replace `your-google-cloud-project-id` with your project's ID.
   - Make sure the path to the key file matches where you saved it.

