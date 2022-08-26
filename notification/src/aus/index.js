const common = require('../../lib');

const IMMI_HOST = 'online.immi.gov.au';
const IMMI_STATUS_HOST = 'immi.homeaffairs.gov.au';
const IMMIGRATION_URL = 'https://online.immi.gov.au';
const IMMIGRATION_STATUS_URL = 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps';

const USERNAME = 'hongquyen196@gmail.com';
const PASSWORD = 'QQQ!@#3214LeHong';
const COUNTRY = 'Vietnam';
const TIMEOUT = 30;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot5778841539:AAEB7OTIc4iXJWd9mX-ABUxxyU87yVYkWcA/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';


class Australia {

    name = 'AUSTRALIA';
    page;

    constructor() {}

    init = async(browser) => {
        this.page = await common.newPage(browser, IMMI_HOST);
    }

    login = async(username, password) => {
        try {
            await this.page.goto(IMMIGRATION_URL + '/lusc/login');
            await this.page.waitForSelector('input[name="username"]');
            await this.page.type('input[name="username"]', username);
            await this.page.type('input[name="password"]', password);
            const login = await this.page.waitForXPath('//button[@name="login"][text()="Login"]');
            await login.click();
            await this.page.waitForXPath('//h1[@class="panelHeading"][text()="Login successful"]');
            cookies = await this.page.cookies();
            return cookies;
        } catch (e) {
            console.error(this.name, 'LOGIN FAILED');
            return [];
        }
    }

    status = async() => {
        try {
            await Promise.all([
                await this.page.goto(IMMIGRATION_STATUS_URL, { timeout: TIMEOUT * 1000 }),
                await this.page.waitForXPath('//tr[.//td[text()="' + COUNTRY + '"]]//span[contains(text(),"open")]', { timeout: TIMEOUT * 1000 })
            ]);
            console.log(this.name, new Date().toISOString(), 'YES');
            await common.telegramNotification(TELEGRAM_URL);
        } catch (e) {
            console.log(this.name, new Date().toISOString(), 'NO');
            const cookies = await this.page.cookies();
            await common.writeCookies(IMMI_STATUS_HOST, cookies);
        }
    }

    tryLodgeVisa = async() => {
        await this.page.goto(IMMIGRATION_URL);
        const url = this.page.url();
        if (url.includes('/lusc/login')) {
            console.log(this.name, new Date().toISOString(), 'RELOGIN');
            const cookies = await this.login(USERNAME, PASSWORD);
            await common.writeCookies(IMMI_HOST, cookies);
        }
    }

}

module.exports = Australia;