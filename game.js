// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = ['d', 'f', 'j', 'k'];
const laneWidth = 100;
const judgeLineY = 500;
const START_DELAY = 2.0;

let selectedSongIndex = 0;
let isGaming = false;
let startTime = 0;
let currentSpeed = 450;

let score = 0;
let combo = 0;
let cntNice = 0;
let cntGood = 0;
let cntMiss = 0;
let lastJudgeText = "";
let lastJudgeColor = "#fff";
let judgeTimer = 0;

let currentNotes = [];

// 곡 목록 랜더링
function renderSongList() {
    const container = document.getElementById("songListContainer");
    if (!container) return;
    
    // SONG_DATABASE 로드 체크
    if (typeof SONG_DATABASE === 'undefined') {
        console.error("SONG_DATABASE가 정의되지 않았습니다. songs.js 로드 순서를 확인하세요.");
        return;
    }

    container.innerHTML = "";

    SONG_DATABASE.forEach((song, index) => {
        const card = document.createElement("div");
        card.className = `song-card ${index === selectedSongIndex ? 'selected' : ''}`;
        card.onclick = () => selectSong(index);
        card.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-info">BPM: ${song.bpm} | ${song.keys} Keys</div>
            <span class="difficulty">${song.difficulty}</span>
        `;
        container.appendChild(card);
    });
}

function selectSong(index) {
    selectedSongIndex = index;
    renderSongList();
}

function playSelectedSong() {
    if (typeof SONG_DATABASE === 'undefined' || !SONG_DATABASE[selectedSongIndex]) return;
    
    const song = SONG_DATABASE[selectedSongIndex];

    showScreen('gameScreen');
    currentNotes = JSON.parse(JSON.stringify(song.notes));
    currentSpeed = song.speed || 450;
    
    startTime = Date.now();
    score = 0;
    combo = 0;
    cntNice = 0;
    cntGood = 0;
    cntMiss = 0;
    lastJudgeText = "";
    isGaming = true;
    
    requestAnimationFrame(update);
}

function triggerJudge(text, color, addScore, judgeType) {
    lastJudgeText = text;
    lastJudgeColor = color;
    judgeTimer = 30;

    if (judgeType === "NICE") {
        cntNice++;
        combo++;
        score += addScore;
    } else if (judgeType === "GOOD") {
        cntGood++;
        combo++;
        score += addScore;
    } else if (judgeType === "MISS") {
        cntMiss++;
        combo = 0;
    }
}

function update() {
    if (!isGaming) return;

    let currentTime = ((Date.now() - startTime) / 1000) - START_DELAY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < 4; i++) {
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
    }

    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, judgeLineY);
    ctx.lineTo(canvas.width, judgeLineY);
    ctx.stroke();

    if (currentTime < 0) {
        ctx.fillStyle = "#ffcc00";
        ctx.font = "italic bold 40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("READY...", canvas.width / 2, 250);
    } else {
        for (let i = currentNotes.length - 1; i >= 0; i--) {
            let note = currentNotes[i];
            let timeDiff = note.time - currentTime;
            let noteY = judgeLineY - (timeDiff * currentSpeed);

            if (timeDiff < -0.16) {
                triggerJudge("MISS", "#ff3333", 0, "MISS");
                currentNotes.splice(i, 1);
                continue;
            }

            if (noteY > -20 && noteY < canvas.height + 20) {
                if (note.type === "gold") {
                    ctx.fillStyle = "#ffd700";
                    ctx.shadowColor = "#ffaa00";
                    ctx.shadowBlur = 12;
                    ctx.fillRect(note.lane * laneWidth + 8, noteY - 10, laneWidth - 16, 20);
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(note.lane * laneWidth + 8, noteY - 10, laneWidth - 16, 20);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = "#00e5ff";
                    ctx.fillRect(note.lane * laneWidth + 8, noteY - 10, laneWidth - 16, 20);
                }
            }
        }
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 15, 35);

    if (judgeTimer > 0 && currentTime >= 0) {
        judgeTimer--;
        ctx.textAlign = "center";
        ctx.fillStyle = lastJudgeColor;
        ctx.font = "italic bold 36px sans-serif";
        ctx.fillText(lastJudgeText, canvas.width / 2, 300);

        if (combo > 1) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px sans-serif";
            ctx.fillText(`${combo} COMBO`, canvas.width / 2, 335);
        }
    }

    const lastNoteTime = SONG_DATABASE[selectedSongIndex].notes.slice(-1)[0]?.time || 10;
    if (currentNotes.length === 0 && currentTime > lastNoteTime + 1.0) {
        isGaming = false;
        showResults();
        return;
    }

    requestAnimationFrame(update);
}

function showResults() {
    const clearStatusElem = document.getElementById("clearStatus");

    if (cntMiss === 0 && cntGood === 0) {
        clearStatusElem.innerText = "ALL NICE!!";
        clearStatusElem.style.color = "#00e5ff";
    } else if (cntMiss === 0) {
        clearStatusElem.innerText = "FULL COMBO!";
        clearStatusElem.style.color = "#00ff66";
    } else {
        clearStatusElem.innerText = "STAGE CLEAR";
        clearStatusElem.style.color = "#ffffff";
    }

    document.getElementById("finalScore").innerText = score;
    document.getElementById("niceCount").innerText = cntNice;
    document.getElementById("goodCount").innerText = cntGood;
    document.getElementById("missCount").innerText = cntMiss;

    showScreen("resultScreen");
}

window.addEventListener('keydown', (e) => {
    if (!isGaming) return;
    
    let currentTime = ((Date.now() - startTime) / 1000) - START_DELAY;
    if (currentTime < 0) return;

    const keyIndex = keys.indexOf(e.key.toLowerCase());
    if (keyIndex !== -1) {
        checkHit(keyIndex, currentTime);
    }
});

function checkHit(lane, currentTime) {
    let targetIndex = -1;
    let minDiff = 999;

    for (let i = 0; i < currentNotes.length; i++) {
        if (currentNotes[i].lane === lane) {
            let diff = Math.abs(currentNotes[i].time - currentTime);
            if (diff < minDiff) {
                minDiff = diff;
                targetIndex = i;
            }
        }
    }

    if (targetIndex !== -1 && minDiff <= 0.16) {
        const hitNote = currentNotes[targetIndex];
        const multiplier = (hitNote.type === "gold") ? 2 : 1;

        if (minDiff <= 0.08) {
            triggerJudge("NICE", "#00e5ff", 500 * multiplier, "NICE");
        } else {
            triggerJudge("GOOD", "#00ff66", 300 * multiplier, "GOOD");
        }
        currentNotes.splice(targetIndex, 1);
    }
}

window.onload = () => {
    renderSongList();
};
