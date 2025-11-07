import { Builder } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

const testLaunch = async () => {
  // ✅ Point directly to EdgeDriver
  const service = new edge.ServiceBuilder('C:\\WebDriver\\msedgedriver.exe');

  let driver;
  try {
    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeService(service)  // ✅ Correct new syntax
      .build();

    await driver.get('https://www.google.com');
    console.log('✅ Microsoft Edge launched successfully!');
  } catch (error) {
    console.error('❌ Launch failed:', error);
  } finally {
    if (driver) await driver.quit();
  }
};

testLaunch();
