// inject Script
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener((msg) => {
    console.log(msg);
});