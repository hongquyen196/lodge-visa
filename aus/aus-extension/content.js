// inject Script
['jquery.js', 'inject.js'].forEach(src => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})
chrome.runtime.onMessage.addListener((msg) => {
    console.log(msg);
});