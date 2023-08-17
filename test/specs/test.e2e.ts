import { expect, browser } from '@wdio/globals'
import entry from '../pageobjects/entry.page.js'


const signUpBtnIos = "~just-example";
const entryTitleIos = "~just-example-label";


describe('My Login application', () => {
    it('should sign up with valid credentials', async () => {
        await browser.pause(5000)
        expect(await entry.isEntryTitleDisplayed(entryTitleIos)).true;
        expect(await entry.isSignUpButtonDisplayed(signUpBtnIos)).true;
        // expect(await entry.getSignUpButtonText(signUpBtnIos)).toEqual("Sign up"); // element has no text 
        await entry.clickSignUpButton(signUpBtnIos);
 
        
    })


})

