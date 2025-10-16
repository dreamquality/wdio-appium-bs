import { browser, $, $$ } from '@wdio/globals'
import path from 'path'
import fs from 'fs'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

export default class Page {

    async open(path: string) {
      await browser.url(path);
    }

    public async getElement(element: string) {
      return await $(element);
    }
  
    public async getAllElements(element: string) {
      return await $$(element);
    }
  
    public async getListSize(element: string): Promise<number> {
      const elements = await this.getAllElements(element);
      return elements.length;
    }
  
    public async getPageHTML(element: string): Promise<string> {
      const outerHTML = await this.getElement(element);
      return outerHTML.getHTML();
    }
  
    public async getElementByIndex(element: string, index: number) {
      const elements = await this.getAllElements(element); 
      return elements[index]; 
    }
  
    public async isElementDisplayed(element: string): Promise<boolean> {
      try {
        const elem = await this.getElement(element);
        return await elem.isDisplayed();
      } catch (error) {
        // Element not found or not displayed
        return false;
      }
    }
  
    public async isElementClickable(element: string): Promise<boolean> {
      try {
        const elem = await this.getElement(element);
        return await elem.isClickable();
      } catch (error) {
        // Element not found or not clickable
        return false;
      }
    }
  
    public async isElementByIndexDisplayed(element: string, index: number): Promise<boolean> {
      try {
        const elem = await this.getElementByIndex(element, index);
        return await elem.isDisplayed();
      } catch (error) {
        // Element not found or not displayed
        return false;
      }
    }
  
    public async isElementByIndexClickable(element: string, index: number): Promise<boolean> {
      try {
        const elem = await this.getElementByIndex(element, index);
        return await elem.isClickable();
      } catch (error) {
        // Element not found or not clickable
        return false;
      }
    }
  
  
    public async waitUntilElementDisplayed(element: string, timeout: number = 30000): Promise<void> {
      try {
        await browser.waitUntil(async () => {
          try {
            return await this.isElementDisplayed(element);
          } catch (error) {
            return false;
          }
        }, {
          timeout,
          timeoutMsg: `Element ${element} not displayed within ${timeout}ms`,
          interval: 1000
        });
      } catch (error) {
        console.log(`Failed to wait for element ${element}:`, (error as Error).message);
        throw error;
      }
    }
  
    public async waitUntilElementByIndexDisplayed(element: string, index: number, timeout: number = 30000): Promise<void> {
      try {
        await browser.waitUntil(async () => {
          try {
            return await this.isElementByIndexDisplayed(element, index);
          } catch (error) {
            return false;
          }
        }, {
          timeout,
          timeoutMsg: `Element ${element}[${index}] not displayed within ${timeout}ms`,
          interval: 1000
        });
      } catch (error) {
        console.log(`Failed to wait for element ${element}[${index}]:`, (error as Error).message);
        throw error;
      }
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
  
    public async clickElement(element: string, retries: number = 3): Promise<void> {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await this.waitUntilElementDisplayed(element);
          const elem = await this.getElement(element);
          
          // Wait for element to be clickable
          await browser.waitUntil(async () => {
            try {
              return await elem.isClickable();
            } catch (error) {
              return false;
            }
          }, {
            timeout: 10000,
            timeoutMsg: `Element ${element} not clickable within 10s`,
            interval: 500
          });
          
          await elem.click();
          console.log(`Successfully clicked element ${element} on attempt ${attempt}`);
          return; // Success
        } catch (error) {
          console.log(`Click attempt ${attempt}/${retries} failed for ${element}:`, (error as Error).message);
          
          if (attempt === retries) {
            throw new Error(`Failed to click element ${element} after ${retries} attempts: ${(error as Error).message}`);
          }
          
          // Wait before retry
          await browser.pause(1000);
        }
      }
    }
  
    public async clickElementByIndex(element: string, index: number, retries: number = 3): Promise<void> {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await this.waitUntilElementByIndexDisplayed(element, index);
          const elem = await this.getElementByIndex(element, index);
          
          // Wait for element to be clickable
          await browser.waitUntil(async () => {
            try {
              return await elem.isClickable();
            } catch (error) {
              return false;
            }
          }, {
            timeout: 10000,
            timeoutMsg: `Element ${element}[${index}] not clickable within 10s`,
            interval: 500
          });
          
          await elem.click();
          console.log(`Successfully clicked element ${element}[${index}] on attempt ${attempt}`);
          return; // Success
        } catch (error) {
          console.log(`Click attempt ${attempt}/${retries} failed for ${element}[${index}]:`, (error as Error).message);
          
          if (attempt === retries) {
            throw new Error(`Failed to click element ${element}[${index}] after ${retries} attempts: ${(error as Error).message}`);
          }
          
          // Wait before retry
          await browser.pause(1000);
        }
      }
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
  
    public async waitForAlertText(expectedText: string): Promise<void> {
        await browser.waitUntil(async () => {
           const text = await browser.getAlertText();
           return text.includes(expectedText)
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
  
    async alertAction(expectedText: string, action: string): Promise<void> {
    await this.waitForAlertText(expectedText);
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

    /**
     * Safely get element with retry mechanism
     */
    public async getElementSafely(element: string, timeout: number = 10000) {
      try {
        await this.waitUntilElementDisplayed(element, timeout);
        return await this.getElement(element);
      } catch (error) {
        console.log(`Element ${element} not found:`, (error as Error).message);
        return null;
      }
    }

    /**
     * Smart wait for any of multiple elements to appear
     */
    public async waitForAnyElement(elements: string[], timeout: number = 30000): Promise<string | null> {
      try {
        return await browser.waitUntil(async () => {
          for (const element of elements) {
            try {
              const isDisplayed = await this.isElementDisplayed(element);
              if (isDisplayed) {
                return element;
              }
            } catch (error) {
              // Continue checking other elements
            }
          }
          return false;
        }, {
          timeout,
          timeoutMsg: `None of the elements ${elements.join(', ')} appeared within ${timeout}ms`,
          interval: 1000
        });
      } catch (error) {
        console.log('No elements found:', elements);
        return null;
      }
    }

    /**
     * Enhanced screenshot method with timestamp
     */
    public async takeDebugScreenshot(name: string = 'debug'): Promise<string> {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const screenshotPath = path.join(process.cwd(), 'reporters', 'screenshots', filename);
      
      // Ensure directory exists
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await browser.saveScreenshot(screenshotPath);
      console.log(`Debug screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    }

    // async getOrientation(): Promise<'PORTRAIT' | 'LANDSCAPE'> {
    //   return await browser.getOrientation();
    // }

  }
  