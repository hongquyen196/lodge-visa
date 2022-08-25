const puppeteer = require('puppeteer');
const common = require('../../lib');

const COOKIE_PATH = './nzcookies.json';
const IMMIGRATION_URL = 'https://onlineservices.immigration.govt.nz';
const USERNAME = 'lhq196';
const PASSWORD = 'QQQ!@#3214Le';
const COUNTRY_ID = '237';
const TIMEOUT = 10;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot5500795753:AAHhd62CpNxfYAo9YjQA09lyGFtZCw8Pquo/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';

const login = async (page) => {
    await page.goto(IMMIGRATION_URL);
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('input[value="LOGIN"]')
    await page.waitForFunction(() => location.search === '?STATUS')
    const cookies = await page.cookies();
    await common.writeCookies(COOKIE_PATH, cookies);
}

const checkStatus = async () => {
    console.log('NEWZEALAND', new Date().toISOString());
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
    });
    let cookies = await common.readCookies(COOKIE_PATH);
    if (cookies && cookies.length > 0) {
        console.log("\tLOGGED", USERNAME);
        await page.setCookie(...cookies);
    }
    await page.goto(IMMIGRATION_URL + '/WorkingHoliday/Application/Create.aspx?CountryId=' + COUNTRY_ID + '&OffShore=1&STZ=0');
    try {
        await page.waitForSelector('#ContentPlaceHolder1_applyNowButton', {timeout: TIMEOUT * 1000});
        console.log('\tSTATUS', 'OK');
        await common.telegramNotification(TELEGRAM_URL);
    } catch (e) {
        const url = page.url();
        if (url.includes('access-denied')) {
            console.log("\tLOGIN", USERNAME);
            await login(page);
        } else {
            console.log('\tSTATUS', 'NO');
        }
    }
    await browser.close();
}

exports.checkStatus = checkStatus;