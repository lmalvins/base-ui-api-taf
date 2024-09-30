import { test } from '../../src/api/fixtures/base-api-test-fixture';
import { expect } from '@playwright/test';
import logger from '../../src/utils/logger';

test('Verifying API order and eSIMS generation for merhaba-7days-1gb package', async ({ airaloService, token }) => {
  let response;
  let orderId: string;
  let simsList;
  let orderObject;
  let simObject;

  // When the client generate a new order for 6 merhaba-7days-1gb eSIMS
  await test.step('Order for 6 merhaba-7days-1gb eSIMS is placed', async () => {
    logger.info('When the client generate a new order for 6 merhaba-7days-1gb eSIMS');
    response = await airaloService.postOrder('merhaba-7days-1gb', 6, token);
    expect(response.ok).toBeTruthy();
    orderId = (await response.json()).data.id;
  });

  // When the client generate a new order for 6 merhaba-7days-1gb eSIMS
  await test.step('Order for 6 merhaba-7days-1gb eSIMS is placed', async () => {
    logger.info('When the client generate a new order for 6 merhaba-7days-1gb eSIMS');
    response = await airaloService.postOrder('merhaba-7days-1gb', 6, token);
    expect(response.ok).toBeTruthy();
    orderId = (await response.json()).data.id;
  });

  // Then the order is created
  await test.step('Verify that the Order for 6 merhaba-7days-1gb eSIMS is placed', async () => {
    logger.info('Then the order is created');
    response = await airaloService.getOrder(orderId, token);
    expect(response.ok).toBeTruthy();

    simsList = (await response.json()).data.sims;
    expect(await simsList.length).toBe(6);
    orderObject = (await response.json()).data;

    expect.soft(orderObject.package_id).toBe('merhaba-7days-1gb');
    expect.soft(orderObject.currency).toBe('USD');
    expect.soft(orderObject.quantity).toBe(6);
    expect.soft(orderObject.validity).toBe('7');
    expect.soft(orderObject.data).toBe('1 GB');
    expect.soft(orderObject.price).toBe('4.5');
  });

  // And the eSIMS are created
  await test.step('Verify that 6 eSIMS merhaba-7days-1gb are created', async () => {
    logger.info('And the eSIMS are created');
    for (const sim of simsList) {
      logger.info(`SIM ID: ${sim.iccid}`);
      const response = await airaloService.getSim(sim.iccid, token);
      simObject = (await response.json()).data.simable;

      expect(response.ok()).toBeTruthy();
      expect.soft(simObject.id).toBe(orderObject.id);
      expect.soft(simObject.code).toBe(orderObject.code);
      expect.soft(simObject.package_id).toBe(orderObject.package_id);
      expect.soft(simObject.currency).toBe(orderObject.currency);
      expect.soft(simObject.quantity).toBe(orderObject.quantity);
      expect.soft(simObject.type).toBe(orderObject.type);
      expect.soft(simObject.price).toBe(orderObject.price);
    }
  });
});
