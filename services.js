const apiClients = require('./apiClients');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require("openai");

class Services {
  constructor() {
    // Initialize API clients with credentials
    this.apiClients = apiClients;
    this.supabaseClient = createClient('https://your-project-url.supabase.co', this.apiClients.supabaseApiKey);
    const configuration = new Configuration({ apiKey: this.apiClients.openAI });
    this.openAIClient = new OpenAIApi(configuration);
  }

  // Generic method to fetch data from any API using fetch
  async fetchData(url, options = {}, isJson = true) {
    console.log(`Fetching data from ${url}...`);
    try {
      const response = await fetch(url, options);
      const data = isJson ? await response.json() : await response.blob();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch data');
      console.log('Data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }

  // Fetch data from Supabase using the Supabase client
  async fetchDataFromSupabase() {
    return this.fetchData('https://your-supabase-project.supabase.co/rest/v1/your_table', {
      headers: {
        'apikey': this.apiClients.supabaseApiKey,
        'Authorization': `Bearer ${this.apiClients.supabaseApiKey}`
      }
    });
  }

  // Fetch data from OpenAI using the OpenAI client
  async fetchDataFromOpenAI(prompt) {
    return this.fetchData(`https://api.openai.com/v1/engines/davinci/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiClients.openAI}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, max_tokens: 100 })
    });
  }

  // Fetch data from other APIs by specifying the URL and options
  // Example for fetching data from CheatLayer
  async fetchDataFromCheatLayer(query) {
    return this.fetchData(`https://api.cheatlayer.com/search?query=${query}`, {
      headers: { 'Authorization': `Bearer ${this.apiClients.cheatlayer}` }
    });
  }

  // Example for fetching map data from MapEmbedApi
  async fetchDataFromMapEmbedApi(location) {
    return this.fetchData(`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=14&size=400x400&key=${this.apiClients.mapEmbedApi}`, {}, false);
  }

  // Additional methods for other APIs can be implemented here following the same pattern
}
module.exports = new Services();
