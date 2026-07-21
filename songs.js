// 곡 및 채보 데이터베이스
const SONG_DATABASE = [
    {
        id: "anzs_raid",
        title: "안즈스 레이드 BGM",
        bpm: 130,
        keys: 4,
        difficulty: "Lv.4 헤비",
        speed: 480,
        notes: [
            // [1. 초반 전주 구간: 4비트 천천히 떨어지는 단타 (1박자 = 0.46초)]
            { lane: 0, time: 1.5 },
            { lane: 1, time: 1.96 },
            { lane: 2, time: 2.42 },
            { lane: 3, time: 2.88 },
            { lane: 1, time: 3.34 },
            { lane: 2, time: 3.80 },
            { lane: 0, time: 4.26 },
            { lane: 3, time: 4.72 },

            // [2. 본곡 시작 임팩트: 금색 노트 동시타 + 16비트 연타 구간]
            { lane: 0, time: 5.5, type: "gold" }, // ★ 황금 노트
            { lane: 3, time: 5.5, type: "gold" }, // ★ 황금 노트 (동시타)
            
            // 계단식 연타
            { lane: 1, time: 5.73 },
            { lane: 1, time: 5.84 },
            { lane: 1, time: 5.95 },
            { lane: 2, time: 6.06 },
            { lane: 2, time: 6.17 },
            { lane: 2, time: 6.28 },

            // 트릴(Trill) 구간
            { lane: 1, time: 6.5 },
            { lane: 2, time: 6.62 },
            { lane: 1, time: 6.74 },
            { lane: 2, time: 6.86 },
            { lane: 1, time: 6.98 },
            { lane: 2, time: 7.10 },

            // [3. 하이라이트 구간: 화려한 폭타 + 금색 포인트 노트]
            { lane: 0, time: 7.5 }, { lane: 1, time: 7.5 },
            { lane: 2, time: 7.73 }, { lane: 3, time: 7.73 },
            
            // 하이라이트 금색 폭타 (2배 점수)
            { lane: 0, time: 7.96, type: "gold" },
            { lane: 2, time: 7.96, type: "gold" },
            
            { lane: 1, time: 8.19 }, { lane: 3, time: 8.19 },
            
            // 16비트 연속 폭타
            { lane: 0, time: 8.42 }, { lane: 1, time: 8.535 }, 
            { lane: 2, time: 8.65 }, { lane: 3, time: 8.765 },
            
            { lane: 0, time: 9.0, type: "gold" },
            { lane: 1, time: 9.0, type: "gold" },
            { lane: 2, time: 9.0, type: "gold" },
            { lane: 3, time: 9.0, type: "gold" }, // ★ 4키 전체 금색 동시타

            { lane: 1, time: 9.6 }, { lane: 2, time: 9.83 },
            { lane: 0, time: 10.06 }, { lane: 3, time: 10.29 }
        ]
    },
    {
        id: "test_song_1",
        title: "기본 연습곡",
        bpm: 120,
        keys: 4,
        difficulty: "Lv.2 노말",
        speed: 400,
        notes: [
            { lane: 0, time: 1.5 }, { lane: 1, time: 2.2 }, 
            { lane: 2, time: 2.9 }, { lane: 3, time: 3.6 },
            { lane: 1, time: 4.5 }, { lane: 2, time: 5.2 },
            { lane: 0, time: 6.0, type: "gold" }, { lane: 3, time: 6.0, type: "gold" },
            { lane: 1, time: 7.0 }, { lane: 2, time: 7.8 }
        ]
    }
];
