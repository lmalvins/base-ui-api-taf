import { Locator, Page } from '@playwright/test';

export class PlansPage {
  private readonly page: Page;
  private firstSimPlanButton: Locator;
  private storeTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.storeTitle = this.page.locator('#store-title');
    this.firstSimPlanButton = this.page.locator('.sim-item-link').first();
  }

  async getStoreTitle() {
    return this.storeTitle;
  }

  async clickFirstSimPlanButton() {
    await this.firstSimPlanButton.click();
  }
}
