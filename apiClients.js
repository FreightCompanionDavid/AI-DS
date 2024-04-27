const config = require('./config.json');

class APIClient {
  constructor() {
    this.cheatlayer = config.Cheatlayer;
    this.vercel = config.Vercel;
    this.supabaseApiKey = config.SUPABASE_API_KEY;
    this.groqCloud = config.GroqCloud;
    this.ngrok = config.NGROK;
    this.openAI = config.OPENAI;
    this.echoAPI = config.EchoAPI;
    this.dataGov1 = config.DataGov1;
    this.dataGov2 = config.DataGov2;
    this.scaleSERP = config.ScaleSERP;
    this.energyInformationAdministration = config.EnergyInformationAdministration;
    this.cohere = config.Cohere;
    this.kluAI = config.KluAI;
    this.mapEmbedApi = config.MapEmbedApi;
    this.nrel = config.Nrel;
    this.eia = config.EIA;
    this.akismet = config.Akismet;
  }

  // Example method to use one of the API keys
  getSupabaseClient() {
    // Assuming Supabase client initialization code goes here
    // This is just a placeholder example
    console.log(`Initializing Supabase with API Key: ${this.supabaseApiKey}`);
    // Actual Supabase client code would go here
  }

  // Add methods to interact with other APIs using their keys as needed
}

module.exports = new APIClient();
