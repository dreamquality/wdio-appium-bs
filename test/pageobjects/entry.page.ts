import { browser } from '@wdio/globals'
import Page from './page.js';

// const logo = "//*[contains(@resource-id, 'logo')]";
// const countryOfResidenceInputPicker = "//android.widget.EditText[@text='Enter country name']"
// const countryOptionSg = "//android.view.ViewGroup[@resource-id='country-selector-SG']"

const logo = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]"
const entryTitle = "//android.view.View[@content-desc='More than a swipe..']"
const signUpBtn = "//android.widget.Button[@content-desc='Sign Up']";
const signInWithFacebookBtn = "~Sign in with Facebook";
const signInWithPhoneNumberBtn = "~Sign in with Phone number";



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
    return browser.isAndroid ? await this.isElementDisplayed(entryTitle) : 
    await this.isElementDisplayed(entryTitleIos);
  }
  
  public async waitUntilEntryTitleDisplayed(element: string): Promise<void> {
    browser.isAndroid ? await this.waitUntilElementDisplayed(entryTitle) :
    await this.waitUntilElementDisplayed(element); //another locator is used due to original locator doesn't work
  }


  public async isSignUpButtonDisplayed(iosBtn: string): Promise<boolean> {
    return browser.isAndroid ? await this.isElementDisplayed(signUpBtn) :
    await this.isElementDisplayed(iosBtn);
  }

  public async waitUntilSignUpDisplayed(btnIos: string): Promise<void> {
    browser.isAndroid ? await this.waitUntilElementDisplayed(signUpBtn) :
    await this.waitUntilElementDisplayed(btnIos);
  }

  public async getSignUpButtonText( element: string): Promise<string> {
    return browser.isAndroid ? await this.getElementText(signUpBtn) :
    await this.getElementText(element);
  }
   
  public async clickSignUpButton( element: string): Promise<void> {
   browser.isAndroid ? await this.clickElement(signUpBtn) :
   await this.clickElement(element);
  }

  public async isSignUpBtnClickable( element: string): Promise<boolean> {
  return browser.isAndroid ? 
  await this.isElementClickable(signUpBtn) :
  await this.isElementClickable(element);
  }

  public async isSignInWithFacebookBtnDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(signInWithFacebookBtn);
  }

  public async waitUntilSignInWithFacebookBtnDisplayed(): Promise<void> {
    await this.waitUntilElementDisplayed(signInWithFacebookBtn);
  }

  public async getSignInWithFacebookBtnText(): Promise<string> {
    return this.getElementText(signInWithFacebookBtn);
  }

  public async clickSignInWithFacebookBtn(): Promise<void> {
    await this.clickElement(signInWithFacebookBtn);
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