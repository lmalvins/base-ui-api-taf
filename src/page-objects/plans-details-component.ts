import { Locator } from '@playwright/test';

export class PlansDetails {
  private readonly container: Locator
  private firstSimPlanButton: Locator;
  private planDetailsContainer: Locator;
  private planTitle: Locator;
  private planCoverage: Locator;
  private planData: Locator;
  private planValidity: Locator;
  private planPrice: Locator;

  constructor(container: Locator) {
    this.container = container;
    this.planTitle = this.container.getByTestId('sim-detail-operator-title');
    this.planCoverage = this.container.getByTestId('COVERAGE-value');
    this.planData = this.container.getByTestId('DATA-value');
    this.planValidity = this.container.getByTestId('VALIDITY-value');
    this.planPrice = this.container.getByTestId('PRICE-value');
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
