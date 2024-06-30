const { test, expect } = require('@playwright/test');
const { describe, beforeEach } = require('node:test');

describe('Task Creation Test Cases', () => {
    beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto('https://spares.work/');
        await page.getByRole('button', { name: 'I agree' }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByLabel('Email').click();
        await page.getByLabel('Email').fill('haikaaal21@gmail.com');
        await page.getByLabel('Password').click();
        await page.getByLabel('Password').press('CapsLock');
        await page.getByLabel('Password').fill('Maling21!');
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.getByRole('button', { name: 'Deadlines' }).click();
    });

    test('TCTosh-07: Task creation with valid date-time and description', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new Task' }).click();
        await expect(page.url()).toMatch('https://spares.work/task/create');
        await page.getByLabel('Task name *').click();
        await page.getByLabel('Task name *').fill('New Task');
        await page.locator('div:nth-child(2) > .MuiInputBase-root').click();
        await page.getByLabel('Task description *').fill('New Task');
        await page.locator('div').filter({ hasText: /^Yellow Zone$/ }).getByLabel('Choose date').click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '10' }).click();
        await page.locator('div').filter({ hasText: /^Red Zone$/ }).getByLabel('Choose date').click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '13' }).click();
        await page.getByLabel('Choose date', { exact: true }).click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '16' }).click();
        await page.getByRole('button', { name: 'Create task' }).click();
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'A242' }).click();
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: 'Arya Ardiandamar' }).click();
        await page.getByLabel('Close').click();
        await page.getByRole('button', { name: 'Create Task' }).click();
        await expect(page.getByText('Task Created Successfully!')).toBeVisible();
    });

    test('TCTosh-08: Task creation with invalid date-time and description', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new Task' }).click();
        await expect(page.url()).toMatch('https://spares.work/task/create');
        await page.getByLabel('Task name *').click();
        await page.getByLabel('Task name *').fill('yu');
        await page.getByLabel('Task description *').click();
        await page.getByLabel('Task description *').fill('iy');
        await page.locator('div').filter({ hasText: /^Yellow Zone$/ }).getByLabel('Choose date').click();
        await page.getByRole('gridcell', { name: '20' }).click();
        await page.locator('div').filter({ hasText: /^Red Zone$/ }).getByLabel('Choose date').click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '9', exact: true }).click();
        await page.getByLabel('Choose date', { exact: true }).click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '4', exact: true }).click();
        await page.getByRole('button', { name: 'Create task' }).click();
        await expect(page.getByText('Invalid date order')).toBeVisible();
        await expect(page.getByText('This field must be at least 3').first()).toBeVisible();
        await expect(page.getByText('This field must be at least 3').nth(1)).toBeVisible();
    });

    test('TCTosh-09: Task creation with empty date-time and description', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new Task' }).click();
        await expect(page.url()).toMatch('https://spares.work/task/create');
        await page.getByRole('button', { name: 'Create task' }).click();
        await expect(page.getByText('This field is required').first()).toBeVisible();
        await expect(page.getByText('This field is required').nth(1)).toBeVisible();
        await expect(page.getByText('Some dates are still empty')).toBeVisible();
    });
})