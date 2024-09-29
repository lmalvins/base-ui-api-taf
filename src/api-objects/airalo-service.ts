import { APIResponse, BrowserContext } from '@playwright/test';
import StatusCode from 'status-code-enum';
import logger from '../utils/logger';

import { ApiClient } from '../api/api-client';

export { StatusCode };

export class AiraloService {
  baseUrl: string;
  browserContext: BrowserContext;
  client: ApiClient;

  // auth
  readonly GRANT_TYPE = 'client_credentials';
  readonly APPLICATION_JSON = 'application/json';
  clientId: string;
  clientSecret: string;

  // endpoints
  readonly AUTHENTICATION_ENDPOINT = '/v2/token';
  readonly ORDERS_ENDPOINT = '/v2/orders';
  readonly ESIMS_ENDPOINT = '/v2/sims';

  constructor(context: BrowserContext) {
    this.browserContext = context;
    this.baseUrl = 'https://sandbox-partners-api.airalo.com';
    this.client = new ApiClient(this.browserContext, this.baseUrl);
  }

  async login(user: string, secret: string) {
    const response = await this.client.post(
      this.AUTHENTICATION_ENDPOINT,
      {
        Accept: this.APPLICATION_JSON,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        client_id: user,
        client_secret: secret,
        grant_type: this.GRANT_TYPE,
      }
    );

    return response;
  }

  async postOrder(
    package_id: string,
    quantity: number,
    token: string
  ): Promise<APIResponse> {
    const response = await this.client.post(
      this.ORDERS_ENDPOINT,
      {
        Accept: this.APPLICATION_JSON,
        Authorization: 'Bearer ' + token,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        quantity: quantity,
        package_id: package_id,
      }
    );
    
    return response;
  }

  async getOrder(
    orderId: string,
    token: string,
  ): Promise<APIResponse> {
    const response = await this.client.get(
      this.ORDERS_ENDPOINT+"/"+orderId,
      {
        Accept: this.APPLICATION_JSON,
        Authorization: 'Bearer ' + token,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        include: 'sims',
      }
    );

    return response;
  }

  async getSim(simId: string,
    token: string,
  ): Promise<APIResponse> {
    const response = await this.client.get(
      this.ESIMS_ENDPOINT+"/"+simId,
      {
        Accept: this.APPLICATION_JSON,
        Authorization: 'Bearer ' + token,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        include: 'order',

      }
    );

    return response;
  }
}
