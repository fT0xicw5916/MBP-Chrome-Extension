chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updatePopup(tab);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status === "complete") {
        updatePopup(tab);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === "grades") {
        chrome.storage.local.set({grades: message.data});
    }
});

function updatePopup(tab) {
    if(tab.url.includes("managebac.cn") && (tab.url.endsWith("units") || tab.url.endsWith("core_tasks"))) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["scripts/content.js"]
        });
        chrome.action.setPopup({ tabId: tab.id, popup: "index.html" });
    } else {
        chrome.action.setPopup({ tabId: tab.id, popup: "default.html" });
    }
}