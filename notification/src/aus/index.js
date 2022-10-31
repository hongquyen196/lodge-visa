const { TimeoutError } = require('puppeteer');
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
const TELEGRAM_URL = 'https://api.telegram.org/bot5778841539:AAEB7OTIc4iXJWd9mX-ABUxxyU87yVYkWcA/sendMessage?chat_id=' + TELEGRAM_ID + '&text=';


class Australia {

    name = 'AUSTRALIA';
    page;
    retryCount = 1;

    constructor() { }

    init = async (browser) => {
        this.page = await common.newPage(browser, IMMI_HOST);
    }

    login = async (username, password) => {
        try {
            await this.page.goto(IMMIGRATION_URL + '/lusc/login');
            await this.page.waitForSelector('input[name="username"]');
            await this.page.type('input[name="username"]', username);
            await this.page.type('input[name="password"]', password);
            const login = await this.page.waitForXPath('//button[@name="login"][text()="Login"]');
            await login.click();
            const btnContinue = await this.page.waitForSelector('button[name="continue"]');
            await btnContinue.click();
            const btnEdit = await this.page.waitForSelector('button[name="defaultActionPanel_0_1"]');
            await btnEdit.click();
            const cookies = await this.page.cookies();
            return cookies;
        } catch (e) {
            console.error(this.name, 'LOGIN FAILED');
            return [];
        }
    }

    status = async () => {
        try {
            await Promise.all([
                await this.page.goto(IMMIGRATION_STATUS_URL, { timeout: TIMEOUT * 1000 }),
                await this.page.waitForXPath('//tr[.//td[text()="' + COUNTRY + '"]]//span[contains(text(),"open")]', { timeout: TIMEOUT * 1000 })
            ]);
            console.log(this.name, new Date().toISOString(), 'YES');
            await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_APPLY_NOW');
        } catch (e) {
            console.log(this.name, new Date().toISOString(), 'NO');
        }
    }

    tryLodgeVisa = async () => {
        try {
            await this.page.goto(IMMIGRATION_URL + '/ola/app');
            const btnEdit = await this.page.waitForSelector('button[name="defaultActionPanel_0_1"]', { timeout: TIMEOUT * 1000 });
            await btnEdit.click();
            await this.page.waitForSelector("html");
            console.log(this.name, new Date().toISOString(), 'CLICK EDIT');
            await this.page.waitForFunction(() => location.pathname === '/elp/app');
            await this.retry();
        } catch (e) {
            if (e instanceof TimeoutError) {
                const url = await this.page.url();
                if (url.includes('/lusc/login')) {
                    console.log(this.name, new Date().toISOString(), 'RELOGIN');
                    const cookies = await this.login(USERNAME, PASSWORD);
                    await common.writeCookies(IMMI_HOST, cookies);
                }
                await this.tryLodgeVisa();
            } else {
                console.log(e);
            }
        }
    }

    retry = async () => {
        try {
            console.log(this.name, new Date().toISOString(), 'CLICK NEXT');
            const btnNext = await this.page.waitForSelector('button[title="Go to next page"]');
            await btnNext.click();
            await this.page.waitForSelector("html");
            this.retryCount++;
            await this.page.waitForXPath('//span[text()="' + this.retryCount + '/16"]', { timeout: TIMEOUT * 1000 });

            // REOPEN CHECK AT PAGE 5 
            await this.page.waitForXPath('//span[text()="5/16"]', { timeout: TIMEOUT * 1000 });
            console.log(this.name, new Date().toISOString(), 'CAN APPLY NOW !!');

            //Notification to Tegegram
            await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_APPLY_NOW');

            //Spam notification to Tegegram
            for (let index = 0; index < 100; index++) {
                await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_APPLY_NOW');
                await this.page.waitForTimeout(3000);
            }
        } catch (e) {
            if (e instanceof TimeoutError) {
                const url = await this.page.url();
                if (url.includes('/lusc/login')) {
                    console.log(this.name, new Date().toISOString(), 'RELOGIN');
                    await this.login(USERNAME, PASSWORD);
                    await this.tryLodgeVisa();
                } if (url.includes('/elp/app')) {
                    const pageName = await this.page.$(".wc-message");
                    if (pageName != null || this.retryCount > 4) {
                        console.log(this.name, new Date().toISOString(), 'CANNOT GO TO PAGE 5');
                        await this.page.screenshot({ path: `screenshots/aus_screenshot.jpeg` });
                    } else {
                        await this.retry();
                    }
                }
            } else {
                console.log(e);
            }
        }
    }
}

module.exports = Australia;