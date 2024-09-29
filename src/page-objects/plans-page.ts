import { Locator, Page } from '@playwright/test';
import { PlansDetails } from './plans-details-component';

export class PlansPage {
  private readonly page: Page;

  // Locators
  private firstSimPlanButton: Locator;
  private storeTitle: Locator;
  private plansDetailsContainer: Locator;

  // Components
  private readonly plansDetails: PlansDetails;

  constructor(page: Page) {
    this.page = page;
    this.storeTitle = this.page.locator('#store-title');
    this.firstSimPlanButton = this.page.locator('.sim-item-link').first();

    this.plansDetailsContainer = this.page.getByTestId('sim-detail-header');
    this.plansDetails = new PlansDetails(this.plansDetailsContainer);
  }

  async getStoreTitle() {
    return this.storeTitle;
  }

  async clickFirstSimPlanButton() {
    await this.firstSimPlanButton.click();
  }

  async getPlanDetailsComponent() {
    return this.plansDetails;
  }
}
