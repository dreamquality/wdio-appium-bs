
# e2e-tests: WebdriverIO v8, Appium v2, Hybrid App (Android & iOS), BrowserStack, Firebase

Template for end-to-end testing with hybrid mobile applications.

## Setup

### Install Required Software and Project Checkout

1. Download and install [Node.js](https://nodejs.org/) (version 16.17 or higher).
2. Install TypeScript (version 5 or higher).
3. Install Visual Studio Code.
4. Clone the GitHub project repository.
5. Run `npm install` to install project dependencies.

## BrowserStack Configuration

1. Create a `.env` file in the project root with the following variables:
   - `BROWSERSTACK_USERNAME`
   - `BROWSERSTACK_ACCESS_KEY`
   - `BROWSERSTACK_ANDROID_APP_ID`
   - `BROWSERSTACK_IOS_APP_ID`
2. Sign in to [BrowserStack](https://www.browserstack.com/), upload your mobile app files (`.apk` for Android and `.ipa` for iOS), and note the app IDs.
3. Update the `.env` file with your credentials and app IDs.
4. Run the Android tests with BrowserStack using:
   ```sh
   npm run test:android:bs
   ```

### Running Android Tests on Windows

To run Android tests on a Windows machine, ensure the following setup:

1. Install the latest version of [Java](https://www.java.com/download/manual.jsp) and set the `JAVA_HOME` environment variable to the JRE directory (e.g., `C:\Program Files\Android\Android Studio\jre\`).
2. Install [Node.js](https://nodejs.org/) version 16 or higher.
3. Install the latest version of [Android Studio](https://developer.android.com/studio).
4. Add `ANDROID_HOME` to your system environment variables.
5. Install Appium globally:
   ```sh
   npm install -g appium
   ```
6. Download [Appium Inspector](https://github.com/appium/appium-inspector/releases) (version 2 or higher).
7. Install necessary Appium drivers:
   ```sh
   appium driver install uiautomator2
   appium driver install xcuitest
   ```
8. Enable virtualization in BIOS ([video tutorial](https://www.youtube.com/watch?v=UgDxU0jZAe4)).
9. Connect an Android device to your computer with USB debugging enabled.
10. Verify the device connection by running:
    ```sh
    adb devices
    ```
11. In the Android configuration file (`config/wdio.android.conf.js`), set the `platformVersion`, `deviceName`, and the path to the `.apk` file to match your connected Android device.
12. Start Appium:
    ```sh
    appium
    ```
13. Open Appium Inspector and connect it to your device to interact with your apps.

### Linter

We use ESLint with the Prettier plugin to lint and auto-format TypeScript files. ESLint will auto-format code on every run.

### Test Structure

All test cases should be organized within the `test` folder. You can separate tests for different apps (e.g., `msb-app`) and define generic classes with getters and setters to reuse logic across classes.

This project follows the Page Object Pattern as outlined in the [WebdriverIO documentation](https://webdriver.io/docs/pageobjects.html). The main idea is to encapsulate page-specific logic into classes and utilize them in spec files to execute tests. For example, a `LoginPage` class defines elements as attributes, allowing for easy reuse throughout the code.
