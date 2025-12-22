import { browser } from '@wdio/globals'
import allureReporter from '@wdio/allure-reporter'
import Page from './page.js';

// const logo = "//*[contains(@resource-id, 'logo')]";
// const countryOfResidenceInputPicker = "//android.widget.EditText[@text='Enter country name']"
// const countryOptionSg = "//android.view.ViewGroup[@resource-id='country-selector-SG']"

// const logo = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]"
const entryTitle = "//android.view.View[@content-desc='More than a swipe..']"
const signUpBtn = "//android.widget.Button[@content-desc='Sign Up']";
const signInWithFacebookBtn = "~Sign in with Facebook";
// const signInWithPhoneNumberBtn = "~Sign in with Phone number";



class Entry extends Page {
  
  // public async getIntoNativeContext(): Promise<void> {
  //   console.log(await browser.getContexts())
  //   const frameEl = await this.getElement(frame)
  //   await browser.switchContext("NATIVE_APP") // [ 'NATIVE_APP', 'WEBVIEW_Terrace' ]
  //   console.log("Current context is "+await browser.getContext())
  //   await frameEl.click()
  // }
  
  // public async getIntoWebContext(): Promise<void> {
  //   await browser.switchContext('WEBVIEW_Terrace');
  //   console.log("Current context is "+await browser.getContext())
  // }
  
  public async isEntryTitleDisplayed(entryTitleIos: string): Promise<boolean> {
    allureReporter.startStep('Check if entry title is displayed');
    try {
      const result = browser.isAndroid ? await this.isElementDisplayed(entryTitle) : 
        await this.isElementDisplayed(entryTitleIos);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }
  
  public async waitUntilEntryTitleDisplayed(element: string): Promise<void> {
    allureReporter.startStep('Wait until entry title is displayed');
    try {
      if (browser.isAndroid) {
        await this.waitUntilElementDisplayed(entryTitle, 10000); // Reduced from 20s to 10s
      } else {
        await this.waitUntilElementDisplayed(element, 10000); // Reduced from 20s to 10s
      }
      allureReporter.endStep();
    } catch (error) {
      console.log('Entry title wait timeout, app may still be loading');
      // Take a screenshot for debugging
      await this.takeDebugScreenshot('entry_title_wait_failed');
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async getEntryTitleText(entryTitleIos: string): Promise<string> {
    allureReporter.startStep('Get entry title text');
    try {
      const text = browser.isAndroid ? await this.getElementText(entryTitle) :
        await this.getElementText(entryTitleIos);
      allureReporter.endStep();
      return text;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async isEntryTitleClickable(entryTitleIos: string): Promise<boolean> {
    allureReporter.startStep('Check if entry title is clickable');
    try {
      const result = browser.isAndroid ? await this.isElementClickable(entryTitle) :
        await this.isElementClickable(entryTitleIos);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async isSignUpButtonDisplayed(iosBtn: string): Promise<boolean> {
    allureReporter.startStep('Check if sign up button is displayed');
    try {
      const result = browser.isAndroid ? await this.isElementDisplayed(signUpBtn) :
        await this.isElementDisplayed(iosBtn);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async waitUntilSignUpDisplayed(btnIos: string): Promise<void> {
    allureReporter.startStep('Wait until sign up button is displayed');
    try {
      if (browser.isAndroid) {
        await this.waitUntilElementDisplayed(signUpBtn, 10000); // Reduced from 20s to 10s
      } else {
        await this.waitUntilElementDisplayed(btnIos, 10000); // Reduced from 20s to 10s
      }
      allureReporter.endStep();
    } catch (error) {
      console.log('Sign up button wait timeout');
      // Take a screenshot for debugging
      await this.takeDebugScreenshot('signup_button_wait_failed');
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async getSignUpButtonText(element: string): Promise<string> {
    allureReporter.startStep('Get sign up button text');
    try {
      const text = browser.isAndroid ? await this.getElementText(signUpBtn) :
        await this.getElementText(element);
      allureReporter.endStep();
      return text;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }
   
  public async clickSignUpButton(element: string): Promise<void> {
    allureReporter.startStep('Click sign up button');
    try {
      if (browser.isAndroid) {
        await this.clickElement(signUpBtn);
      } else {
        await this.clickElement(element);
      }
      allureReporter.endStep();
    } catch (error) {
      console.log('Failed to click sign up button:', (error as Error).message);
      await this.takeDebugScreenshot('signup_click_failed');
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async isSignUpBtnClickable(element: string): Promise<boolean> {
    allureReporter.startStep('Check if sign up button is clickable');
    try {
      const result = browser.isAndroid ? 
        await this.isElementClickable(signUpBtn) :
        await this.isElementClickable(element);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async scrollSignUpButtonIntoView(element: string): Promise<void> {
    allureReporter.startStep('Scroll sign up button into view');
    try {
      if (browser.isAndroid) {
        await this.scrollElementIntoView(signUpBtn);
      } else {
        await this.scrollElementIntoView(element);
      }
      allureReporter.endStep();
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async isSignInWithFacebookBtnDisplayed(): Promise<boolean> {
    allureReporter.startStep('Check if sign in with Facebook button is displayed');
    try {
      const result = await this.isElementDisplayed(signInWithFacebookBtn);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async waitUntilSignInWithFacebookBtnDisplayed(): Promise<void> {
    allureReporter.startStep('Wait until sign in with Facebook button is displayed');
    try {
      await this.waitUntilElementDisplayed(signInWithFacebookBtn, 10000);
      allureReporter.endStep();
    } catch (error) {
      console.log('Sign in with Facebook button wait timeout');
      await this.takeDebugScreenshot('facebook_button_wait_failed');
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async getSignInWithFacebookBtnText(): Promise<string> {
    allureReporter.startStep('Get sign in with Facebook button text');
    try {
      const text = await this.getElementText(signInWithFacebookBtn);
      allureReporter.endStep();
      return text;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async clickSignInWithFacebookBtn(): Promise<void> {
    allureReporter.startStep('Click sign in with Facebook button');
    try {
      await this.clickElement(signInWithFacebookBtn);
      allureReporter.endStep();
    } catch (error) {
      console.log('Failed to click sign in with Facebook button:', (error as Error).message);
      await this.takeDebugScreenshot('facebook_click_failed');
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async isSignInWithFacebookBtnClickable(): Promise<boolean> {
    allureReporter.startStep('Check if sign in with Facebook button is clickable');
    try {
      const result = await this.isElementClickable(signInWithFacebookBtn);
      allureReporter.endStep();
      return result;
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async scrollSignInWithFacebookBtnIntoView(): Promise<void> {
    allureReporter.startStep('Scroll sign in with Facebook button into view');
    try {
      await this.scrollElementIntoView(signInWithFacebookBtn);
      allureReporter.endStep();
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  public async scrollEntryTitleIntoView(entryTitleIos: string): Promise<void> {
    allureReporter.startStep('Scroll entry title into view');
    try {
      if (browser.isAndroid) {
        await this.scrollElementIntoView(entryTitle);
      } else {
        await this.scrollElementIntoView(entryTitleIos);
      }
      allureReporter.endStep();
    } catch (error) {
      allureReporter.endStep('failed');
      throw error;
    }
  }

  // public async isInputDisplayed(index: number, element: string): Promise<boolean> {
  //   return browser.isAndroid ? 
  //   await this.isElementByIndexDisplayed(input, index) : 
  //   await this.isElementDisplayed(element);
  // }
  
  // public async waitUntilInputDisplayed(index: number, element: string): Promise<void> {
  //   browser.isAndroid ? await this.waitUntilElementByIndexDisplayed(input, index) :
  //   await this.waitUntilElementDisplayed(element);
  // }

  // public async getInputText(index: number, element: string): Promise<string> {
  //   return browser.isAndroid ?  
  //   await this.getElementByIndexText(input, index) : 
  //   await this.getElementText(element);
  // }

  // public async clickInput(index: number, element: string): Promise<void> {
  //   browser.isAndroid ? await this.clickElementByIndex(input, index) : 
  //   await this.clickElement(element);
  // }


  // public async scrollInputIntoView(index: number, element: string): Promise<void> {
  //   browser.isAndroid ? await this.scrollElementIntoViewByIndex(input, index) : 
  //   await this.scrollElementIntoView(element);
  // }

  // public async setInputValue(index: number, element: string, value: string): Promise<void> {
  //   //this.scrollInputIntoView(index, element);
  //   browser.isAndroid ? await this.setElementInputByIndexValue(input, index, value) : 
  //   await this.setElementInputValue(element, value);
  // }

  // public async isLinkDisplayed(index: number, element: string): Promise<boolean> {
  //   return browser.isAndroid ? await this.isElementByIndexDisplayed(text, index) :
  //   await this.isElementDisplayed(element);
  // }

  // public async waitUntilLinkDisplayed(index: number): Promise<void> {
  //   await this.waitUntilElementByIndexDisplayed(text, index);
  // }

  // public async getLinkText(index: number, element: string): Promise<string> {
  //   return browser.isAndroid ? await this.getElementByIndexText(text, index) : 
  //   await this.getElementText(element);
  // }

  // public async clickLink(index: number, element: string): Promise<void> {
  //   browser.isAndroid ? await this.clickElementByIndex(text, index) :
  //   await this.clickElement(element); 
  // }

  // public async isLabelDisplayed(index: number, element: string): Promise<boolean> {
  //   return browser.isAndroid ? await this.isElementByIndexDisplayed(text, index) :
  //   await this.isElementDisplayed(element);

  // }

  // public async getLabelText(index: number, element: string): Promise<string> {
  //   return browser.isAndroid ? await this.getElementByIndexText(text, index) :
  //   await this.getElementText(element);
  // }

  // public async waitUntilHeaderDisplayed(element: string): Promise<void> {
  //   browser.isAndroid ? await this.waitUntilElementDisplayed(group) :
  //   await this.waitUntilElementDisplayed(element);
  // }

  // public async isHeaderTitleDisplayed(): Promise<boolean> {
  //   return this.isElementByIndexDisplayed(text, 0);
  // }

  // public async getHeaderTitleText(): Promise<string> {
  //   return this.getElementByIndexText(text, 0);
  // }

  // public async isToggleDisplayed(index: number, element: string): Promise<boolean> {
  //   return browser.isAndroid ? await this.isElementByIndexDisplayed(toggle, index) :
  //   await this.isElementDisplayed(element);
  // }

  // public async waitUntilToggleDisplayed(index: number, element: string): Promise<void> {
  //  browser.isAndroid ? await this.waitUntilElementByIndexDisplayed(toggle, index) :
  //  await this.waitUntilElementDisplayed(element);
  // }

  // public async isHomeIconDisplayed(): Promise<boolean> {
  //   return browser.isAndroid ? await this.isElementDisplayed(homeIcon) :
  //   await this.isElementDisplayed(homeIconIos);

  // }

  // public async waitUntilHomeIconDisplayed(): Promise<void> {
  //   await this.waitUntilElementDisplayed(homeIcon);
  // }

  // public async clickHomeIcon(): Promise<void> {
  //   browser.isAndroid ? await this.clickElement(homeIcon) :
  //   await this.clickElement(homeIconIos);
  // }

  // public async takePhoto(): Promise<void> {
  //   if (browser.isAndroid) {
  //   await browser.pause(1000)
  //   await this.clickPhotoBtn()
  //   await browser.pause(1000)
  //   await this.clickPhotoBtn()
  //   }else {
  //   await browser.pause(4000)
  //   await this.clickPhotoBtnIos()
  //   await browser.pause(4000)
  //   await this.clickUsePhotoBtnIos()
  //   }
  // }

  // public async isHeaderBackButtonDisplayed(): Promise<boolean> {
  //   return browser.isAndroid ? await this.isElementDisplayed(backBtn) :
  //   await this.isElementDisplayed(backBtnIos);
  // }

  // public async waitUntilHeaderBackButtonDisplayed(): Promise<void> {
  //   browser.isAndroid ? await this.waitUntilElementDisplayed(backBtn) :
  //   await this.waitUntilElementDisplayed(backBtnIos);
  // }

  // public async clickHeaderBackButton(): Promise<void> {
  //   browser.isAndroid ? await this.clickElement(backBtn) : 
  //   await this.clickElement(backBtnIos);
  // }
}

export default new Entry()