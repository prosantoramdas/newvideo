const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/hi',(req,res)=>{
  res.send('hi')
})

// Define an endpoint that takes a URL as a parameter
app.get('/', async (req, res) => {
    const customUrl = req.query.url;

    // Check if the URL is provided
    if (!customUrl) {
        return res.status(400).json({ error: 'Please provide a URL in the "url" query parameter.' });
    }

    try {
        // Fetch HTML content using Axios
        const response = await axios.get(customUrl);
        const html = response.data;

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);

        // Extract the third script tag using Cheerio selectors
        const thirdScriptContent = $('script').eq(2).html();

        // Parse the JSON content of the third script tag
        if (thirdScriptContent) {
            const jsonContent = JSON.parse(thirdScriptContent);

            // Check if the JSON contains a contentUrl
            if (jsonContent && jsonContent.contentUrl) {
                const contentUrl = jsonContent.contentUrl;
                res.json({ contentUrl: contentUrl });
            } else {
                res.json({ message: 'No contentUrl found in the JSON.' });
            }
        } else {
            res.json({ message: 'No content found in the third script tag.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}` });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
