const LAST_X_HOURS = 24

const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = () => {
        if(xmlHttp.readyState == 4) {
            if(xmlHttp.status == 200) {
                callback(xmlHttp.responseText);
            } else {
                throw `${xmlHttp.status}: ${xmlHttp.statusText}`;
            }
        }
    }
    xmlHttp.send(null);
}

let chart;
let userInfo;

let name;
let matches;;
let reqCounter;
let reqLen;

function submit() {
    // Initializing
    if(chart) chart.destroy();
    name = document.getElementById("input").value;
    matches = {lol: [], tft: []};
    reqLen = 0;
    reqCounter = 0;

    startChain();
}

function startChain() {
    // Getting user info
    httpGet(`/api?hostname=na1.api.riotgames.com&path=/lol/summoner/v4/summoners/by-name/${name}?api_key=$key`, res => {
        userInfo = JSON.parse(res);
        iterateMatches("lol", matches.lol, drawGraph);
        iterateMatches("tft", matches.tft, drawGraph);
    })
}

function iterateMatches(game, m, callback) {
    // Getting user's recent match history
    httpGet(`/api?hostname=americas.api.riotgames.com&path=/${game}/match/${game == "lol" ? "v5" : "v1"}/matches/by-puuid/${userInfo.puuid}/ids?api_key=$key`, res => {
        let matchIDs = JSON.parse(res);
        let len = Math.min(matchIDs.length, 8) // setting max for API rate limits
        reqLen += len;
        // Looping through each match
        for(let i = 0; i < len; i++) {
            // Getting match's details
            httpGet(`/api?hostname=americas.api.riotgames.com&path=/${game}/match/${game == "lol" ? "v5" : "v1"}/matches/${matchIDs[i]}?api_key=$key`, res => {
                reqCounter += 1;
                let match = JSON.parse(res); 
                // Checking if match occured less than 24 hours ago
                let now = Date.now();
                let start = ((game == "lol" ? match.info.gameStartTimestamp : match.info.game_datetime) - now) / 1000 / 60 / 60;
                let end = ((game == "lol" ? match.info.gameEndTimestamp : match.info.game_datetime + match.info.game_length * 1000) - now) / 1000 / 60 / 60;
                if(start >= -LAST_X_HOURS) {
                    console.log(`Match ${i + 1} of ${game} found`);
                    // If so, pushing to array
                    m.push({x: start, y: -1});
                    m.push({x: start, y: 0.5});
                    m.push({x: end, y: 0.5});;
                    m.push({x: end, y: -1});
                }
                // Once done iterating:
                if(reqCounter == reqLen) {
                    callback();
                }
            })
        }
    })
}

function drawGraph() {
    chart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "LoL",
                    data: matches.lol,
                    borderColor: "green",
                    showLine: true
                }, {
                    label: "TFT",
                    data: matches.tft,
                    borderColor: "orange",
                    showLine: true
                }
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `${userInfo.name}'s Time Played In Last ${LAST_X_HOURS} Hours`,
                    font: {size: 20},
                    color: "rgb(200, 200, 200)"
                }
            },
            scales: {
                x: {
                    min: -LAST_X_HOURS,
                    max: 0,
                    grid: {color: "rgb(200, 200, 200)"},
                    title: {
                        display: true, 
                        text: "Hours Ago",
                        font: {size: 14},
                        color: "rgb(200, 200, 200)"
                    }
                },
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                    },
                    grid: {color: "rgb(200, 200, 200)"},
                    title: {
                        display: true, 
                        text: "In Game Status",
                        font: {size: 14},
                        color: "rgb(200, 200, 200)"
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        },
    });
}
