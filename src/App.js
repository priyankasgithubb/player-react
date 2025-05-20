import React, { useRef, useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + "/image/image.jpeg"})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [time, setTime] = useState({ current: 0, total: 0 });

  const playlist = [
    {
      src: process.env.PUBLIC_URL + "/songs/IU 'Love wins all'.mp3",
      image: process.env.PUBLIC_URL + "/image/love wins all image.jpeg"
    },
    {
      src: process.env.PUBLIC_URL + "/songs/Ricky Montgomery - Line Without a Hook .mp3",
      image: process.env.PUBLIC_URL + "/image/hook image.jpeg"
    },
    {
      src: process.env.PUBLIC_URL + "/songs/Djo - End Of Beginning.mp3",
      image: process.env.PUBLIC_URL + "/image/end of beginning image.jpeg"
    },
    {
      src: process.env.PUBLIC_URL + "/songs/I Think They Call This Love (Cover).mp3",
      image: process.env.PUBLIC_URL + "/image/love image.jpeg"
    },
    {
      src: process.env.PUBLIC_URL + "/songs/ROSÉ & Bruno Mars - APT.mp3",
      image: process.env.PUBLIC_URL + "/image/apt image.jpeg"
    }
  ];

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = useCallback((index) => {
    setTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const nextTrack = useCallback(() => {
    const next = (trackIndex + 1) % playlist.length;
    playTrack(next);
  }, [trackIndex, playlist.length, playTrack]);

  const prevTrack = () => {
    const prev = (trackIndex - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setTime({ current: audio.currentTime, total: audio.duration || 0 });
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, [trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnd = () => nextTrack();

    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("ended", onEnd);
    };
  }, [nextTrack]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [trackIndex, isPlaying]);

  return (
    <div style={backgroundStyle}>
      <div className="player">
        <h1>🎧 MP3 Player 🎶🫧</h1>

        <img
          src={playlist[trackIndex].image}
          alt="Album Art"
          className="album-art"
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "16px",
            marginBottom: "20px"
          }}
        />

        <p>Now Playing: {playlist[trackIndex].src.split("/").pop()}</p>

        <audio ref={audioRef} src={playlist[trackIndex].src} />

        <div className="controls">
          <button onClick={prevTrack}>⏮ Prev</button>
          <button onClick={togglePlay}>{isPlaying ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={nextTrack}>Next ⏭</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px", width: "100%" }}>
          <span>{formatTime(time.current)}</span>
          <input
            type="range"
            className="progress-bar"
            min={0}
            max={time.total}
            value={time.current}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
                setTime((prev) => ({ ...prev, current: newTime }));
              }
            }}
            style={{ flex: 1 }}
          />
          <span>{formatTime(time.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
