const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const fetch = require("node-fetch");

const IMMIGRATION_URL = 'https://onlineservices.immigration.govt.nz';
const USERNAME = 'lhq196';
const PASSWORD = 'QQQ!@#3214Le';
const COUNTRY_ID = '237';
const TIMEOUT = 10;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_API = 'https://api.telegram.org/bot5500795753:AAHhd62CpNxfYAo9YjQA09lyGFtZCw8Pquo/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';

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

const login = async (page) => {
    await page.goto(IMMIGRATION_URL);
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('input[value="LOGIN"]')
    await page.waitForFunction(() => location.search === '?STATUS')
    const cookies = await page.cookies();
    await writeCookies(cookies);
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
        console.log("LOGGED", USERNAME);
        await page.setCookie(...cookies);
    }
    await page.goto(IMMIGRATION_URL + '/WorkingHoliday/Application/Create.aspx?CountryId=' + COUNTRY_ID + '&OffShore=1&STZ=0');
    try {
        await page.waitForSelector('#ContentPlaceHolder1_applyNowButton', {timeout: TIMEOUT * 1000});
        console.log('STATUS', 'OK');
        await telegramNotification();
    } catch (e) {
        console.log('STATUS', 'NO');
        const url = page.url();
        console.log('URL', url);
        if (url.includes('access-denied')) {
            console.log("LOGIN", USERNAME);
            await login(page);
        }
    }
    await browser.close();
})();