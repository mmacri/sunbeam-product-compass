
export abstract class BaseRapidApiService {
  protected static apiKey: string = '';
  protected static baseUrl = 'https://real-time-amazon-data.p.rapidapi.com';

  static setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  protected static async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('RapidAPI key not configured');
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    console.log('Making RapidAPI request to:', endpoint, 'with params:', params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`RapidAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('RapidAPI response:', data);
      
      return data;
    } catch (error) {
      console.error('RapidAPI request error:', error);
      throw error;
    }
  }
}
