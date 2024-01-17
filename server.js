const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  try {
    // Fetch HTML content using Axios
    const url = req.query.url || 'https://stream.crichd.vip/update/star.php';
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Parse HTML content with Cheerio
    const $ = cheerio.load(htmlContent);

    // Log the entire HTML content to the console
    console.log($.html());

    // Extract information from the first iframe
    const firstIframeSrc = $('iframe').first().attr('src');

    // You can perform additional operations using Cheerio here if needed

    // Send the modified HTML content and iframe src as a response
    res.json({
      htmlContent: $.html(),
      firstIframeSrc: firstIframeSrc || 'No iframe found',
    });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
