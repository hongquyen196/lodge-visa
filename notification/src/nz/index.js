const common = require('../../lib');

const IMMI_HOST = 'onlineservices.immigration.govt.nz';
const IMMIGRATION_URL = 'https://onlineservices.immigration.govt.nz';
const USERNAME = 'lhq196';
const PASSWORD = 'QQQ!@#3214Le';
const COUNTRY_ID = '237';
const TIMEOUT = 10;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot5500795753:AAHhd62CpNxfYAo9YjQA09lyGFtZCw8Pquo/sendMessage?chat_id=' + TELEGRAM_ID + '&text=WorkingHoliday_APPLY_NOW';

class NewZealand {

    name = 'NEW ZEALAND';
    page;

    constructor() {}

    init = async(browser) => {
        this.page = await common.newPage(browser, IMMI_HOST);
    }

    login = async(username, password) => {
        try {
            await this.page.goto(IMMIGRATION_URL);
            await this.page.waitForSelector('input[name="username"]');
            await this.page.type('input[name="username"]', username);
            await this.page.type('input[name="password"]', password);
            await this.page.click('input[value="LOGIN"]');
            await this.page.waitForFunction(() => location.search === '?STATUS');
            const cookies = await this.page.cookies();
            return cookies;
        } catch (e) {
            console.error(this.name, 'LOGIN FAILED');
            return [];
        }
    }

    status = async(retry = true) => {
        try {
            await Promise.all([
                this.page.goto(IMMIGRATION_URL + '/WorkingHoliday/Application/Create.aspx?CountryId=' + COUNTRY_ID + '&OffShore=1&STZ=0', { timeout: TIMEOUT * 1000 }),
                this.page.waitForSelector('#ContentPlaceHolder1_applyNowButton', { timeout: TIMEOUT * 1000 })
            ]);
            console.log(this.name, new Date().toISOString(), 'YES');
            await common.telegramNotification(TELEGRAM_URL);
        } catch (e) {
            const url = await this.page.url();
            if (url.includes('access-denied') && retry) {
                console.log(this.name, new Date().toISOString(), 'RELOGIN');
                const cookies = await this.login(USERNAME, PASSWORD);
                await common.writeCookies(IMMI_HOST, cookies);
                await this.status(false);
            } else {
                console.log(this.name, new Date().toISOString(), 'NO');
            }
        }
    }

}

module.exports = NewZealand;