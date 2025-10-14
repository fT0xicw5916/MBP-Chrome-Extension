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
    } else if(message.type === "url") {
        if(message.data === "core_tasks") {
            chrome.action.setPopup({ tabId: sender.tab.id, popup: "core_tasks.html" });
        } else if(message.data === "units") {
            chrome.action.setPopup({ tabId: sender.tab.id, popup: "units.html" });
        }
    } else if(message.type === "task_num") {
        chrome.storage.local.set({task_num: message.data});
    }
});

function updatePopup(tab) {
    if(tab.url.includes("managebac.cn")) {
        if(tab.url.includes("units")) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["scripts/content_units.js"]
            });
            chrome.action.setPopup({ tabId: tab.id, popup: "units.html" });
        } else if(tab.url.includes("core_tasks")) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["scripts/content_core_tasks.js"]
            });
            chrome.action.setPopup({ tabId: tab.id, popup: "core_tasks.html" });
        }
    }
}