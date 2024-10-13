import { browser, $, $$ } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

export default class Page {

    async open(path: string) {
      await browser.url(path);
    }

    public async getElement(element: string): Promise<WebdriverIO.Element> {
      return $(element);
    }
  
    public async getAllElements(element: string): Promise<WebdriverIO.Element[]> {
      return $$(element);
    }
  
    public async getListSize(element: string): Promise<number> {
      const elements = await this.getAllElements(element);
      return elements.length;
    }
  
    public async getPageHTML(element: string): Promise<string> {
      const outerHTML = await this.getElement(element);
      return outerHTML.getHTML();
    }
  
    public async getElementByIndex(element: string, index: number): Promise<WebdriverIO.Element> {
      const elements = await this.getAllElements(element); 
      return elements[index]; 
    }
  
    public async isElementDisplayed(element: string): Promise<boolean> {
      const elem = await this.getElement(element);
      return elem.isDisplayed()
    }
  
    public async isElementClickable(element: string): Promise<boolean> {
      const elem = await this.getElement(element);
      return elem.isClickable()
    }
  
    public async isElementByIndexDisplayed(element: string, index: number): Promise<boolean> {
      const elem = await this.getElementByIndex(element, index);
      return elem.isDisplayed()
    }
  
    public async isElementByIndexClickable(element: string, index: number): Promise<boolean> {
      const elem = await this.getElementByIndex(element, index);
      return elem.isClickable()
    }
  
  
    public async waitUntilElementDisplayed(element: string): Promise<void> {
     await browser.waitUntil(() => {
        return this.isElementDisplayed(element);
      });
    }
  
    public async waitUntilElementByIndexDisplayed(element: string, index: number) {
     await browser.waitUntil(() => {
        return this.isElementByIndexDisplayed(element, index);
      });
    }

    async waitForElement(element: WebdriverIO.Element, timeout: number = 10000) {
      await element.waitForDisplayed({ timeout });
    }
  
    public async getElementText(element: string): Promise<string> {
      await this.waitUntilElementDisplayed(element);
      const elem = await this.getElement(element);
      return elem.getText();
    }
  
    public async getElementByIndexText(element: string, index: number): Promise<string> {
      await this.waitUntilElementByIndexDisplayed(element, index);
      const elem = await this.getElementByIndex(element, index);
      return elem.getText();
    }
  
    public async setElementInputValue(element: string, value: string): Promise<void> {
      await this.waitUntilElementDisplayed(element);
      const elem = await this.getElement(element);
      await elem.setValue(value);
    }
  
    public async setElementInputByIndexValue(element: string, index: number, value: string): Promise<void> {
      await this.waitUntilElementByIndexDisplayed(element, index);
      const elem = await this.getElementByIndex(element, index);
      await elem.setValue(value);
    }
  
    public async clickElement(element: string): Promise<void> {
      await this.waitUntilElementDisplayed(element);
      const elem = await this.getElement(element);
      await elem.click();
    }
  
    public async clickElementByIndex(element: string, index: number): Promise<void> {
      await this.waitUntilElementByIndexDisplayed(element, index);
      const elem = await this.getElementByIndex(element, index);
      await elem.click();
    }
  
    public async scrollElementIntoViewByIndex(element: string, index: number): Promise<void> {
      const elem = await this.getElementByIndex(element, index);
      await elem.scrollIntoView();
    }
  
    public async scrollElementIntoView(element: string): Promise<void> {
      const elem = await this.getElement(element);
      await elem.scrollIntoView();
    }
  
  
    public async hideKeyboard(): Promise<void> {
     await browser.pressKeyCode(4);
    }
  
    public async waitForAlert(): Promise<void> {
     await browser.waitUntil(() => {
        return browser.getAlertText() !== null;
      });
    }
  
    public async waitNoAlert(): Promise<void> {
     await browser.waitUntil(() => {
        return browser.getAlertText() == null;
      });
    }
  
    public async getAlertText(): Promise<string|undefined> {
      if (browser.isMobile) {
        await this.waitForAlert();
        return browser.getAlertText();
      }
    }
  
    public async waitForAlertText(text: string): Promise<void> {
        await browser.waitUntil(async () => {
           const text = await browser.getAlertText();
           return text.includes(text)
         });
       }
  
    public async clickAcceptAlert(): Promise<void> {
      if (browser.isMobile) {
        if (browser.isAndroid) {
          await this.waitForAlert();
          await browser.acceptAlert();
        }
        if (browser.isIOS) {
          await this.waitForAlert();
          await browser.dismissAlert();
        }
      }
    }
  
    public async clickCancelAlert(): Promise<void> {
      if (browser.isMobile) {
        if (browser.isAndroid) {
            await this.waitForAlert();
            await browser.dismissAlert();
        }
        if (browser.isIOS) {
            await this.waitForAlert();
            await browser.acceptAlert();
        }
      }
    }
  
    async alertAction(text: string, action: string): Promise<void> {
    await this.waitForAlertText(text);
      if (action == "accept") {
        await this.clickAcceptAlert();
      } else {
        await this.clickCancelAlert();
      }
    }
  
    public async clickAndroidBackBtn(): Promise<void> {
      await browser.pressKeyCode(4);
    }

    public async swipeUp(): Promise<void> {
      const { height, width } = await browser.getWindowSize();
      const startX = width / 2;
      const startY = height * 0.8;
      const endY = height * 0.2;
      await browser.touchAction([
          { action: 'press', x: startX, y: startY },
          { action: 'wait', ms: 500 },
          { action: 'moveTo', x: startX, y: endY },
          'release'
      ]);
    }

      public async swipeDown(): Promise<void> {
        const { height, width } = await browser.getWindowSize();
        const startX = width / 2;
        const startY = height * 0.2;
        const endY = height * 0.8;
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: startX, y: endY },
            'release'
        ]);
    }

    public async longTap(x: number, y: number) {
      await browser.touchAction([
          { action: 'press', x, y },
          { action: 'wait', ms: 1000 },
          'release'
      ]);
    }

    public async setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE'): Promise<void> {
        await browser.setOrientation(orientation);
    }

    // async getOrientation(): Promise<'PORTRAIT' | 'LANDSCAPE'> {
    //   return await browser.getOrientation();
    // }

  }
  