const puppeteer = require('puppeteer');
const common = require('../../lib');

const COOKIE_PATH = './auscookies.json';
const IMMIGRATION_URL = 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps';
const USERNAME = 'hongquyen196@gmail.com';
const PASSWORD = 'QQQ!@#3214LeHong';
const COUNTRY = 'Vietnam';
const TIMEOUT = 30;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot5778841539:AAEB7OTIc4iXJWd9mX-ABUxxyU87yVYkWcA/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';

const checkStatus = async () => {
    console.log('AUSTRALIA', new Date().toISOString());
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
    });
    let cookies = await common.readCookies(COOKIE_PATH);
    if (cookies && cookies.length > 0) {
        await page.setCookie(...cookies);
    }
    await page.goto(IMMIGRATION_URL);
    try {
        await page.waitForXPath('//tr[.//td[text()="' + COUNTRY + '"]]//span[contains(text(),"open")]', {timeout: TIMEOUT * 1000});
        console.log('\tSTATUS', 'OK');
        await common.telegramNotification(TELEGRAM_URL);
    } catch (e) {
        console.log('\tSTATUS', 'NO');
    }
    cookies = await page.cookies();
    await common.writeCookies(COOKIE_PATH, cookies);
    await browser.close();
}

exports.checkStatus = checkStatus;