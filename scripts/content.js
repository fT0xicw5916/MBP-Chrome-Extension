function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function main() {
    var section = getElementByXPath("/html/body/div[2]/main/aside/div[2]/div/div[2]/div[1]/section[2]/div").childNodes;
    var grades = [];
    Array.from(section).forEach((child) => {
        if(child.nodeType === 1) {
            var fullName = child.childNodes[1].innerText;
            var score = child.childNodes[3].innerText;
            var category = [];
            if(fullName === "Overall" || fullName === "整体") {
                category.push(fullName);
                category.push(null);
            } else {
                category.push(fullName.slice(0, fullName.indexOf(' ')));
                category.push(fullName.slice(fullName.indexOf('(') + 1, fullName.indexOf('%')));
            }

            if(score === "(NaN%)") {
                category.push(null);
            } else {
                category.push(score === '-' ? null : score.slice(score.indexOf('(') + 1, score.indexOf('%')));
            }
            
            grades.push(category);
        }
    });
    grades.shift();
    chrome.runtime.sendMessage({type: "grades", data: grades});
    return grades;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === "update") {
        sendResponse({grades: main()});
    }
});

main();