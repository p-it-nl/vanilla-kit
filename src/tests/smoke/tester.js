const { Builder, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function test(name, testFn, options = {}) {
  const {
    headless = true,
    timeout = 10_000,
    browser = 'firefox'
  } = options;

  let driver;

  try {
    const firefoxOptions = new firefox.Options();
    if (headless) {
      firefoxOptions.addArguments('-headless');
    }

    driver = await new Builder()
      .forBrowser(browser)
      .setFirefoxOptions(firefoxOptions)
      .build();

    const expect = createExpect(driver, timeout);

    console.log(`▶ ${name}`);

    await testFn({ driver, expect, until });

    console.log(`✔ PASS: ${name}`);

    return true;
  } catch (ex) {
    console.error(`✖ FAIL: ${name}`);
    throw ex;
  } finally {
    await driver.quit();
  }
}

function createExpect(driver, timeout) {

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/\s*-\s*/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/[.:]/g, '')
      .trim();
  }

  return {
    async documentReady() {
      await driver.wait(
        () => driver.executeScript('return document.readyState')
          .then(s => s === 'complete'),
        timeout,
        'Document not ready'
      );
    },

    async urlEndsWith(suffix) {
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url.endsWith(suffix);
      }, timeout, `URL did not end with ${suffix}`);
    },

    async elementLocated(locator) {
      return driver.wait(
        until.elementLocated(locator),
        timeout,
        `Element not located: ${locator}`
      );
    },

    async elementsCountMoreThan(locator, count) {
      await driver.wait(async () => {
        const els = await driver.findElements(locator);
        return els.length > count;
      }, timeout, `Expected > ${count} elements for ${locator}`);
    },

    async textContains(element, expected) {
      await driver.wait(async () => {
        const text = await element.getText();
        return text.includes(expected);
      }, timeout, `Text did not contain "${expected}"`);
    },

    async textSimilar(element, expected) {
      await driver.wait(async () => {
        const actual = normalize(await element.getText());
        const exp = normalize(expected);
        return actual.includes(exp);
      }, timeout, `Text was not similar to "${expected}"`);
    }
  };
}

module.exports = { test };
