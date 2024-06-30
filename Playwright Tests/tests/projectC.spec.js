const { expect } = require("@playwright/test");

describe('Project creation Test Cases', () => {

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
        await page.getByRole('button', { name: 'Projects' }).click();
    });

    test('TCTosh-15: Create a project with valid details', async ({ page }) => {
        await page.getByRole('button', { name: 'Create a new project' }).click();
        await expect(page.url()).toMatch('https://spares.work/project/create');
        await page.locator('input[name="title"]').click();
        await page.locator('input[name="title"]').fill('Cool new project');
        await page.locator('textarea[name="description"]').click();
        await page.locator('textarea[name="description"]').fill('Cool new project');
        await page.getByLabel('Clear').click();
        await page.locator('input[name="type"]').click();
        await page.locator('input[name="type"]').fill('IoT');
        await page.getByLabel('', { exact: true }).click();
        await page.getByRole('option', { name: 'A251' }).click();
        await page.getByRole('textbox').nth(2).click();
        await page.getByRole('textbox').nth(2).fill('cool new IoT project');
        await page.getByRole('button', { name: 'Create Project' }).click();
        await expect(page.getByText('Your project has been created')).toBeVisible();
    });

    test('TCTosh-16: Create a project with valid details but empty markdown', async ({page}) => {
        await page.getByRole('button', { name: 'Create a new project' }).click();
        await expect(page.url()).toMatch('https://spares.work/project/create');
        await page.locator('input[name="title"]').click();
        await page.locator('input[name="title"]').fill('Cool new project without markup');
        await page.locator('textarea[name="description"]').click();
        await page.locator('textarea[name="description"]').fill('cool new project without markup');
        await page.locator('input[name="type"]').click();
        await page.locator('input[name="type"]').fill('IoT');
        await page.getByLabel('', { exact: true }).click();
        await page.getByRole('option', { name: 'A251' }).click();
        await page.getByRole('textbox').nth(2).click();
        await page.getByRole('textbox').nth(2).fill('cool new project without markdown I meant');
        await page.getByRole('button', { name: 'Create Project' }).click();
        await expect(page.getByText('Your project has been created')).toBeVisible();
    })

    test('TCTosh-17: Create a project with empty details', async({page}) => {
        await page.getByRole('button', { name: 'Create a new project' }).click();
        await expect(page.url()).toMatch('https://spares.work/project/create');
        await page.getByRole('button', { name: 'Create Project' }).click();
        await expect(page.getByText('This field is required').first()).toBeVisible();
        await expect(page.getByText('This field is required').nth(1)).toBeVisible();
        await expect(page.getByText('This field is required').nth(2)).toBeVisible();
        await expect(page.getByText('This field is required').nth(3)).toBeVisible();
    })

    test('TCTosh-18: Approve a request to get into a project', async ({ page }) => {
        await page.getByRole('button', { name: 'Automated Customer Support' }).click();
        await page.getByRole('button', { name: 'Show Requests' }).click();
        await page.getByRole('button', { name: 'Accept Request' }).first().click();
        await expect(page.getByText('Request Accepted/Declined')).toBeVisible();
    });

});