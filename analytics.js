const express = require('express');
const bodyParser = require('body-parser');
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const app = express();
const port = 3000;

// Set up the Text Analytics client
const endpoint = "https://text-analytics-resource23.cognitiveservices.azure.com/";
const key = process.env.TEXT_ANALYTICS_KEY; // Retrieve the key from an environment variable
const credential = new AzureKeyCredential(key);
const textAnalyticsClient = new TextAnalyticsClient(endpoint, credential);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML page with the form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Enter text to analyze</h1>
        <form method="POST" action="/sentiment">
          <input type="text" name="text">
          <button type="submit">Analyze</button>
        </form>
      </body>
    </html>
  `);
  });

// Handle the form submission
app.post('/sentiment', async (req, res) => {
  try {
    const text = req.body.text || '';

    // Call the sentiment analysis API
    const response = await textAnalyticsClient.analyzeSentiment([text]);
    const sentimentScore = response[0].confidenceScores.positive;

    res.send(`
      <html>
        <body>
          <h1>Analysis Results</h1>
          <p>Sentiment score: ${sentimentScore}</p>
          <p>Text analyzed: ${text}</p>
          <p><a href="/">Analyze another text</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
