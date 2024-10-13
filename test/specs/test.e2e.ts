import { expect, browser } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter'
import entry from '../pageobjects/entry.page.js';

const signUpBtnIos = "~just-example";
const entryTitleIos = "~just-example-label";

describe('My Login application', () => {
    before(async () => {
        allureReporter.addFeature('Entry Page');
        allureReporter.addStory('Watching entry page');
    });


    it('should sign up with valid credentials', async () => {
        await browser.pause(5000);
        allureReporter.startStep('Checking entry title is displayed');
        await expect(await entry.isEntryTitleDisplayed(entryTitleIos)).toBe(false);
        allureReporter.endStep();

        allureReporter.startStep('Checking sign up button is displayed');
        await expect(await entry.isSignUpButtonDisplayed(signUpBtnIos)).toBe(false);
        allureReporter.endStep();

        allureReporter.startStep('Clicking sign up button');
        await entry.clickSignUpButton(signUpBtnIos);
        await browser.pause(5000);
        allureReporter.endStep();
    });
});
