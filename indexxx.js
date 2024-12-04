const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

const WEBSITE_URL = "https://www.theverge.com/archives/2024/12"; // Replace with your chosen site

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get('/articles', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: false }); // Run non-headless mode
        const page = await browser.newPage();

        await page.goto(WEBSITE_URL, { waitUntil: 'networkidle2' });

        let loadMoreVisible = true;
        while (loadMoreVisible) {
            console.log("Attempting to click 'Load More'..."); //debug line
            await page.evaluate(() => {
                const button = document.querySelector('button.p-button c-archives-load-more__button');
                console.log(button);
                if (button) {
                    button.click();
                    console.log("Clicked 'Load More' button"); //debug line 
                    return true;
                }else {
                    let loadMoreVisible = false;
                    return false;

                }
            });

            await delay(1000); //lets try to reduce the delay later to make it a lil faster while also not ddosing the web 
        }

        console.log("Extracting articles...");
        const articles = await page.evaluate(() => {
            const results = [];
            document.querySelectorAll('article').forEach((article) => {
                const title = article.querySelector('h2, h3')?.innerText.trim();
                const link = article.querySelector('a')?.href;
                const date = article.querySelector('.date')?.innerText.trim();
                if (title) {
                    results.push({ title, link, date });
                }
            });
            return results;
        });

        console.log("Articles extracted:", articles);
        await browser.close();
        res.json({ articles });
    } catch (error) {
        console.error("Error scraping articles:", error.message);
        res.status(500).json({ error: "Failed to scrape articles" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
