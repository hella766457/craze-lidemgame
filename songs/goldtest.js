// 곡 및 채보 데이터
if (typeof SONG_DATABASE === 'undefined') window.SONG_DATABASE = [];

SONG_DATABASE.push({
  id: "금색노트테스트",
  title: "금색노트테스트",
  bgm: "audio/song.mp3",
  bpm: 120,
  keys: 4,
  difficulty: "Lv.3 하드",
  speed: 480,
  notes: [
    { time: 118.75, lane: 0 },
    { time: 119, lane: 1, type: "gold" },
    { time: 119.25, lane: 2, type: "gold" },
    { time: 119.75, lane: 2, type: "gold" },
    { time: 119.75, lane: 0 }
  ]
});
