// 곡 및 채보 데이터베이스
const SONG_DATABASE = [
    {
        id: "test_song_1",
        title: "테스트 곡 1",
        bpm: 120,
        keys: 4,
        difficulty: "HARD Lv.5",
        speed: 450,
        // 노트 데이터 (시간: 초, 레인: 0~3)
        notes: [
            { lane: 0, time: 1.5 }, { lane: 1, time: 2.0 }, { lane: 2, time: 2.5 }, { lane: 3, time: 3.0 },
            { lane: 2, time: 3.5 }, { lane: 1, time: 4.0 }, { lane: 0, time: 4.5 },
            { lane: 0, time: 5.5 }, { lane: 3, time: 5.5 },
            { lane: 1, time: 6.0 }, { lane: 2, time: 6.25 }, { lane: 1, time: 6.5 }, { lane: 2, time: 6.75 },
            { lane: 0, time: 7.5 }, { lane: 1, time: 7.75 }, { lane: 2, time: 8.0 }, { lane: 3, time: 8.25 },
            { lane: 2, time: 8.5 }, { lane: 1, time: 8.75 }, { lane: 0, time: 9.0 },
            { lane: 0, time: 10.0 }, { lane: 2, time: 10.0 },
            { lane: 1, time: 10.5 }, { lane: 3, time: 10.5 },
            { lane: 0, time: 11.0 }, { lane: 1, time: 11.0 }, { lane: 2, time: 11.0 }, { lane: 3, time: 11.0 },
            { lane: 1, time: 12.0 }, { lane: 2, time: 12.3 }, { lane: 1, time: 12.6 },
            { lane: 0, time: 13.5 }, { lane: 3, time: 13.5 }
        ]
    },
    {
        id: "test_song_2",
        title: "테스트 곡 2 (새 곡 예시)",
        bpm: 140,
        keys: 4,
        difficulty: "EASY Lv.2",
        speed: 400,
        notes: [
            { lane: 0, time: 1.0 }, { lane: 1, time: 2.0 },
            { lane: 2, time: 3.0 }, { lane: 3, time: 4.0 }
        ]
    }
];
