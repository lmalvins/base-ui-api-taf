import { APIResponse, BrowserContext } from '@playwright/test';
import StatusCode from 'status-code-enum';

import { ApiClient } from '../api/api-client';

export { StatusCode };

export class AiraloService {
  private baseUrl: string;
  private browserContext: BrowserContext;
  private client: ApiClient;

  // auth
  private readonly GRANT_TYPE = 'client_credentials';
  private readonly APPLICATION_JSON = 'application/json';

  // endpoints
  private readonly AUTHENTICATION_ENDPOINT = '/v2/token';
  private readonly ORDERS_ENDPOINT = '/v2/orders';
  private readonly ESIMS_ENDPOINT = '/v2/sims';

  constructor(context: BrowserContext) {
    this.browserContext = context;
    this.baseUrl = 'https://sandbox-partners-api.airalo.com';
    this.client = new ApiClient(this.browserContext, this.baseUrl);
  }

  async login(user: string, secret: string): Promise<APIResponse> {
    return await this.client.post(
      this.AUTHENTICATION_ENDPOINT,
      {
        Accept: this.APPLICATION_JSON,
      },
      null,
      {
        client_id: user,
        client_secret: secret,
        grant_type: this.GRANT_TYPE,
      }
    );
  }

  async postOrder(
    package_id: string,
    quantity: number,
    token: string
  ): Promise<APIResponse> {
    return await this.client.post(
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
  }

  async getOrder(orderId: string, token: string): Promise<APIResponse> {
    return await this.client.get(
      this.ORDERS_ENDPOINT + '/' + orderId,
      {
        Accept: this.APPLICATION_JSON,
        Authorization: 'Bearer ' + token,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        include: 'sims',
      }
    );
  }

  async getSim(simId: string, token: string): Promise<APIResponse> {
    return await this.client.get(
      this.ESIMS_ENDPOINT + '/' + simId,
      {
        Accept: this.APPLICATION_JSON,
        Authorization: 'Bearer ' + token,
      },
      null, // { ignoreHTTPSErrors: true },
      {
        include: 'order',
      }
    );
  }
}
