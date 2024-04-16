const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const scrapeFlipkart = async (q) => {
  let products = [];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmpF",
  });

  const page = await browser.newPage();
  await page.goto(`https://www.flipkart.com/search?q=${q}`);

  const productHandles = await page.$$("div._4ddWXP");

  for (const productHandle of productHandles) {
    try {
      const title = await page.evaluate(
        (el) => el.querySelector("a.s1Q9rs").title,
        productHandle
      );

      const link = await page.evaluate(
        (el) => el.querySelector("a.s1Q9rs").href,
        productHandle
      );

      const price = await page.evaluate(
        (el) => el.querySelector("._30jeq3").textContent.substring(1),
        productHandle
      );

      const img = await page.evaluate(
        (el) => el.querySelector(".CXW8mj > img").src,
        productHandle
      );

      products.push({ img: img, title: title, link: link, price: price });
    } catch (err) {
      console.log(err);
    }
  }
  console.log(products);
  console.log(products.length);
  const fileName = __filename.split("\\").pop().split(".")[0];
  await fs.writeFile(`flipkart.json`, JSON.stringify(products, null, 2));

  await browser.close();

  return products;
};

const scrapeAmazon = async (q) => {
  let products = [];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.in/s?k=${q}`);

  const productHandles = await page.$$(
    "div.s-main-slot.s-result-list.s-search-results.sg-row > div.s-result-item"
  );

  for (const productHandle of productHandles) {
    try {
      const title = await page.evaluate(
        (el) => el.querySelector("h2 > a > span").textContent,
        productHandle
      );

      const link = await page.evaluate(
        (el) => el.querySelector("h2 > a").href,
        productHandle
      );

      const price = await page.evaluate(
        (el) => el.querySelector(".a-price-whole").textContent,
        productHandle
      );

      const img = await page.evaluate(
        (el) => el.querySelector("div > span > a > div > img").src,
        productHandle
      );

      products.push({ img: img, title: title, link: link, price: price });
    } catch (err) {
      console.log(err);
    }
  }
  console.log(products);
  console.log(products.length);
  const fileName = __filename.split("\\").pop().split(".")[0];
  await fs.writeFile(`amazon.json`, JSON.stringify(products, null, 2));

  await browser.close();

  return products;
};

module.exports = { scrapeAmazon, scrapeFlipkart };
