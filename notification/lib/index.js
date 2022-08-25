const fetch = require("node-fetch");
const fs = require('fs').promises;

const readCookies = async (path) => {
    let cookies = [];
    try {
        const rawdata = await fs.readFile(path);
        cookies = JSON.parse(rawdata);
    } catch (e) {
    }
    // console.log('readCookies', cookies);
    return cookies;
}

const writeCookies = async (path, cookies) => {
    let rawdata = JSON.stringify(cookies);
    // console.log('writeCookies', cookies);
    return fs.writeFile(path, rawdata);
}

const telegramNotification = async (url) => {
    try {
        const response = await fetch(url);
        console.log(response);
    } catch (e) {
    }
}

exports.readCookies = readCookies;
exports.writeCookies = writeCookies;
exports.telegramNotification = telegramNotification;