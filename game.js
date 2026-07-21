const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = ['d', 'f', 'j', 'k'];
const laneWidth = 100;
const judgeLineY = 500;

// 🎵 BGM 오디오 객체 관리
let bgmAudio = new Audio();
bgmAudio.preload = "auto";

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

// 페이지 로드 시 곡 목록 불러오기
window.addEventListener("load", () => {
    showSelectScreen();
});

// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// 🎵 곡 목록 로드 및 선택창 표시
function loadSongList() {
    const songListContainer = document.getElementById("songList");
    if (!songListContainer) return;
    
    songListContainer.innerHTML = "";

    if (typeof SONG_DATABASE === 'undefined' || !Array.isArray(SONG_DATABASE) || SONG_DATABASE.length === 0) {
        songListContainer.innerHTML = "<div style='color:#aaa; text-align:center; padding: 20px;'>등록된 곡이 없습니다.<br>songs/ 폴더 및 채보 JS 파일 연결을 확인하세요.</div>";
        return;
    }

    SONG_DATABASE.forEach((song, idx) => {
        const card = document.createElement("div");
        card.className = `song-card ${idx === selectedSongIndex ? 'selected' : ''}`;
        card.onclick = () => selectSong(idx);
        card.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-info">BPM: ${song.bpm} | 속도: ${song.speed || 450}</div>
        `;
        songListContainer.appendChild(card);
    });
}

function selectSong(index) {
    selectedSongIndex = index;
    loadSongList();
}

function showSelectScreen() {
    isGaming = false;
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    showScreen('selectScreen');
    loadSongList();
}

// 🎵 게임 시작 (노래 즉시 재생 및 싱크 동기화)
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
    cntGreat = 0;
    cntGood = 0;
    cntMiss = 0;
    lastJudgeText = "";

    // 오디오 재생
    if (song.bgm) {
        bgmAudio.src = song.bgm;
        bgmAudio.currentTime = 0;
        bgmAudio.play().catch(e => {
            console.warn("오디오 자동재생 차단됨:", e);
        });
    }

    startTime = Date.now();
    isGaming = true;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    requestAnimationFrame(update);
}

// 메인 프레임 루프
function update() {
    if (!isGaming) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎵 오디오 재생 시간 기준으로 게임 타임 측정 (없으면 시작시점 타임)
    let currentTime = (bgmAudio && !bgmAudio.paused && bgmAudio.currentTime > 0) 
        ? bgmAudio.currentTime 
        : (Date.now() - startTime) / 1000;

    // 레인 구분선 그려주기
    for (let i = 1; i < 4; i++) {
        ctx.strokeStyle = "#222";
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
    }

    // 판정선 그려주기
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, judgeLineY);
    ctx.lineTo(canvas.width, judgeLineY);
    ctx.stroke();

    // 노트 낙하 및 MISS 처리
    for (let i = currentNotes.length - 1; i >= 0; i--) {
        let note = currentNotes[i];
        let timeDiff = note.time - currentTime;
        let noteY = judgeLineY - (timeDiff * currentSpeed);

        if (noteY > -20 && noteY < canvas.height + 20) {
            ctx.fillStyle = "#00e5ff";
            ctx.fillRect(note.lane * laneWidth + 10, noteY - 10, laneWidth - 20, 20);
        }

        // 지장 판정 범위를 벗어나면 MISS 처리
        if (timeDiff < -0.15) {
            processJudge("MISS");
            currentNotes.splice(i, 1);
        }
    }

    drawUI();

    // 모든 노트가 끝나고 1.5초 후 결과 화면으로
    if (currentNotes.length === 0 && currentTime > 1) {
        setTimeout(showResults, 1500);
        return;
    }

    animationFrameId = requestAnimationFrame(update);
}

// 키 판정 입력 처리
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

// 결과 화면 출력
function showResults() {
    isGaming = false;
    if (bgmAudio) bgmAudio.pause();

    const resScore = document.getElementById("resultScore");
    if (resScore) resScore.innerText = score.toLocaleString();
    
    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setEl("resPerfect", cntPerfect);
    setEl("resGreat", cntGreat);
    setEl("resGood", cntGood);
    setEl("resMiss", cntMiss);
    setEl("resMaxCombo", maxCombo);

    showScreen('resultScreen');
}
