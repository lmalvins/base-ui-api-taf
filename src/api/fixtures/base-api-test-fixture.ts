import { test as base, expect } from '@playwright/test';
import { AiraloService } from '../../api/api-objects/airalo-service';
import logger from '../../utils/logger';

type TestFixtures = {
  airaloService: AiraloService;
  token: string;
};

export const test = base.extend<TestFixtures>({
  airaloService: async ({ browser }, use) => {
    const context = await browser.newContext();
    const service = new AiraloService(context);
    await use(service);
    await context.close();
  },
  token: async ({ airaloService }, use) => {
    logger.info('Authenticating to retrieve a unique token for each test');
    expect ((process.env.USER_ID && process.env.USER_SECRET)).toBeTruthy()
  
    const response = await airaloService.login(`${process.env.USER_ID}`, `${process.env.USER_SECRET}`);
    expect(response.ok).toBeTruthy();
    const token = (await response.json()).data.access_token;
    logger.info(`Retrieved Access Token: ${token}`);
    await use(token);
  },
});
