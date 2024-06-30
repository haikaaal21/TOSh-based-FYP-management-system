const { test, expect } = require('@playwright/test');
const { describe, beforeEach } = require('node:test');

describe('Event Creation Test Cases', () => {
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
        await page.getByRole('button', { name: 'Events' }).click();
    });

    test('Create an event with valid details', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new event' }).click();
        await page.getByLabel('Event Title').click();
        await page.getByLabel('Event Title').fill('New Event');
        await page.getByLabel('Event Description').click();
        await page.getByLabel('Event Description').fill('New cool event!');
        await page.getByLabel('Choose date').click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '3', exact: true }).click();
        await page.getByLabel('Choose time').click();
        await page.getByLabel('8 hours').click();
        await page.getByLabel('30 minutes').click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByLabel('Event Location Embed').click();
        await page.getByLabel('Event Location Embed').fill('placeholderlocationembed');
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('button', { name: 'Add a speaker' }).click();
        await page.getByLabel('Full Name').click();
        await page.getByLabel('Full Name').fill('cool speaker');
        await page.getByLabel('Biography').click();
        await page.getByLabel('Biography').fill('cool speaker');
        await page.getByLabel('Email').click();
        await page.getByLabel('Email').fill('coolspeakermail');
        await page.getByRole('button', { name: 'Add speaker' }).click();
        await expect(page.getByRole('heading', { name: 'cool speaker' })).toBeVisible();
        await page.getByRole('button', { name: 'Forward' }).click();
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'A242' }).click();
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: 'Arya Ardiandamar' }).click();
        await page.getByLabel('Close').click();
        await page.getByRole('button', { name: 'Create Event' }).click();
        await expect(page.getByText('Event Created Successfully!')).toBeVisible();
    });

    test('Create an event with empty speaker details', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new event' }).click();
        await page.getByLabel('Event Title').click();
        await page.getByLabel('Event Title').fill('New Event');
        await page.getByLabel('Event Description').click();
        await page.getByLabel('Event Description').fill('New cool event!');
        await page.getByLabel('Choose date').click();
        await page.getByLabel('Next month').click();
        await page.getByRole('gridcell', { name: '3', exact: true }).click();
        await page.getByLabel('Choose time').click();
        await page.getByLabel('8 hours').click();
        await page.getByLabel('30 minutes').click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByLabel('Event Location Embed').click();
        await page.getByLabel('Event Location Embed').fill('placeholderlocationembed');
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('button', { name: 'Forward' }).click();
        await expect(page.getByText('Are you sure you want to')).toBeVisible();
        await page.getByRole('button', { name: 'Yes' }).click();
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'A242' }).click();
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: 'Arya Ardiandamar' }).click();
        await page.getByLabel('Close').click();
        await page.getByRole('button', { name: 'Create Event' }).click();
        await expect(page.getByText('Event Created Successfully!')).toBeVisible();
    });

    test('Create an event with date and time before current date and time', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new event' }).click();
        await page.getByLabel('Event Title').click();
        await page.getByLabel('Event Title').fill('cool event before today');
        await page.getByLabel('Event Description').click();
        await page.getByLabel('Event Description').fill('very cool');
        await page.getByLabel('Choose date').click();
        await page.getByRole('gridcell', { name: '20' }).click();
        await page.getByLabel('Choose time').click();
        await page.getByLabel('3 hours').click();
        await page.getByLabel('PM').click();
        await page.getByLabel('Event Location Embed').click();
        await page.getByLabel('Event Location Embed').fill('coollocationembed');
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByText('Date or time cannot be before today')).toBeVisible();

    });

    test('Create an event with empty description', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new event' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.locator('div').filter({ hasText: /^Event TitleEvent TitleThis field is required$/ }).getByRole('paragraph')).toBeVisible();
        await expect(page.locator('div').filter({ hasText: /^Event DescriptionEvent DescriptionThis field is required$/ }).getByRole('paragraph')).toBeVisible();
        await expect(page.getByText('Date or time cannot be empty')).toBeVisible();
        await expect(page.locator('div').filter({ hasText: /^Event Location EmbedEvent Location EmbedThis field is required$/ }).getByRole('paragraph')).toBeVisible();
    });
});