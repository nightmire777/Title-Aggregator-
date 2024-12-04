const express = require('express'); //using express js 
const axios = require('axios');
const cheerio = require('cheerio'); 
const path = require('path');


const app = express();
const PORT = 3000;

// Define the website to scrape
//const WEBSITE_URLL = "https://www.theverge.com/archives/2024/12"; 
//const WEBSITE_URL = "https://www.theverge.com/archives/"; 


app.get('/end-pointt', async (req, res) => {
    try {
        // Fetch website HTML
        const { data } = await axios.get(WEBSITE_URL);

        // Load HTML into Cheerio
        const $ = cheerio.load(data);



        // Extract titles based on HTML structure
        const results = [];
        $('h2').each((_, element) => {
            const title = $(element).text().trim(); // Get the title text
            const linkElement = $(element).find('a'); // Check for a link inside the title
            const link = linkElement.length > 0 ? linkElement.attr('href') : null; // Extract link if exists
            const dt = '';

            // Add the title and link to the results
            results.push({
                title,
                link: link
                    ? link.startsWith('/')
                        ? WEBSITE_URL + link // Handle relative URLs
                        : link
                    : 'This website has no url for some reason',
                dt
            });
        });

        // Send titles as JSON
        res.json({ results });
    } catch (error) {
        console.error("Error fetching titles:", error.message);
        res.status(500).json({ error: "Failed to fetch titles" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.get('/',async(req,res)=>{
    res.sendFile(path.join(__dirname,'/index.html'));
})

app.get('/end-point',async (req,res) => {
    const results = [];
    const years = [2024,2023,2022];
    let y =0, m=1;
    while (y < years.length){
        console.log(years[y])
        while (m <= 12){
            let WEBSITE_URL = "https://www.theverge.com/archives/" + years[y] + "/" + m;
            console.log(WEBSITE_URL);
            try {
                // Fetch website HTML
                const { data } = await axios.get(WEBSITE_URL);
        
                // Load HTML into Cheerio
                const $ = cheerio.load(data);        
        
                // Extract titles based on HTML structure
                $('h2').each((_, element) => {
                    const title = $(element).text().trim(); // Get the title text
                    const linkElement = $(element).find('a'); // Check for a link inside the title
                    const link = linkElement.length > 0 ? linkElement.attr('href') : null; // Extract link if exists
                    const dt = '';
        
                    // Add the title and link to the results
                    if (link == null){

                    }else{
                        results.push({
                            title,
                            link: link,
                            dt: dt
                        });
                    }
                });
        
                // Send titles as JSON
                //res.json({ results });
            } catch (error) {
                console.error("Error fetching titles:", error.message);
                res.status(500).json({ error: "Failed to fetch titles" });
            }

            m++;

        };
        y++;m=1;
    }
    res.json({ results });

    


})