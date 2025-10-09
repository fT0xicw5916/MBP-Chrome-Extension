document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get(["grades"], function(result) {
        if(result.grades) {
            document.getElementById("grades").innerText = JSON.stringify(result.grades);
        }
    });
});