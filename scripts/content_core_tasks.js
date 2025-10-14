function getElementByXPath(parentNode, path) {
    return document.evaluate(path, parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function main() {
    chrome.runtime.sendMessage({type: "url", data: "core_tasks"});
    
    var section = getElementByXPath(document, "/html/body/div/main/aside/div/section[2]/div").childNodes;
    var grades = [];
    var task_num = {};
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
            if(!(category[0] in task_num) && (category[0] !== "Overall" && category[0] !== "整体") && (category[0] !== "Mid-term" && category[0] !== "期中考试") && (category[0] !== "Final" && category[0] !== "期末考试")) {
                task_num[category[0]] = 0;
            }
        }
    });
    chrome.runtime.sendMessage({type: "grades", data: grades});

    var section = getElementByXPath(document, "/html/body/div/main/div[2]/div/section/div/div[3]").childNodes;
    Array.from(section).forEach((child, idx) => {
        if(child.nodeType === 1) {
            if(child.className === "fusion-card-item short-assignment section flex flex-wrap") {
                var tags = getElementByXPath(child, "div[1]/div[2]/div/div").childNodes;
                Array.from(tags).forEach((tag, index) => {
                    if(tag.nodeType === 1) {
                        if(tag.innerText in task_num) {
                            task_num[tag.innerText] += 1;
                        }
                    }
                });
            }
        }
    });
    chrome.runtime.sendMessage({type: "task_num", data: task_num});
}

main();