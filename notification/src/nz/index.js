const { TimeoutError } = require('puppeteer');
const common = require('../../lib');

const IMMI_HOST = 'onlineservices.immigration.govt.nz';
const IMMIGRATION_URL = 'https://onlineservices.immigration.govt.nz';
const USERNAME = 'hongquyen196';
const PASSWORD = 'QQQ!@#3214Le';
const COUNTRY_ID = '237';
const TIMEOUT = 30;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot5500795753:AAHhd62CpNxfYAo9YjQA09lyGFtZCw8Pquo/sendMessage?chat_id=' + TELEGRAM_ID + '&text=';

const PAYMENT = {
    CARD_HOLDER: 'LE HONG QUYEN',
    CARD_NUMBER: '4665843700754667',
    EXPIRY_DATE: '09/24',
    CARD_VERIFICATION_CODE: '053',
}

class NewZealand {

    name = 'NEW ZEALAND';
    page;

    constructor() { }

    init = async (browser) => {
        this.page = await common.newPage(browser, IMMI_HOST);
    }

    login = async (username, password) => {
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

    status = async (retry = true) => {
        try {
            await Promise.all([
                this.page.goto(IMMIGRATION_URL + '/WorkingHoliday/Application/Create.aspx?CountryId=' + COUNTRY_ID + '&OffShore=1&STZ=0', { timeout: TIMEOUT * 1000 }),
                this.page.waitForSelector('#ContentPlaceHolder1_applyNowButton', { timeout: TIMEOUT * 1000 })
            ]);
            console.log(this.name, new Date().toISOString(), 'YES');
            await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_APPLY_NOW');
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

    tryPayVisa = async (retry = true) => {
        try {
            await Promise.all([
                this.page.goto(IMMIGRATION_URL + '/WorkingHoliday/default.aspx', { timeout: TIMEOUT * 1000 }),
                this.page.waitForSelector('#ContentPlaceHolder1_applicationList_applicationsDataGrid_payHyperLink_0', { timeout: TIMEOUT * 1000 })
            ]);
            await this.page.click('#ContentPlaceHolder1_applicationList_applicationsDataGrid_payHyperLink_0');

            console.log(this.name, new Date().toISOString(), 'CLICK PAYMENT SITE');
            await this.page.waitForSelector('#ContentPlaceHolder1_onlinePaymentAnchor2', { timeout: TIMEOUT * 1000 });
            await this.page.click('#ContentPlaceHolder1_onlinePaymentAnchor2');

            console.log(this.name, new Date().toISOString(), 'TYPE PAYMENT NAME');
            await this.page.waitForSelector('#_ctl0_ContentPlaceHolder1_payerNameTextBox', { timeout: TIMEOUT * 1000 });
            await this.page.type('#_ctl0_ContentPlaceHolder1_payerNameTextBox', PAYMENT.CARD_HOLDER);

            console.log(this.name, new Date().toISOString(), 'CLICK PAY');
            await this.page.waitForSelector('#_ctl0_ContentPlaceHolder1_okButton', { timeout: TIMEOUT * 1000 });
            await this.page.click('#_ctl0_ContentPlaceHolder1_okButton');

            // REOPEN CHECK AT PAGE PAYMENT 
            await this.page.waitForSelector('#cardnumber', { timeout: TIMEOUT * 1000 });
            console.log(this.name, new Date().toISOString(), 'CAN PAY NOW !!');

            //Notification to Tegegram
            await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_PAY_NOW');

            await this.page.type('#cardnumber', PAYMENT.CARD_NUMBER);
            await this.page.type('#expirydate', PAYMENT.EXPIRY_DATE);
            await this.page.type('#cardverificationcode', PAYMENT.CARD_VERIFICATION_CODE);
            await this.page.type('#cardholder', PAYMENT.CARD_HOLDER);
            await this.page.click('.payment-button');

            //Spam notification to Tegegram
            for (let index = 0; index < 100; index++) {
                await common.telegramNotification(TELEGRAM_URL + 'WorkingHoliday_PAY_NOW');
                await this.page.waitForTimeout(3000);
            }

        } catch (e) {
            if (e instanceof TimeoutError) {
                const url = await this.page.url();
                if ((url.includes('access-denied') || url.includes('error')) && retry) {
                    console.log(this.name, new Date().toISOString(), 'RELOGIN');
                    const cookies = await this.login(USERNAME, PASSWORD);
                    await common.writeCookies(IMMI_HOST, cookies);
                    await this.tryPayVisa(false);
                } else {
                    console.log(this.name, new Date().toISOString(), 'CANNOT PAY');
                    await this.page.screenshot({ path: `nz_screenshot.jpeg` });
                }
            } else {
                console.log(e);
            }
        }
    }

}

module.exports = NewZealand;