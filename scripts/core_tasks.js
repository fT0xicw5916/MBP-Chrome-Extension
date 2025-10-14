document.getElementById("sim-exam-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var grades;
    chrome.storage.local.get(["grades"], function(result) {
        grades = result.grades;
    });

    var overall = grades[0][2];
    overall = overall === null ? 0. : parseFloat(overall);

    var a = 0.;
    grades.forEach(function(category, idx) {
        if(category[1] !== null && idx !== 0) {
            a += parseInt(category[1]) / 100.;
        }
    });

    var target = parseFloat(document.getElementById("target").value);

    var result;
    if(document.getElementById("mid-final").value === "mid") {
        var tmp = 0.;
        grades.forEach(function(category, idx) {
            if(category[1] !== null && idx !== 0 && (category[0] !== "Mid-term Exam" && category[0] !== "期中考试")) {
                tmp += parseInt(category[1]) / 100.;
            }
        });
            
        result = (((a + 0.2) * target) - (tmp * overall)) / 0.2;
    } else {
        var tmp = 0.;
        grades.forEach(function(category, idx) {
            if(category[1] !== null && idx !== 0 && (category[0] !== "Final Exam" && category[0] !== "期末考试")) {
                tmp += parseInt(category[1]) / 100.;
            }
        });
            
        result = (((a + 0.3) * target) - (tmp * overall)) / 0.3;
    }

    document.getElementById("result").innerHTML = result.toFixed(2);
});

function newTaskPredict(rawScore, maxScore, currentOverall, taskNum, localAvg, grades, category) {
    var perScore = Math.round((rawScore / maxScore) * 100. * 100) / 100;

    var totalWeight = Object.values(grades).filter(v => v[0] !== null).reduce((acc, v) => acc + v[1], 0);
    if(totalWeight === 0) {
        return [perScore, perScore, '-', '-'];
    }

    currentOverall = currentOverall ?? 0;
    localAvg = localAvg ?? 0;

    var newLocalAvg = Math.round(((localAvg * taskNum) + perScore) / (taskNum + 1) * 100) / 100;

    var excludedOverallScore = 0.;
    for(var [_, value] of Object.entries(grades)) {
        if(value[0] === null) continue;
        excludedOverallScore += value[0] * value[1];
    }
    excludedOverallScore -= (grades[category][0] ?? 0) * grades[category][1];

    var newOverall;
    if(localAvg === 0) {
        var denom = totalWeight + grades[category][1];
        newOverall = Math.round((excludedOverallScore + (newLocalAvg * grades[category][1])) / denom * 100) / 100;
    } else {
        newOverall = Math.round((excludedOverallScore + (newLocalAvg * grades[category][1])) / totalWeight * 100) / 100;
    }

    var deltaLocal = (newLocalAvg - localAvg).toFixed(2);
    var deltaOverall = (newOverall - currentOverall).toFixed(2);

    var formattedDeltaLocal = (deltaLocal >= 0 ? '+' : '') + deltaLocal;
    var formattedDeltaOverall = (deltaOverall >= 0 ? '+' : '') + deltaOverall;

    return [newLocalAvg, newOverall, formattedDeltaLocal, formattedDeltaOverall];
}

document.getElementById("sim-task-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var rawScore = document.getElementById("raw-score").value;
    var maxScore = document.getElementById("max-score").value;

    var g;
    chrome.storage.local.get(["grades"], function(result) {
        g = result.grades;
    });
    var currentOverall = g[0][2];
    currentOverall = currentOverall === null ? 0. : parseFloat(currentOverall);

    var t;
    chrome.storage.local.get(["task_num"], function(result) {
        t = result.task_num;
    });
    var category = document.getElementById("categories").value;
    var taskNum = t[category];

    var localAvg;
    g.forEach(function(cat, idx) {
        if(cat[0] === category) localAvg = cat[2];
    });

    console.log(rawScore, maxScore, currentOverall, taskNum, localAvg, category);
    // Still developing!
});

document.addEventListener("DOMContentLoaded", function() {
    var tasks;
    chrome.storage.local.get(["task_num"], function(result) {
        tasks = result.task_num;

        var categoriesElement = document.getElementById("categories");
        Object.entries(tasks).forEach((category, idx) => {
            var option = new Option(category[0], category[0]);
            categoriesElement.add(option);
        });
    });
});