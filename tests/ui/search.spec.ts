import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/ui/page-objects/home-page';
import { PlansPage } from '../../src/ui/page-objects/plans-page';

test.describe('Searching for a local eSIM plan', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await homePage.acceptCookies();
    await homePage.acceptNotifications();
  });

  test('Search and verify eSIM Moshi Moshi plan - 1GB 7days for Japan', async ({ page }) => {
    const homePage = new HomePage(page);
    let plansPage = new PlansPage(page);

    await test.step('Search for Japan in the search bar', async () => {
      await homePage.setSearchInput('Japan');
      await homePage.clickLocalCountry('Japan-name');
    });

    await test.step('Navigate to the first eSIM plan', async () => {
      plansPage = new PlansPage(page);

      await expect(await plansPage.getStoreTitle()).toBeVisible();
      await plansPage.clickFirstSimPlanButton();
    });

    await test.step('Verify eSIM plan details', async () => {
      expect.soft((await (await plansPage.getPlanDetailsComponent()).getPlanTitleText())?.trim()).toBe('Moshi Moshi');
      expect.soft(await (await plansPage.getPlanDetailsComponent()).getPlanCoverageText()).toBe('Japan');
      expect.soft(await (await plansPage.getPlanDetailsComponent()).getPlanDataText()).toBe('1 GB');
      expect.soft(await (await plansPage.getPlanDetailsComponent()).getPlanValidityText()).toBe('7 days');
      expect.soft(await (await plansPage.getPlanDetailsComponent()).getPlanPriceText()).toBe('$4.50');
    });
  });
});
