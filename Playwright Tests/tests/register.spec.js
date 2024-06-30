const { test, expect } = require('@playwright/test');
const { describe, beforeEach } = require('node:test');

describe('Account Registration Test Cases', () => {
    
    beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto('https://spares.work/');
    });    

    //? #SPARES05
    test('TCTosh-05: Register with valid credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'I agree' }).click();
        await page.getByRole('button', { name: 'Get Started' }).click();
        await expect(page).toHaveURL('https://spares.work/register');

        await page.getByLabel('First Name *').click();
        await page.getByLabel('First Name *').fill('Playwright');
        await page.getByLabel('Last Name *').click();
        await page.getByLabel('Last Name *').fill('Tester');
        await page.getByLabel('Email *').click();
        await page.getByLabel('Email *').fill('playwrighttester100602@gmail.com');
        await page.getByLabel('Password *', { exact: true }).click();
        await page.getByLabel('Password *', { exact: true }).fill('playwright1Rulz_');
        await page.getByLabel('Confirm Password *').click();
        await page.getByLabel('Confirm Password *').fill('playwright1Rulz_');
        await page.getByPlaceholder('MM/DD/YYYY').click();
        await page.getByPlaceholder('MM/DD/YYYY').fill('01/01/1997');
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: 'Universiti Utara Malaysia' }).click();
        await page.getByLabel('Matric Number/Student ID *').click();
        await page.getByLabel('Matric Number/Student ID *').fill('123456');
        await page.getByLabel('Staff').check();
        await page.getByLabel('Supervisor').check();
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.getByRole('heading', { name: 'Account creation successful' })).toBeVisible();
    });

    //? #SPARES06
    test('TCTosh-06: Register with Valid Credentials and already existing email', async({page}) => {
        await page.getByRole('button', { name: 'I agree' }).click();
        await page.getByRole('button', { name: 'Get Started' }).click();
        await expect(page).toHaveURL('https://spares.work/register');
        
        await page.getByLabel('First Name *').click();
        await page.getByLabel('First Name *').fill('Playright');
        await page.getByLabel('Last Name *').click();
        await page.getByLabel('Last Name *').fill('Tester');
        await page.getByLabel('Email *').click();
        await page.getByLabel('Email *').fill('haikaaal21@gmail.com');
        await page.getByLabel('Password *', { exact: true }).click();
        await page.getByLabel('Password *', { exact: true }).fill('pl4ywrightRulz_');
        await page.getByLabel('Confirm Password *').click();
        await page.getByLabel('Confirm Password *').fill('pl4ywrightRulz_');
        await page.getByPlaceholder('MM/DD/YYYY').click();
        await page.getByPlaceholder('MM/DD/YYYY').fill('01/01/1998');
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByText('Email already exists')).toBeVisible();
    })
    
});

