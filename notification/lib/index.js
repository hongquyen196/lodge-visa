const fetch = require("node-fetch");
const fs = require('fs').promises;

const readCookies = async(hostname) => {
    try {
        const path = './' + hostname + '.cookies.json';
        const rawdata = await fs.readFile(path);
        return JSON.parse(rawdata);
    } catch (e) {
        return [];
    }
}

const writeCookies = async(hostname, cookies) => {
    try {
        const path = './' + hostname + '.cookies.json';
        const rawdata = JSON.stringify(cookies);
        return fs.writeFile(path, rawdata);
    } catch (e) {
        console.error('WRITE FAILED');
    }
}

const telegramNotification = async(url) => {
    try {
        const response = await fetch(url);
        //console.log(response);
    } catch (e) {
        console.error('TELEGRAM FAILED');
    }
}

const newPage = async(browser, hostname) => {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
    });
    let cookies = await readCookies(hostname);
    if (cookies && cookies.length > 0) {
        await page.setCookie(...cookies);
    }
    return page;
}

const getCurrentDate = () => {
   return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
}

exports.readCookies = readCookies;
exports.writeCookies = writeCookies;
exports.telegramNotification = telegramNotification;
exports.newPage = newPage;
exports.getCurrentDate = getCurrentDate;