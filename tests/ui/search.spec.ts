import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/page-objects/home-page';
import { PlansPage } from '../../src/page-objects/plans-page';
import { PlansDetailsPage } from '../../src/page-objects/plans-details-page';

test.describe('Searching for a local eSIM plan', () => {
  let homePage : HomePage
  let plansPage: PlansPage
  let plansDetailPage: PlansDetailsPage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.acceptCookies();
    await homePage.acceptNotifications();
  });

  test('Search and verify eSIM Moshi Moshi plan - 1GB 7days for Japan', async ({ page }) => {

    await test.step('Search for Japan in the search bar', async () => {
      await homePage.setSearchInput('Japan');
      await homePage.clickLocalCountry('Japan-name');
    });

    await test.step('Navigate to the first eSIM plan', async () => {
      plansPage = new PlansPage(page);

      await expect(await plansPage.getStoreTitle()).toBeVisible();
      await plansPage.clickFirstSimPlanButton()
    });

    await test.step('Verify eSIM plan details', async () => {
      plansDetailPage = new PlansDetailsPage(page);

      expect.soft((await plansDetailPage.getPlanTitleText())?.trim()).toBe("Moshi Moshi");
      expect.soft(await plansDetailPage.getPlanCoverageText()).toBe("Japan");
      expect.soft(await plansDetailPage.getPlanDataText()).toBe("1 GB");
      expect.soft(await plansDetailPage.getPlanValidityText()).toBe("7 days");
      expect.soft(await plansDetailPage.getPlanPriceText()).toBe("$4.50");
    });
  });
});
