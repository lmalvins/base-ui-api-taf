import { Locator, Page } from '@playwright/test';
import logger from '../utils/logger';

export class HomePage {
  private readonly page: Page;
  private searchInput: Locator;
  private acceptCookiesButton: Locator;
  private acceptNotificationsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = this.page.getByTestId('search-input');
    this.acceptCookiesButton = this.page.locator(
      '#onetrust-accept-btn-handler'
    );
    this.acceptNotificationsButton = this.page.locator('#wzrk-confirm');
  }

  async navigate() {
    await this.page.goto('https://www.airalo.com/');
  }

  async setSearchInput(text: string) {
    await this.searchInput.fill(text);
  }

  async acceptCookies() {
    try {
      await this.acceptCookiesButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });
      await this.acceptCookiesButton.click();
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async acceptNotifications() {
    try {
      await this.acceptNotificationsButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });
      await this.acceptNotificationsButton.click();
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async clickLocalCountry(text: string) {
    await this.page.getByTestId(text).click();
  }
}

// export default HomePage;
