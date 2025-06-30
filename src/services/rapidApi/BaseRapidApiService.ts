
export abstract class BaseRapidApiService {
  protected static apiKey: string = '';
  protected static baseUrl = 'https://real-time-amazon-data.p.rapidapi.com';

  static setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    console.log('RapidAPI key set:', apiKey ? `${apiKey.substring(0, 10)}...` : 'empty');
  }

  protected static async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('RapidAPI key not configured');
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    console.log('Making RapidAPI request to:', url);
    console.log('Request headers:', {
      'x-rapidapi-key': `${this.apiKey.substring(0, 10)}...`,
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
    });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = `RapidAPI request failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (e) {
          // If response isn't JSON, include the raw text
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid JSON response from API');
      }

      console.log('Parsed response data:', data);
      return data;
    } catch (error) {
      console.error('RapidAPI request error:', error);
      throw error;
    }
  }
}
