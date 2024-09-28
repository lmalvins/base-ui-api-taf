import { test, expect, BrowserContext, APIResponse } from '@playwright/test';
import { AiraloService } from '../../src/api-objects/airalo-service';
import logger from '../../src/utils/logger';

test.describe('Verifying API Order Generation', () => {
  let airaloService : AiraloService;
  let context: BrowserContext;
  let response : APIResponse
  let token: string;
  let orderId: string
  let simsList
  let orderObject
  
  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    airaloService = new AiraloService(context);
    response = await airaloService.login('', '')
    const responseBody = await response.json()
    
    expect(response.ok).toBeTruthy()
    token = responseBody.data.access_token;
    logger.info("Access Token:"+token); 
  });

  test('Verifying API order generation', async () => {
      await test.step('Generate 6 merhaba-7days-1gb orders',async () => {
        response = await airaloService.postOrder('merhaba-7days-1gb', 6, token)
        expect(response.ok).toBeTruthy()
        
        orderId =  (await response.json()).data.id

        response = await airaloService.getOrder(orderId, token)
        expect(response.ok).toBeTruthy()
        
        simsList = (await response.json()).data.sims
        expect (await simsList.length).toBe(6)
        orderObject = (await response.json()).data

        expect.soft((await response.json()).data.package_id).toBe("merhaba-7days-1gb")
        expect.soft((await response.json()).data.currency).toBe("USD")
        expect.soft((await response.json()).data.quantity).toBe(6)
        expect.soft((await response.json()).data.validity).toBe(7)
        expect.soft((await response.json()).data.data).toBe("1 GB")
        expect.soft((await response.json()).data.price).toBe(4.5)
      });

      await test.step('List 6 merhaba-7days-1gb orders',async () => {
        for (const sim of simsList) {
          logger.info(`SIM ID: ${sim.iccid}`);
          const response = await airaloService.getSim(sim.iccid, token);

          expect(response.ok()).toBeTruthy();
          expect ((await response.json()).data.simable.id).toEqual(orderObject.id)
          expect ((await response.json()).data.simable.code).toEqual(orderObject.code)
          expect ((await response.json()).data.simable.package_id).toEqual(orderObject.package_id)
          expect ((await response.json()).data.simable.currency).toEqual(orderObject.currency)
          expect ((await response.json()).data.simable.quantity).toEqual(orderObject.quantity)
          expect ((await response.json()).data.simable.type).toEqual(orderObject.type)
        }
      });

    });
});
