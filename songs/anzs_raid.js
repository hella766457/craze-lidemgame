// SONG_DATABASE 배열이 없으면 새로 생성하고, 있으면 거기에 이 곡을 추가합니다.
window.SONG_DATABASE = window.SONG_DATABASE || [];

window.SONG_DATABASE.push({
    id: "anzs_raid",
    title: "안즈스 레이드 BGM",
    bpm: 120,
    keys: 4,
    difficulty: "Lv.4 헤비",
    speed: 480,
    notes: [
        // [7.6초 ~ 15.0초] 전주 구간
        { lane: 0, time: 7.6 }, { lane: 1, time: 8.6 }, { lane: 2, time: 9.1 },
        { lane: 3, time: 9.6 }, { lane: 2, time: 10.6 }, { lane: 1, time: 11.1 },
        { lane: 0, time: 11.6 }, { lane: 2, time: 12.6 }, { lane: 3, time: 13.1 },
        { lane: 1, time: 13.6 }, { lane: 0, time: 14.6 }, { lane: 3, time: 14.85 },

        // [15.0초 ~ 23.0초] 메인 변주 구간 (골드 노트 포함)
        { lane: 0, time: 15.0, type: "gold" }, { lane: 3, time: 15.0, type: "gold" },
        { lane: 1, time: 16.0 }, { lane: 2, time: 16.5 },
        { lane: 1, time: 17.0, type: "gold" }, { lane: 2, time: 17.0, type: "gold" },
        { lane: 0, time: 18.0 }, { lane: 3, time: 18.5 },
        { lane: 0, time: 19.0, type: "gold" }, { lane: 1, time: 19.0, type: "gold" },
        { lane: 2, time: 20.0 }, { lane: 3, time: 20.5 },
        { lane: 0, time: 21.0 }, { lane: 3, time: 21.0 },
        { lane: 1, time: 21.5 }, { lane: 2, time: 22.0 },
        { lane: 0, time: 23.0, type: "gold" }, { lane: 1, time: 23.0, type: "gold" },
        { lane: 2, time: 23.0, type: "gold" }, { lane: 3, time: 23.0, type: "gold" }
    ]
});
