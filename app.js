const express = require('express');
const Services = require('./services');
const fs = require('fs');
const { execSync } = require('child_process');
const { PythonShell } = require('python-shell');

const app = express();
const port = process.env.PORT || 3000;

const services = new Services();

app.use(express.json());

app.get('/fetchSupabaseData', async (req, res) => {
  try {
    const data = await services.fetchDataFromSupabase();
    // Save fetched data to a local file for further processing or logging
    fs.writeFileSync('./supabaseData.json', JSON.stringify(data, null, 2));
    res.status(200).send('Data fetched successfully from Supabase and saved locally.');
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    res.status(500).send('Failed to fetch data from Supabase.');
  }
});

app.post('/fetchDataFromOpenAI', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }
  try {
    const response = await services.fetchDataFromOpenAI(prompt);
    // Use a Python script to process the response from OpenAI before sending it back
    fs.writeFileSync('./openAIResponse.json', JSON.stringify(response, null, 2));
    PythonShell.run('processOpenAIResponse.py', null, function (err, result) {
      if (err) throw err;
      const processedResponse = JSON.parse(fs.readFileSync('./processedOpenAIResponse.json', 'utf8'));
      res.status(200).json({ processedResponse });
    });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    res.status(500).send('Failed to fetch data from OpenAI.');
  }
});

app.get('/fetchDataFromCheatLayer', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send('Query is required.');
  }
  try {
    const data = await services.fetchDataFromCheatLayer(query);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from CheatLayer:', error);
    res.status(500).send('Failed to fetch data from CheatLayer.');
  }
});

app.get('/fetchMapData', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).send('Location is required.');
  }
  try {
    const mapData = await services.fetchDataFromMapEmbedApi(location);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(mapData, 'binary');
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).send('Failed to fetch map data.');
  }
});

// Additional routes for other services can be added here following the same pattern

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
