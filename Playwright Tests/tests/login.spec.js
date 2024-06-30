const { test, expect } = require('@playwright/test');
const { describe, beforeEach } = require('node:test');

describe('Login and Authentication Test Cases', () => {

    beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto('https://spares.work/');
    });
    
    //? #SPARES01
    test('TCTosh-01 :Test login with valid credentials', async ({ page }) => {
        const agreeButton = page.locator('text=I agree');
        await expect(agreeButton).toBeVisible();
        await agreeButton.click();

        const loginButton = page.locator('text=login');
        await expect(loginButton).toBeVisible();
        await loginButton.click();

        await expect(page).toHaveURL('https://spares.work/login');
        await page.fill('input[name="email"]', 'haikaluwu22@gmail.com');
        await page.fill('input[name="password"]', 'Maling21!');
        const loginLoginButton = page.locator('text=Log in');
        await loginLoginButton.click();
        await page.waitForNavigation();
        await expect(page).toHaveURL('https://spares.work/student');
    });

    //? #SPARES02
    test('TCTosh-02 :Test login with invalid credentials', async ({ page }) => {
        const agreeButton = page.locator('text=I agree');
        await expect(agreeButton).toBeVisible();
        await agreeButton.click();

        const loginButton = page.locator('text=login');
        await expect(loginButton).toBeVisible();
        await loginButton.click();

        await expect(page).toHaveURL('https://spares.work/login');
        await page.fill('input[name="email"]', 'orangkeren224@mail.com'); 
        await page.fill('input[name="password"]', 'c00l!!MBeans!');
        const loginLoginButton = page.locator('text=Log in');
        await loginLoginButton.click();
        await page.waitForSelector('text=Incorrect Email or Password!');
    })

    //? #SPARES03
    test('TCTosh-03 :Test login with unverified account', async({page}) => {
        await page.getByRole('button', { name: 'I agree' }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByLabel('Email').click();
        await page.getByLabel('Email').fill('haikaluwu21@gmail.com');
        await page.getByLabel('Password').click();
        await page.getByLabel('Password').fill('Maling21!');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page.getByText('Account has not been Verified!')).toBeVisible();
    })

    //? #SPARES04
    test('TCTosh-04 :Test login directly through URL', async({page}) => {
        await page.goto('https://spares.work/staff');
        await page.waitForNavigation();
        await expect(page).toHaveURL('https://spares.work/login');

        await page.goto('https://spares.work/student');
        await page.waitForNavigation();
        await expect(page).toHaveURL('https://spares.work/login');
    })

})