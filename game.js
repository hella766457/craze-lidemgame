// ==========================================
// 1. 기본 게임 설정 및 변수 선언
// ==========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = ['d', 'f', 'j', 'k']; // 4키
const laneWidth = 100;             // 레인 폭
const judgeLineY = 500;            // 판정선 Y 좌표

// 🎵 오디오 객체
let bgmAudio = new Audio();
bgmAudio.preload = "auto";

// 게임 상태 변수
let selectedSongIndex = 0;
let isGaming = false;
let startTime = 0;
let animationFrameId = null;

// 진행 상태 및 기록
let currentNotes = [];
let currentSpeed = 450;
let score = 0;
let combo = 0;
let maxCombo = 0;

// 판정 통계 (PERFECT, GOOD, BAD, MISS)
let cntPerfect = 0;
let cntGood = 0;
let cntBad = 0;
let cntMiss = 0;
let lastJudgeText = "";
let judgeColor = "#fff";

// ==========================================
// 2. 화면 및 곡 선택 로직
// ==========================================

window.addEventListener("load", () => {
    showSelectScreen();
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showSelectScreen() {
    isGaming = false;
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    showScreen('selectScreen');
    renderSongList();
}

function renderSongList() {
    const songListContainer = document.getElementById("songList");
    if (!songListContainer) return;

    songListContainer.innerHTML = "";

    if (typeof SONG_DATABASE === 'undefined' || !Array.isArray(SONG_DATABASE) || SONG_DATABASE.length === 0) {
        songListContainer.innerHTML = `
            <div style="color:#aaa; text-align:center; padding: 20px;">
                등록된 곡이 없습니다.<br>
                songs/ 폴더 및 채보 파일(.js) 연결을 확인하세요.
            </div>`;
        return;
    }

    SONG_DATABASE.forEach((song, idx) => {
        const card = document.createElement("div");
        card.className = `song-card ${idx === selectedSongIndex ? 'selected' : ''}`;
        card.onclick = () => {
            selectedSongIndex = idx;
            renderSongList();
        };

        card.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-info">BPM: ${song.bpm} | 속도: ${song.speed || 450}</div>
        `;
        songListContainer.appendChild(card);
    });
}

// ==========================================
// 3. 게임 시작 및 메인 루프
// ==========================================

function playSelectedSong() {
    if (typeof SONG_DATABASE === 'undefined' || !SONG_DATABASE[selectedSongIndex]) {
        alert("선택된 곡 정보가 없습니다!");
        return;
    }

    const song = SONG_DATABASE[selectedSongIndex];

    showScreen('gameScreen');

    // 변수 초기화
    currentNotes = JSON.parse(JSON.stringify(song.notes));
    currentSpeed = song.speed || 450;
    score = 0;
    combo = 0;
    maxCombo = 0;
    cntPerfect = 0;
    cntGood = 0;
    cntBad = 0;
    cntMiss = 0;
    lastJudgeText = "";

    // 음악 재생
    if (song.bgm) {
        bgmAudio.src = song.bgm;
        bgmAudio.currentTime = 0;
        bgmAudio.play().catch(err => {
            console.warn("오디오 자동재생 제한:", err);
        });
    }

    startTime = Date.now();
    isGaming = true;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    requestAnimationFrame(update);
}

function update() {
    if (!isGaming) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentTime = (bgmAudio && !bgmAudio.paused && bgmAudio.currentTime > 0) 
        ? bgmAudio.currentTime 
        : (Date.now() - startTime) / 1000;

    // 레인 구분선
    for (let i = 1; i < 4; i++) {
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
    }

    // 판정선
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, judgeLineY);
    ctx.lineTo(canvas.width, judgeLineY);
    ctx.stroke();

    // 노트 이동 및 지나친 노트 MISS 처리
    for (let i = currentNotes.length - 1; i >= 0; i--) {
        let note = currentNotes[i];
        let timeDiff = note.time - currentTime;
        let noteY = judgeLineY - (timeDiff * currentSpeed);

        if (noteY > -20 && noteY < canvas.height + 20) {
            ctx.fillStyle = "#00e5ff";
            ctx.fillRect(note.lane * laneWidth + 10, noteY - 10, laneWidth - 20, 20);
        }

        // 판정선 하단 지나쳤을 때 (MISS)
        if (timeDiff < -0.15) {
            processJudge("MISS");
            currentNotes.splice(i, 1);
        }
    }

    drawUI();

    if (currentNotes.length === 0 && currentTime > 1) {
        setTimeout(showResults, 1500);
        return;
    }

    animationFrameId = requestAnimationFrame(update);
}

function drawUI() {
    // 점수
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 15, 35);

    // 콤보
    if (combo > 0) {
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${combo} COMBO`, canvas.width / 2, 230);
    }

    // 판정 문구 (PERFECT, GOOD, BAD, MISS)
    if (lastJudgeText) {
        ctx.fillStyle = judgeColor;
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(lastJudgeText, canvas.width / 2, 280);
    }
}

// ==========================================
// 4. 키 입력 및 4단계 판정 로직
// ==========================================

window.addEventListener("keydown", (e) => {
    if (!isGaming) return;

    const keyIndex = keys.indexOf(e.key.toLowerCase());
    if (keyIndex === -1) return;

    let currentTime = (bgmAudio && !bgmAudio.paused && bgmAudio.currentTime > 0) 
        ? bgmAudio.currentTime 
        : (Date.now() - startTime) / 1000;

    let targetIndex = -1;
    let minTimeDiff = 999;

    for (let i = 0; i < currentNotes.length; i++) {
        if (currentNotes[i].lane === keyIndex) {
            let diff = Math.abs(currentNotes[i].time - currentTime);
            if (diff < minTimeDiff) {
                minTimeDiff = diff;
                targetIndex = i;
            }
        }
    }

    // 판정 오차 범위 계산 (초 단위)
    if (targetIndex !== -1 && minTimeDiff < 0.20) {
        if (minTimeDiff <= 0.04) {
            processJudge("PERFECT");
        } else if (minTimeDiff <= 0.09) {
            processJudge("GOOD");
        } else {
            processJudge("BAD");
        }

        currentNotes.splice(targetIndex, 1);
    }
});

function processJudge(judge) {
    lastJudgeText = judge;

    if (judge === "PERFECT") {
        score += 1000;
        combo++;
        cntPerfect++;
        judgeColor = "#00e5ff"; // 하늘색
    } else if (judge === "GOOD") {
        score += 500;
        combo++;
        cntGood++;
        judgeColor = "#00ff88"; // 연두색
    } else if (judge === "BAD") {
        score += 100;
        combo = 0; // BAD는 콤보 초기화
        cntBad++;
        judgeColor = "#ffbb00"; // 주황색
    } else if (judge === "MISS") {
        combo = 0; // MISS 콤보 초기화
        cntMiss++;
        judgeColor = "#ff3355"; // 빨간색
    }

    if (combo > maxCombo) maxCombo = combo;
}

// ==========================================
// 5. 결과 화면 출력 (PERFECT / GOOD / BAD / MISS)
// ==========================================

function showResults() {
    isGaming = false;
    if (bgmAudio) bgmAudio.pause();

    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setEl("resultScore", score.toLocaleString());
    setEl("resPerfect", cntPerfect);
    setEl("resGood", cntGood);
    setEl("resBad", cntBad);
    setEl("resMiss", cntMiss);
    setEl("resMaxCombo", maxCombo);

    showScreen('resultScreen');
}
