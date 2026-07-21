// 곡 및 채보 데이터베이스
const SONG_DATABASE = [
    {
        id: "test_song_1",
        title: "테스트 곡 1",
        bpm: 120,
        keys: 4,
        difficulty: "Lv.2 노말",
        speed: 400,
        // Lv.2 노말: 적당한 박자감과 무난한 기본 노트 위주
        notes: [
            { lane: 0, time: 1.5 }, { lane: 1, time: 2.2 }, 
            { lane: 2, time: 2.9 }, { lane: 3, time: 3.6 },
            { lane: 1, time: 4.5 }, { lane: 2, time: 5.2 },
            { lane: 0, time: 6.0 }, { lane: 3, time: 6.0 }, // 기본 동시타
            { lane: 1, time: 7.0 }, { lane: 2, time: 7.8 },
            { lane: 0, time: 8.5 }, { lane: 1, time: 9.0 }, 
            { lane: 2, time: 9.5 }, { lane: 3, time: 10.0 },
            { lane: 1, time: 11.0 }, { lane: 2, time: 11.0 }
        ]
    },
    {
        id: "test_song_2",
        title: "테스트 곡 2",
        bpm: 135,
        keys: 4,
        difficulty: "Lv.3 하드",
        speed: 480,
        // Lv.3 하드: 빠른 8비트/16비트 계단, 잦은 동시타 및 연타 포함
        notes: [
            // 도입부 8비트 리듬
            { lane: 0, time: 1.2 }, { lane: 1, time: 1.6 }, { lane: 2, time: 2.0 }, { lane: 3, time: 2.4 },
            { lane: 2, time: 2.8 }, { lane: 1, time: 3.2 }, { lane: 0, time: 3.6 },
            
            // 동시타 + 빠른 계단
            { lane: 0, time: 4.2 }, { lane: 3, time: 4.2 },
            { lane: 1, time: 4.6 }, { lane: 2, time: 4.8 }, { lane: 1, time: 5.0 }, { lane: 2, time: 5.2 },
            
            // 16비트 빠른 4연타
            { lane: 0, time: 6.0 }, { lane: 1, time: 6.15 }, { lane: 2, time: 6.3 }, { lane: 3, time: 6.45 },
            
            // 트릴(Trill) 구간
            { lane: 1, time: 7.2 }, { lane: 2, time: 7.4 }, { lane: 1, time: 7.6 }, { lane: 2, time: 7.8 },
            { lane: 0, time: 8.2 }, { lane: 3, time: 8.2 },
            
            // 클라이맥스 동시타 폭타
            { lane: 0, time: 9.0 }, { lane: 1, time: 9.0 },
            { lane: 2, time: 9.4 }, { lane: 3, time: 9.4 },
            { lane: 0, time: 9.8 }, { lane: 2, time: 9.8 },
            { lane: 1, time: 10.2 }, { lane: 3, time: 10.2 },
            
            // 피니시
            { lane: 0, time: 11.0 }, { lane: 1, time: 11.0 }, { lane: 2, time: 11.0 }, { lane: 3, time: 11.0 }
        ]
    }
];
