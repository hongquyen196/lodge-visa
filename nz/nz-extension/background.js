chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.from === "content") {
        console.log(msg.data);
    }
});