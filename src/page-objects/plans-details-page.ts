import { Locator, Page } from '@playwright/test';

export class PlansDetailsPage {
  private readonly page: Page;
  private firstSimPlanButton: Locator;
  private planDetailsContainer: Locator;
  private planTitle: Locator;
  private planCoverage: Locator;
  private planData: Locator;
  private planValidity: Locator;
  private planPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.planDetailsContainer = this.page.getByTestId('sim-detail-header');
    this.planTitle = this.page.getByTestId('sim-detail-operator-title');
    this.planCoverage = this.planDetailsContainer.getByTestId('COVERAGE-value');
    this.planData = this.planDetailsContainer.getByTestId('DATA-value');
    this.planValidity = this.planDetailsContainer.getByTestId('VALIDITY-value');
    this.planPrice = this.planDetailsContainer.getByTestId('PRICE-value');
  }

  async getPlanTitleText() {
    return await this.planTitle.textContent();
  }

  async getPlanCoverageText() {
    return (await this.planCoverage.textContent())?.trim();
  }

  async getPlanDataText() {
    return (await this.planData.textContent())?.trim();
  }

  async getPlanValidityText() {
    return (await this.planValidity.textContent())?.trim();
  }

  async getPlanPriceText() {
    return (await this.planPrice.textContent())?.trim();
  }
}
