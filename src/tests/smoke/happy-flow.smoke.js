const { By } = require('selenium-webdriver');
const { test } = require('./tester');

module.exports = () =>
  test('Open page and navigate', async ({ driver, expect }) => {
    const uri = process.argv[2];
    if (!uri) {
      throw new Error('No testUri configured');
    }

    await driver.get(uri);
    await expect.documentReady();

    const content = await expect.elementLocated(By.css('.content'));
    const button = await content.findElement(By.css('[navigate="/board"]'));
    await button.click();

    await expect.urlEndsWith('/board');
    await expect.elementLocated(By.css('.board'));
  });
