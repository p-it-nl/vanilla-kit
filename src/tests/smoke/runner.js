const fs = require('fs');
const path = require('path');

const smokeTests = fs.readdirSync(__dirname)
  .filter(file =>
    file.endsWith('.smoke.js')
  );

(async () => {
  console.log(`Found ${smokeTests.length} smoke test(s)\n`);

  for (const file of smokeTests) {
    const testPath = path.join(__dirname, file);
    const runTest = require(testPath);

    try {
      await runTest();
    } catch (ex) {
      console.error(ex);
      console.error(`✖ Stopping after failure in ${file}`);
      process.exit(1);
    }
  }

  console.log('\n✔ All smoke tests passed');
  process.exit(0);
})();
