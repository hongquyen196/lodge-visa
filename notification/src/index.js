const puppeteer = require("puppeteer");
const Australia = require('./aus');
const NewZealand = require('./nz');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
        defaultViewport: null
    });
    const nz = new NewZealand();
    const aus = new Australia();
    await Promise.all([
        nz.init(browser),
        aus.init(browser)
    ]);
    await Promise.all([
        // nz.status(),
        nz.tryPayVisa(),
        // aus.status(),
        aus.tryLodgeVisa(browser),
    ]);
    await browser.close();
})();