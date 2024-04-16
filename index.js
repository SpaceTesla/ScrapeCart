const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const { scrapeAmazon, scrapeFlipkart } = require("./scrapper");

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// app.get("/search", async (req, res) => {
//   const { q } = req.query;
//   let products = await scrape(q);
//   res.render("index", { products: products });
// });

let cacheA = {};
app.get("/amazon/search", async (req, res) => {
  const { q } = req.query;

  // If the query is in the cache, use the cached data
  if (cacheA[q]) {
    res.render("search", { products: cacheA[q] });
  } else {
    // Otherwise, scrape the data and store it in the cache
    const products = await scrapeAmazon(q);
    cacheA[q] = products;
    res.render("search", { products: products, domain: "Amazon" });
  }
});

let cacheF = {};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/flipkart/search", async (req, res) => {
  const { q } = req.query;
  console.log(q);
  // If the query is in the cache, use the cached data
  if (cacheF[q]) {
    res.render("search", { products: cacheF[q] });
  } else {
    // Otherwise, scrape the data and store it in the cache
    const products = await scrapeFlipkart(q);
    cacheF[q] = products;
    res.render("search", { products: products, domain: "Flipkart" });
  }
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});

// const scrape = async (q) => {
//   let products = [];
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp",
//   });
//   const page = await browser.newPage();
//   await page.goto(`https://www.amazon.in/s?k=${q}`);

//   const productHandles = await page.$$(
//     "div.s-main-slot.s-result-list.s-search-results.sg-row > div.s-result-item"
//   );

//   // console.log(productHandles);

//   for (const productHandle of productHandles) {
//     try {
//       const title = await page.evaluate(
//         (el) => el.querySelector("h2 > a > span").textContent,
//         productHandle
//       );

//       const link = await page.evaluate(
//         (el) => el.querySelector("h2 > a").href,
//         productHandle
//       );

//       const price = await page.evaluate(
//         (el) => el.querySelector(".a-price-whole").textContent,
//         productHandle
//       );

//       const img = await page.evaluate(
//         (el) => el.querySelector("div > span > a > div > img").src,
//         productHandle
//       );

//       // console.log(img);

//       // console.log(price);
//       products.push({ img: img, title: title, link: link, price: price });
//     } catch (err) {
//       // console.log(err);
//     }
//   }
//   console.log(products);
//   console.log(products.length);
//   const fileName = __filename.split("\\").pop().split(".")[0];
//   await fs.writeFile(`${fileName}.json`, JSON.stringify(products, null, 2));

//   await browser.close();

//   return products;
// };

// scrape();
