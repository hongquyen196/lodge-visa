const fetch = require("node-fetch");
const FormData = require('form-data');
const fs = require('fs');
const fsp = fs.promises;

const TELEGRAM_ID = '5507130023';
const TELEGRAM_URL = 'https://api.telegram.org/bot';
const TELEGRAM_TOKEN = '5778841539:AAEB7OTIc4iXJWd9mX-ABUxxyU87yVYkWcA';
const TELEGRAM_DEBUG_TOKEN = '6012885781:AAHCeSUB3KavmfHiqfae-g6-sWPO0moYYfk';

const SEND_MESSAGE = TELEGRAM_URL + TELEGRAM_TOKEN + '/sendMessage?chat_id=' + TELEGRAM_ID;
const SEND_MESSAGE_DEBUG = TELEGRAM_URL + TELEGRAM_DEBUG_TOKEN + '/sendMessage?chat_id=' + TELEGRAM_ID;

const SEND_PHOTO = TELEGRAM_URL + TELEGRAM_TOKEN + '/sendPhoto?chat_id=' + TELEGRAM_ID;
const SEND_PHOTO_DEBUG = TELEGRAM_URL + TELEGRAM_DEBUG_TOKEN + '/sendPhoto?chat_id=' + TELEGRAM_ID;

const readCookies = async (hostname) => {
    try {
        const path = './' + hostname + '.cookies.json';
        const rawdata = await fsp.readFile(path);
        return JSON.parse(rawdata);
    } catch (e) {
        return [];
    }
}

const writeCookies = async (hostname, cookies) => {
    try {
        const path = './' + hostname + '.cookies.json';
        const rawdata = JSON.stringify(cookies);
        return fsp.writeFile(path, rawdata);
    } catch (e) {
        console.error('WRITE FAILED');
    }
}

const telegramSendMessage = async (text, debug = false) => {
    try {
        const response = await fetch((debug ? SEND_MESSAGE_DEBUG : SEND_MESSAGE) + '&text=' + text);
        console.log(response.status);
    } catch (e) {
        console.error('TELEGRAM FAILED', e);
    }
}

const telegramSendPhoto = async (photo, debug = false) => {
    try {
        var formdata = new FormData();
        formdata.append("photo", fs.createReadStream(photo));
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };
        const response = await fetch((debug ? SEND_PHOTO_DEBUG : SEND_PHOTO), requestOptions);
        console.log(response.status);
    } catch (e) {
        console.error('TELEGRAM FAILED', e);
    }
}

const newPage = async (browser, hostname) => {
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
exports.telegramSendMessage = telegramSendMessage;
exports.telegramSendPhoto = telegramSendPhoto;
exports.newPage = newPage;
exports.getCurrentDate = getCurrentDate;