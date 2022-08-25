const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const fetch = require("node-fetch");

const IMMIGRATION_URL = 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps';
const USERNAME = 'hongquyen196@gmail.com';
const PASSWORD = 'QQQ!@#3214LeHong';
const COUNTRY = 'Vietnam';
const TIMEOUT = 30;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_API = 'https://api.telegram.org/bot5778841539:AAEB7OTIc4iXJWd9mX-ABUxxyU87yVYkWcA/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';

const readCookies = async () => {
    let cookies = [];
    try {
        const rawdata = await fs.readFile('cookies.json');
        cookies = JSON.parse(rawdata);
    } catch (e) {
    }
    // console.log('readCookies', cookies);
    return cookies;
}

const writeCookies = async (cookies) => {
    let rawdata = JSON.stringify(cookies);
    // console.log('writeCookies', cookies);
    return fs.writeFile('cookies.json', rawdata);
}

const telegramNotification = async () => {
    try {
        const response = await fetch(TELEGRAM_API);
        console.log(response);
    } catch (e) {
    }
}

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
    });
    let cookies = await readCookies();
    if (cookies && cookies.length > 0) {
        await page.setCookie(...cookies);
    }
    await page.goto(IMMIGRATION_URL);
    try {
        await page.waitForXPath('//tr[.//td[text()="' + COUNTRY + '"]]//span[contains(text(),"open")]', {timeout: TIMEOUT * 1000});
        console.log('STATUS', 'OK');
        await telegramNotification();
    } catch (e) {
        console.log('STATUS', 'NO');
    }
    cookies = await page.cookies();
    await writeCookies(cookies);
    await browser.close();
})();