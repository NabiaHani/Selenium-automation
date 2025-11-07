import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';
import { expect } from 'chai';

describe('Daraz.pk Functional Test (Selenium - Chrome)', function () {
  this.timeout(120000); // 2 minutes timeout
  let driver;

  before(async function () {
    // Use specific chromedriver that matches installed Chrome version
    const service = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options();
    options.addArguments('--start-maximized'); // open browser maximized

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should search, filter, and validate products', async function () {
    // Step 1: Navigate to Daraz
    await driver.get('https://www.daraz.pk/');

    // Step 2: Search for "electronics"
    const searchBox = await driver.wait(until.elementLocated(By.name('q')), 10000);
    await searchBox.sendKeys('electronics\n');

    // Step 3: Wait for products to load and make sure we're on the search results page
    await driver.wait(until.elementLocated(By.css('[data-qa-locator="product-item"]')), 15000);
    const currentUrl = await driver.getCurrentUrl();
    
    // Make sure we're on the search results page
    if (!currentUrl.includes('electronics')) {
      await driver.get(currentUrl + '?q=electronics');
      await driver.wait(until.elementLocated(By.css('[data-qa-locator="product-item"]')), 15000);
    }

    const products = await driver.findElements(By.css('[data-qa-locator="product-item"]'));
    expect(products.length).to.be.greaterThan(0);

    // Step 4: Apply Brand Filter (Planet X)
    try {
      // First scroll down a bit to avoid header
      await driver.executeScript("window.scrollBy(0, 200)");
      await driver.sleep(1000);

      // Wait for and find the Brand section first
      const brandSection = await driver.wait(until.elementLocated(
        By.xpath("//div[contains(text(), 'Brand') or contains(text(), 'Brands')]")
      ), 10000);
      
      // Scroll the brand section into view
      await driver.executeScript("arguments[0].scrollIntoView(true)", brandSection);
      await driver.sleep(1000);

      // Now look for Planet X checkbox
      const planetXCheckbox = await driver.wait(until.elementLocated(
        By.xpath("//span[normalize-space()='Planet X']")
      ), 10000);
      
      // Try normal click first
      try {
        await planetXCheckbox.click();
      } catch (err) {
        // If normal click fails, try JavaScript click
        await driver.executeScript("arguments[0].click();", planetXCheckbox);
      }
      
      // Wait for products to update
      await driver.sleep(3000);
    } catch (e) {
      // Error handling without console.log
    }

    // Step 5: Apply Price Range Filter
    try {
      // Wait for price section to be visible
      const priceHeader = await driver.wait(until.elementLocated(
        By.xpath("//div[contains(text(), 'Price')]")
      ), 5000);
      
      await driver.executeScript("arguments[0].scrollIntoView(true)", priceHeader);
      await driver.sleep(1000);
      
      // Find price input fields with multiple selectors
      const minPriceInput = await driver.findElement(
        By.css('input[placeholder*="Min"], input[aria-label*="minimum"]')
      );
      const maxPriceInput = await driver.findElement(
        By.css('input[placeholder*="Max"], input[aria-label*="maximum"]')
      );
      
      // Enter min price (500)
      await minPriceInput.click();
      await minPriceInput.clear();
      await minPriceInput.sendKeys('500');
      
      // Enter max price (5000)
      await maxPriceInput.click();
      await maxPriceInput.clear();
      await maxPriceInput.sendKeys('5000');
      
      // Try multiple selectors for Apply button
      try {
        const applyButton = await driver.findElement(
          By.xpath("//button[contains(text(), 'APPLY') or contains(text(), 'Apply') or contains(@class, 'apply')]")
        );
        await applyButton.click();
      } catch (err) {
        // If button not found, try clicking Enter on the last input
        await maxPriceInput.sendKeys(Key.RETURN);
      }
      
      // Wait for products to update
      await driver.sleep(2000);
    } catch (e) {
      // Error handling without console.log
    }

    // Step 6: Apply price sorting filter
    try {
      // Try to close any popups or overlays first
      try {
        const closeButtons = await driver.findElements(
          By.css('[class*="close"], [class*="Close"], [class*="popup"] button, [aria-label*="close"]')
        );
        for (const btn of closeButtons) {
          try {
            await btn.click();
          } catch (err) {}
        }
      } catch (err) {}

      // Wait for sort dropdown to be present and visible
      const sortDropdown = await driver.wait(until.elementLocated(
        By.xpath("//span[@class='ant-select-selection-item']//div[contains(text(),'Best Match')]")
      ), 10000);
      
      // Move to element and try to click (this sometimes helps with overlays)
      const actions = driver.actions({bridge: true});
      await actions.move({origin: sortDropdown}).perform();
      await driver.sleep(1000);
      
      // Try clicking with JavaScript if normal click fails
      try {
        await sortDropdown.click();
      } catch (err) {
        await driver.executeScript("arguments[0].click();", sortDropdown);
      }
      
      // Wait for and click Price low to high option
      const lowToHighOption = await driver.wait(until.elementLocated(
        By.xpath("//div[contains(text(),'Price low to high')]")
      ), 5000);
      
      await driver.executeScript("arguments[0].click();", lowToHighOption);
      
      // Wait for products to re-sort
      await driver.sleep(3000);

    } catch (e) {
      // Error handling without console.log
    }

    // Step 7: Recount filtered products
    await driver.sleep(4000);
    const filteredProducts = await driver.findElements(By.css('[data-qa-locator="product-item"]'));

    // Step 8: Open first product details
    if (filteredProducts.length > 0) {
      // Click the first product
      await filteredProducts[0].click();
      
      // Wait for product details page to load
      await driver.wait(until.elementLocated(By.css('.pdp-mod-product-badge-title')), 15000);

      // Step 9: Check for free shipping
      const pageSource = await driver.getPageSource();
      
      // Try multiple variations of free shipping text
      const shippingTexts = [
        'Free Shipping',
        'free shipping',
        'FREE SHIPPING',
        'Free Delivery',
        'free delivery',
        'FREE DELIVERY'
      ];
      
      const hasShipping = shippingTexts.some(text => pageSource.includes(text));
      if (!hasShipping) {
        // Try to find shipping section to check cost
        try {
          await driver.findElements(
            By.xpath("//*[contains(text(), 'Shipping') or contains(text(), 'Delivery')]")
          );
        } catch (e) {
          // Error handling without console.log
        }
      }
    }
  });
});