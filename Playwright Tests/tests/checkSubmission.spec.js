const { default: test } = require("node:test");

describe('Check submissions test case', () => {

    beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto('https://spares.work/');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByLabel('Email').click();
        await page.getByLabel('Email').fill('haikaaal21@gmail.com');
        await page.getByLabel('Password').click();
        await page.getByLabel('Password').fill('Maling21!');
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.goto('https://spares.work/staff/deadlines');
    });

    test('TCTosh-14: Check submissions', async({page}) => {
        await page.getByRole('button', { name: 'FYP Research paper From: You' }).click();
        await expect(page.getByRole('button', { name: 'Arya Ardiandamar' })).toBeVisible();
        await page.getByRole('button', { name: 'Arya Ardiandamar' }).click();
        await expect(page.getByRole('link', { name: 'pengesahan.pdf application/pdf' })).toBeVisible();
    })

});