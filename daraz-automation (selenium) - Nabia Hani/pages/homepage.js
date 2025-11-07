import { By, until } from 'selenium-webdriver';

export default class HomePage {
  constructor(driver) {
    this.driver = driver;
    this.searchBox = By.css('input[placeholder="Search in Daraz"]');
    this.searchButton = By.css('button[type="submit"]');
  }

  async open() {
    await this.driver.get('https://www.daraz.pk/');
    await this.driver.wait(until.elementLocated(this.searchBox), 10000);
  }

  async searchProduct(keyword) {
    const searchInput = await this.driver.findElement(this.searchBox);
    await searchInput.sendKeys(keyword);
    const searchBtn = await this.driver.findElement(this.searchButton);
    await searchBtn.click();
  }
}
