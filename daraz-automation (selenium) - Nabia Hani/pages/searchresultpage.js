import { By, until } from 'selenium-webdriver';

export default class SearchResultsPage {
  constructor(driver) {
    this.driver = driver;
    this.brandFilter = By.xpath("//span[contains(text(),'Samsung')]"); // Example brand
    this.minPrice = By.css('input[placeholder="Min"]');
    this.maxPrice = By.css('input[placeholder="Max"]');
    this.applyButton = By.xpath("//button[contains(text(),'APPLY')]");
    this.productCards = By.css('.box--pRqdD');
  }

  async applyBrandFilter() {
    const brand = await this.driver.wait(until.elementLocated(this.brandFilter), 10000);
    await brand.click();
    await this.driver.sleep(3000);
  }

  async applyPriceFilter(min, max) {
    const minField = await this.driver.findElement(this.minPrice);
    const maxField = await this.driver.findElement(this.maxPrice);
    await minField.sendKeys(min.toString());
    await maxField.sendKeys(max.toString());
    const applyBtn = await this.driver.findElement(this.applyButton);
    await applyBtn.click();
    await this.driver.sleep(3000);
  }

  async countProducts() {
    await this.driver.wait(until.elementsLocated(this.productCards), 10000);
    const products = await this.driver.findElements(this.productCards);
    return products.length;
  }

  async openFirstProduct() {
    const firstProduct = await this.driver.findElement(this.productCards);
    await firstProduct.click();
  }
}
