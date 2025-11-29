document.getElementById("sim-exam-form").addEventListener("submit", function(event) {
    event.preventDefault();

    chrome.storage.local.get(["grades"], function(r) {
        var grades = r.grades;

        var overall = grades[0][2];
        overall = overall === null ? 0. : parseFloat(overall);

        var a = 0.;
        grades.forEach(function(category, idx) {
            if(category[2] !== null && idx !== 0) {
                a += parseInt(category[1]) / 100.;
            }
        });

        var target = parseFloat(document.getElementById("target").value);

        var result;
        if(document.getElementById("mid-final").value === "mid") {
            var tmp = 0.;
            grades.forEach(function(category, idx) {
                if(category[2] !== null && idx !== 0 && (category[0] !== "Mid-term" && category[0] !== "期中考试")) {
                    tmp += parseInt(category[1]) / 100.;
                }
            });
            
            result = (((a + 0.2) * target) - (tmp * overall)) / 0.2;
        } else {
            var tmp = 0.;
            grades.forEach(function(category, idx) {
                if(category[2] !== null && idx !== 0 && (category[0] !== "Final" && category[0] !== "期末考试")) {
                    tmp += parseInt(category[1]) / 100.;
                }
            });
            
            result = (((a + 0.3) * target) - (tmp * overall)) / 0.3;
        }

        document.getElementById("result").innerHTML = "- " + result.toFixed(2) + "% -";
    });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: "update", data: 1}, (response) => {
        if(response && response.grades) {
            chrome.storage.local.set({grades: response.grades});
        }
    });
});
