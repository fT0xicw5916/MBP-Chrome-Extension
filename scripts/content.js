function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function main() {
    let section = getElementByXPath("/html/body/div/main/aside/div/section[2]");
    console.log(section);
}

main();