import { BrowserContext } from '@playwright/test';

export class ApiClient {
  browserContext: BrowserContext;
  baseURL: string;

  constructor(context, baseURL) {
    this.browserContext = context;
    this.baseURL = baseURL;
  }

  async get(path: string, headers, additionalParams?, params?) {
    const fullUrl = this.baseURL + path;

    return this.browserContext.request.get(fullUrl, {
      additionalParams,
      headers,
      params,
    });
  }

  async post(path: string, headers, params?, form?) {
    const fullUrl = this.baseURL + path;

    return this.browserContext.request.post(fullUrl, {
      form,
      headers,
      params,
    });
  }
}
