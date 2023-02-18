const fetch = require("node-fetch");
const FormData = require('form-data');
const fs = require('fs');



var formdata = new FormData();
formdata.append("photo", fs.createReadStream('screenshots/aus_screenshot.jpeg'));

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://api.telegram.org/bot6012885781:AAHCeSUB3KavmfHiqfae-g6-sWPO0moYYfk/sendPhoto?chat_id=5507130023", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));