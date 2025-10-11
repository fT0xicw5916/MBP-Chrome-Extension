function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function main() {
    chrome.runtime.sendMessage({type: "url", data: "core_tasks"});
    
    var section = getElementByXPath("/html/body/div/main/aside/div/section[2]/div").childNodes;
    var grades = [];
    Array.from(section).forEach((child, index) => {
        if(index % 2 === 1 && index !== 1) {
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

            category.push(score === '-' ? null : score.slice(score.indexOf('(') + 1, score.indexOf('%')));
            grades.push(category);
        }
    });
    chrome.runtime.sendMessage({type: "grades", data: grades});

    var tasks = [];
    var section = getElementByXPath("/html/body/div/main/div[2]/div/section/div/div[3]").childNodes;
    Array.from(section).forEach((child, idx) => {
        console.log(child);
    });
    chrome.runtime.sendMessage({type: "tasks", data: tasks});
}

main();