const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = ['d', 'f', 'j', 'k'];
const laneWidth = 100;
const judgeLineY = 500;
const START_DELAY = 2; // Readiness 딜레이 (2초)

// 🎵 오디오 객체 생성
let bgmAudio = new Audio();
bgmAudio.preload = "auto"; // 음악 미리 로드 설정

let selectedSongIndex = 0;
let isGaming = false;
let startTime = 0;
let animationFrameId = null;

let currentNotes = [];
let currentSpeed = 450;
let score = 0;
let combo = 0;
let maxCombo = 0;

let cntPerfect = 0;
let cntGreat = 0;
let cntGood = 0;
let cntMiss = 0;
let lastJudgeText = "";
let judgeColor = "#fff";

window.addEventListener("DOMContentLoaded", () => {
    loadSongList();
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function loadSongList() {
    const songListContainer = document.getElementById("songList");
    songListContainer.innerHTML = "";

    if (typeof SONG_DATABASE === 'undefined' || SONG_DATABASE.length === 0) {
        songListContainer.innerHTML = "<div style='color:#aaa; text-align:center;'>등록된 곡이 없습니다.</div>";
        return;
    }

    SONG_DATABASE.forEach((song, idx) => {
        const card = document.createElement("div");
        card.className = `song-card ${idx === selectedSongIndex ? 'selected' : ''}`;
        card.onclick = () => selectSong(idx);
        card.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-info">BPM: ${song.bpm} | 난이도: ${song.difficulty || 'Normal'}</div>
        `;
        songListContainer.appendChild(card);
    });
}

function selectSong(index) {
    selectedSongIndex = index;
    loadSongList();
}

// 로비로 돌아갈 때 음악 정지
function showSelectScreen() {
    isGaming = false;
    bgmAudio.pause();
    bgmAudio.currentTime = 0;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    showScreen('selectScreen');
}

// 🎵 [수정됨] 게임 시작 및 오디오 재생 처리
function playSelectedSong() {
    if (typeof SONG_DATABASE === 'undefined' || !SONG_DATABASE[selectedSongIndex]) return;

    const song = SONG_DATABASE[selectedSongIndex];

    showScreen('gameScreen');

    currentNotes = JSON.parse(JSON.stringify(song.notes));
    currentSpeed = song.speed || 450;
    score = 0;
    combo = 0;
    maxCombo = 0;
    cntPerfect = 0;
    cntGreat = 0;
    cntGood = 0;
    cntMiss = 0;
    lastJudgeText = "";

    // 1. 클릭 시점에 오디오 세팅 및 무음 재생 시도 (브라우저 잠금 해제)
    if (song.bgm) {
        bgmAudio.src = song.bgm;
        bgmAudio.currentTime = 0;
        
        // 버튼을 누른 바로 이 순간 play()를 호출하여 브라우저의 소리 차단을 해제합니다.
        let playPromise = bgmAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 재생 성공 시 일단 일시정지 후 2초 뒤 재생
                bgmAudio.pause();
                bgmAudio.currentTime = 0;
            }).catch(error => {
                console.error("오디오 재생 실패:", error);
            });
        }
    }

    startTime = Date.now();
    isGaming = true;

    // 2. 2초 카운트다운 후 실제 BGM 재생 시작
    setTimeout(() => {
        if (isGaming && song.bgm) {
            bgmAudio.currentTime = 0;
            bgmAudio.play().catch(e => console.error("BGM 재생 오류:", e));
        }
    }, START_DELAY * 1000);

    requestAnimationFrame(update);
}

// 메인 루프
function update() {
    if (!isGaming) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentTime = (Date.now() - startTime) / 1000 - START_DELAY;

    // 레인 구분선
    for (let i = 1; i < 4; i++) {
        ctx.strokeStyle = "#222";
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

    // 노트 이동 및 MISS 처리
    for (let i = currentNotes.length - 1; i >= 0; i--) {
        let note = currentNotes[i];
        let timeDiff = note.time - currentTime;
        let noteY = judgeLineY - (timeDiff * currentSpeed);

        if (noteY > -20 && noteY < canvas.height + 20) {
            ctx.fillStyle = "#00e5ff";
            ctx.fillRect(note.lane * laneWidth + 10, noteY - 10, laneWidth - 20, 20);
        }

        if (timeDiff < -0.15) {
            processJudge("MISS");
            currentNotes.splice(i, 1);
        }
    }

    drawUI();

    // 모든 노트 처리 완료 시 결과 화면
    if (currentNotes.length === 0 && currentTime > 2) {
        setTimeout(showResults, 1000);
        return;
    }

    animationFrameId = requestAnimationFrame(update);
}

// 키 입력 처리
window.addEventListener("keydown", (e) => {
    if (!isGaming) return;

    const keyIndex = keys.indexOf(e.key.toLowerCase());
    if (keyIndex === -1) return;

    let currentTime = (Date.now() - startTime) / 1000 - START_DELAY;

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

    if (targetIndex !== -1 && minTimeDiff < 0.18) {
        if (minTimeDiff <= 0.04) processJudge("PERFECT");
        else if (minTimeDiff <= 0.08) processJudge("GREAT");
        else processJudge("GOOD");

        currentNotes.splice(targetIndex, 1);
    }
});

function processJudge(judge) {
    lastJudgeText = judge;

    if (judge === "PERFECT") {
        score += 1000;
        combo++;
        cntPerfect++;
        judgeColor = "#00e5ff";
    } else if (judge === "GREAT") {
        score += 700;
        combo++;
        cntGreat++;
        judgeColor = "#00ff88";
    } else if (judge === "GOOD") {
        score += 400;
        combo++;
        cntGood++;
        judgeColor = "#ffbb00";
    } else if (judge === "MISS") {
        combo = 0;
        cntMiss++;
        judgeColor = "#ff3355";
    }

    if (combo > maxCombo) maxCombo = combo;
}

function drawUI() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`SCORE: ${score}`, 15, 35);

    if (combo > 0) {
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${combo} COMBO`, canvas.width / 2, 250);
    }

    if (lastJudgeText) {
        ctx.fillStyle = judgeColor;
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(lastJudgeText, canvas.width / 2, 300);
    }

    ctx.textAlign = "left";
}

// 결과 화면 진입 및 음악 끄기
function showResults() {
    isGaming = false;
    bgmAudio.pause();

    document.getElementById("resultScore").innerText = score.toLocaleString();
    document.getElementById("resPerfect").innerText = cntPerfect;
    document.getElementById("resGreat").innerText = cntGreat;
    document.getElementById("resGood").innerText = cntGood;
    document.getElementById("resMiss").innerText = cntMiss;
    document.getElementById("resMaxCombo").innerText = maxCombo;

    showScreen('resultScreen');
}
