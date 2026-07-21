// 곡 및 채보 데이터베이스
const SONG_DATABASE = [
    {id: "anzs_raid",
        title: "안즈스 레이드 BGM",
        bpm: 120, // 4비트 박자 간격 기반 (1박 = 0.5초 / 2박 = 1.0초)
        keys: 4,
        difficulty: "Lv.4 헤비",
        speed: 480,
        notes: [
            // ==========================================
            // 1. [7.6초 ~ 15.0초] 전주 구간 (2박 - 1박 - 1박 반복)
            // ==========================================
            // Loop 1 (7.6s 시작)
            { lane: 0, time: 7.6 },            // 시작 노트 (2박 대기)
            { lane: 1, time: 8.6 },            // 1박
            { lane: 2, time: 9.1 },            // 1박

            // Loop 2 (9.6s 시작)
            { lane: 3, time: 9.6 },            // 2박 대기
            { lane: 2, time: 10.6 },           // 1박
            { lane: 1, time: 11.1 },           // 1박

            // Loop 3 (11.6s 시작)
            { lane: 0, time: 11.6 },           // 2박 대기
            { lane: 2, time: 12.6 },           // 1박
            { lane: 3, time: 13.1 },           // 1박

            // Loop 4 (13.6s 시작 ~ 15s 진입 전 빌드업)
            { lane: 1, time: 13.6 },           // 2박 대기
            { lane: 0, time: 14.6 },           // 1박
            { lane: 3, time: 14.85 },          // 변주 진입 예고 숏노트

            // ==========================================
            // 2. [15.0초 ~ 23.0초] 메인 변주 구간 (베이스 + 4비트 드럼)
            // 박자는 유지되되 드럼/베이스 타격감을 살려 동시타 & 금색 노트 배치!
            // ==========================================
            // 15.0s: 베이스/드럼 강렬한 시작 (임팩트 금색 동시타)
            { lane: 0, time: 15.0, type: "gold" },
            { lane: 3, time: 15.0, type: "gold" },
            { lane: 1, time: 16.0 },           // 1박
            { lane: 2, time: 16.5 },           // 1박

            // 17.0s
            { lane: 1, time: 17.0, type: "gold" },
            { lane: 2, time: 17.0, type: "gold" },
            { lane: 0, time: 18.0 },
            { lane: 3, time: 18.5 },

            // 19.0s (클라이맥스 베이스 연타)
            { lane: 0, time: 19.0, type: "gold" },
            { lane: 1, time: 19.0, type: "gold" },
            { lane: 2, time: 20.0 },
            { lane: 3, time: 20.5 },

            // 21.0s ~ 23.0s (피니시 하이라이트)
            { lane: 0, time: 21.0 },
            { lane: 3, time: 21.0 },
            { lane: 1, time: 21.5 },
            { lane: 2, time: 22.0 },
            
            // 23.0s: 곡을 마무리하는 4키 전체 금색 동시타!
            { lane: 0, time: 23.0, type: "gold" },
            { lane: 1, time: 23.0, type: "gold" },
            { lane: 2, time: 23.0, type: "gold" },
            { lane: 3, time: 23.0, type: "gold" }
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
