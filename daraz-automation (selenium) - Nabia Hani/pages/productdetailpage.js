import { By, until } from 'selenium-webdriver';

export default class ProductDetailsPage {
  constructor(driver) {
    this.driver = driver;
    this.freeShippingText = By.xpath("//*[contains(text(),'Free Shipping')]");
  }

  async isFreeShippingAvailable() {
    try {
      await this.driver.wait(until.elementLocated(this.freeShippingText), 5000);
      return true;
    } catch (e) {
      return false;
    }
  }
}
