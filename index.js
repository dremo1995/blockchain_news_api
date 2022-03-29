const express = require("express");
const app = express();
const axios = require("axios").default;
const cheerio = require("cheerio");
const port = process.env.PORT || 3000;

const articles = [];
const pages = require("./pages.json");

pages.forEach((page) => {
  axios.get(page.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $(`a:contains("Crypto")`).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: page.base + url,
        source: page.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blockchain API");
});

app.get("/pages", (req, res) => {
  res.json(articles);
});

app.get("/pages/:pageId", async (req, res) => {
  const pageId = req.params.pageId;
  const pageAddress = pages.filter((page) => page.name == pageId)[0].address;
  const pageBase = pages.filter((page) => (page.name = pageId))[0].base;
  axios.get(pageAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const arr = [];

    $('a:contains("Crypto")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      arr.push({
        title,
        url: pageBase + url,
        source: pageId,
      });
    });
    res.json(arr);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
