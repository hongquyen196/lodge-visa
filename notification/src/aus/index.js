const { TimeoutError } = require('puppeteer');
const common = require('../../lib');

const IMMI_HOST = 'online.immi.gov.au';
const IMMI_STATUS_HOST = 'immi.homeaffairs.gov.au';
const IMMIGRATION_URL = 'https://online.immi.gov.au';
const IMMIGRATION_STATUS_URL = 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps';

const USERNAME = 'hasmanian196@gmail.com';
const PASSWORD = 'QQQ!@#3214LeHong1';
const COUNTRY = 'Vietnam';
const TIMEOUT = 20;

class Australia {

    name = 'AUSTRALIA';
    page;
    retryCount = 1;

    constructor() { }

    init = async (browser) => {
        this.page = await common.newPage(browser, IMMI_HOST);
        await common.telegramSendMessage(common.getCurrentDate() + ' START');
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
            await common.telegramSendMessage(common.getCurrentDate() + ' LOGIN FAILED', true);
            await this.page.screenshot({ path: 'screenshots/aus_screenshot.jpeg' });
            await common.telegramSendPhoto('screenshots/aus_screenshot.jpeg', true);
            return [];
        }
    }

    status = async () => {
        try {
            await Promise.all([
                await this.page.goto(IMMIGRATION_STATUS_URL, { timeout: TIMEOUT * 1000 }),
                await this.page.waitForXPath('//tr[.//td[text()="' + COUNTRY + '"]]//span[contains(text(),"open")]', { timeout: TIMEOUT * 1000 })
            ]);
            console.log(this.name, common.getCurrentDate(), 'YES');
            await common.telegramSendMessage('WorkingHoliday_APPLY_NOW');
        } catch (e) {
            console.log(this.name, common.getCurrentDate(), 'NO');
        }
    }

    tryLodgeVisa = async () => {
        try {
            await this.page.goto(IMMIGRATION_URL + '/ola/app');
            const btnEdit = await this.page.waitForSelector('button[name="defaultActionPanel_0_1"]', { timeout: TIMEOUT * 1000 });
            await btnEdit.click();
            await this.page.waitForSelector("html");
            console.log(this.name, common.getCurrentDate(), 'CLICK EDIT');
            await common.telegramSendMessage(common.getCurrentDate() + ' CLICK EDIT', true);
            await this.page.waitForFunction(() => location.pathname === '/elp/app');
            await this.retry();
        } catch (e) {
            try {
                if (e instanceof TimeoutError) {
                    const url = await this.page.url();
                    if (url.includes('/lusc/login')) {
                        console.log(this.name, common.getCurrentDate(), ' RELOGIN ' + USERNAME);
                        await common.telegramSendMessage(common.getCurrentDate() + ' RELOGIN ' + USERNAME, true);
                        const cookies = await this.login(USERNAME, PASSWORD);
                        await common.writeCookies(IMMI_HOST, cookies);
                    }
                    await this.tryLodgeVisa();
                } else {
                    console.log(e);
                    await common.telegramSendMessage('L1 ' + common.getCurrentDate() + e, true);
                    await this.page.screenshot({ path: 'screenshots/aus_screenshot.jpeg' });
                    await common.telegramSendPhoto('screenshots/aus_screenshot.jpeg', true);
                    await this.tryLodgeVisa();
                }
            } catch (e) {
                await common.telegramSendMessage('L2 ' + common.getCurrentDate() + e, true);
                await this.page.screenshot({ path: 'screenshots/aus_screenshot.jpeg' });
                await common.telegramSendPhoto('screenshots/aus_screenshot.jpeg', true);
                await this.tryLodgeVisa();
            }
        }
    }

    retry = async () => {
        try {
            console.log(this.name, common.getCurrentDate(), ' NEXT PAGE ' + this.retryCount);
            const btnNext = await this.page.waitForSelector('button[title="Go to next page"]');
            await btnNext.click();
            await common.telegramSendMessage(common.getCurrentDate() + ' NEXT PAGE ' + this.retryCount, true);
            await this.page.waitForSelector("html");
            this.retryCount++;
            await this.page.waitForXPath('//span[text()="' + this.retryCount + '/16"]', { timeout: TIMEOUT * 1000 });

            // REOPEN CHECK AT PAGE 5 
            await this.page.waitForXPath('//span[text()="5/16"]', { timeout: TIMEOUT * 1000 });
            await common.telegramSendMessage(common.getCurrentDate() + ' WorkingHoliday_APPLY_NOW', true);
            console.log(this.name, common.getCurrentDate(), ' CAN APPLY NOW !!');

            //Notification to Tegegram
            await common.telegramSendMessage(common.getCurrentDate() + ' WorkingHoliday_APPLY_NOW');

            //Spam notification to Tegegram
            for (let index = 0; index < 100; index++) {
                await common.telegramSendMessage(common.getCurrentDate() + ' WorkingHoliday_APPLY_NOW');
                await this.page.waitForTimeout(1000);
            }
            await this.tryLodgeVisa();
        } catch (e) {
            if (e instanceof TimeoutError) {
                const url = await this.page.url();
                if (url.includes('/elp/app')) {
                    const pageName = await this.page.$(".wc-message"); //If got error it takes a screenshot
                    if (pageName != null) {
                        console.log(this.name, common.getCurrentDate(), ' CANNOT NEXT PAGE ' + this.retryCount);
                        // GET CURRENT PAGE
                        // const f = await this.page.$("[class='wc-message']")
                        // const text = await (await f.getProperty('textContent')).jsonValue()
                        // console.log(text);
                        await this.page.screenshot({ path: 'screenshots/aus_screenshot.jpeg' });
                        await common.telegramSendPhoto('screenshots/aus_screenshot.jpeg', true);
                        
                        this.retryCount = 4;
                        await this.retry();
                    } else {
                        await this.retry();
                    }
                } else {
                    this.retryCount = 1;
                    throw e;
                }
            }
        }
    }
}

module.exports = Australia;