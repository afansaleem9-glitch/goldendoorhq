interface Result<T> { success: boolean; data?: T; error?: string; }

interface OAuth2Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  x_refresh_token_expires_in: number;
}

interface InvoiceData {
  id: string;
  docNumber: string;
  customerRef: {
    value: string;
    name: string;
  };
  totalAmt: number;
  dueDate: string;
  txnDate: string;
  line: Array<{
    amount: number;
    description: string;
    detailType: string;
  }>;
}

interface CustomerData {
  id: string;
  displayName: string;
  givenName: string;
  familyName: string;
  primaryEmailAddr?: {
    address: string;
  };
  primaryPhone?: {
    freeFormNumber: string;
  };
  billingAddr: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface PaymentData {
  id: string;
  docNumber: string;
  totalAmt: number;
  txnDate: string;
  line: Array<{
    amount: number;
    linkedTxn: Array<{
      txnId: string;
      txnType: string;
    }>;
  }>;
}

export class QuickBooksAPI {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private realmId: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl = "https://quickbooks.api.intuit.com";

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    realmId: string
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.realmId = realmId;
  }

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      scope: "com.intuit.quickbooks.accounting",
      redirect_uri: this.redirectUri,
      state,
    });

    return `https://appcenter.intuit.com/connect/oauth2?${params}`;
  }

  async exchangeCodeForToken(
    authorizationCode: string
  ): Promise<Result<OAuth2Token>> {
    try {
      const payload = new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: this.redirectUri,
      });

      const auth = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");

      const response = await fetch(
        "https://oauth.platform.intuit.com/oauth2/tokens/oauth",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `OAuth token exchange failed: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as OAuth2Token;
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to exchange authorization code: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async refreshAccessToken(): Promise<Result<OAuth2Token>> {
    try {
      if (!this.refreshToken) {
        return {
          success: false,
          error: "No refresh token available",
        };
      }

      const payload = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      });

      const auth = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");

      const response = await fetch(
        "https://oauth.platform.intuit.com/oauth2/tokens/oauth",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Token refresh failed: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as OAuth2Token;
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to refresh token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async getInvoice(invoiceId: string): Promise<Result<InvoiceData>> {
    try {
      if (!this.accessToken) {
        return { success: false, error: "Not authenticated" };
      }

      const response = await fetch(
        `${this.baseUrl}/v2/company/${this.realmId}/query?query=SELECT * FROM Invoice WHERE Id = '${invoiceId}'`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `QuickBooks API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        queryResponse: { Invoice: InvoiceData[] };
      };

      if (data.queryResponse.Invoice.length === 0) {
        return { success: false, error: "Invoice not found" };
      }

      return { success: true, data: data.queryResponse.Invoice[0] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch invoice: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}