import React, { useState } from "react";
import {FaStepForward, FaStepBackward, FaForward, FaBackward, FaPlay, FaPause} from "react-icons/fa";
import { useEffect } from "react";

import api from "../../services/api";

import "./styles.css";

export default function Dashboard() {
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState([]);
  const [lyricsFailed, setLyricsFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [songFailed, setSongFailed] = useState(false);
  const [songMessage, setSongMessage] = useState("");
  const [isPaused, setIsPaused] = useState(true);


  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    async function handleInit() {
      const code = localStorage.getItem("code");
      const state = localStorage.getItem("state");
      const refresh_token = localStorage.getItem("refresh_token");

      try {
        if (!refresh_token) {
          var response = await api.post("/get-song", { code, state });
          localStorage.setItem("refresh_token", response.data.refresh_token);
          if(response.data.is_playing != undefined){
            setIsPaused(isPaused => !response.data.is_playing);
            setProgress(response.data.progress_ms);
            setDuration(response.data.item.duration_ms);
          }
        } else {
          var response = await api.put("/get-song-refreshed", {
            refresh_token,
          });
          localStorage.setItem("refresh_token", response.data.refresh_token);
          if(response.data.is_playing != undefined){
            setIsPaused(isPaused => !response.data.is_playing);
            setProgress(response.data.progress_ms);
            setDuration(response.data.item.duration_ms);
          }
        }

        if (
          response.status === 200 &&
          (songName !== response.data.item.name ||
            artist !== response.data.item.artists[0].name)
        ) {
          setSongFailed(false);
          setSongName(response.data.item.name);
          setArtist(response.data.item.artists[0].name);
          const lyricsResponse = await api.get(
            `https://api.lyrics.ovh/v1/${response.data.item.artists[0].name}/${response.data.item.name}`
          );

          if (lyricsResponse.status === 200) {
            let lyrics = lyricsResponse.data.lyrics
              .split("\n\n")
              .join("\n")
              .split("\n");
            const lyricsArray = [];

            for (let phrase of lyrics) {
              if (phrase === "") {
                lyricsArray.push("");
              } else {
                lyricsArray.push(phrase);
              }
            }

            setLyricsFailed(false);
            setLyrics(lyricsArray);
          } else {
            setLyricsFailed(true);
            setMessage("We couldn't find the lyrics for this song :(");
          }
        } else if (response.status === 206) {
          setSongFailed(true);
          setLyricsFailed(true);
          setMessage("");
          setSongMessage("You are not listening to anything yet!");
        }
      } catch (error) {
        setLyricsFailed(true);
        setMessage("We couldn't find the lyrics for this song :(");
      }
    }

    handleInit();
    setTimeout(() => setCounter((counter) => counter + 1), [2000]);
  }, [counter]);

  useEffect(() => {
    const slider =  document.querySelector("#slider");
    const thumb = slider.querySelector("#thumb");
    const pastSlider = slider.querySelector("#past-slider");

    const percentage = progress*100/duration;

    if(percentage < 100){
      thumb.style.left = `calc(${percentage.toFixed(1)}% - 8px)`;

      pastSlider.style.width = `calc(${percentage.toFixed(1)}% - 2.5px)`;
    }

  }, [progress]);

  async function handlePlay() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;
      
      if(isPaused){
        response = await api.put("/play",{refresh_token});

        if(response.status === 206){
          setIsPaused(isPaused => !isPaused);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
      }else{
        response = await api.put("/pause",{refresh_token});

        if(response.status === 206){
          setIsPaused(isPaused => !isPaused);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
      }

      if(response.status === 204){
        setIsPaused(isPaused => !isPaused);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handlePrevious() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;

      response = await api.put("/previous",{refresh_token});

      if(response.status === 206){
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handleNext() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;
      
      response = await api.put("/next",{refresh_token});

      if(response.status === 206){
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handleRewind() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;
      
      response = await api.put("/rewind",{refresh_token});

      if(response.status === 206){
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handleForward() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;
      
      response = await api.put("/forward",{refresh_token});

      if(response.status === 204){
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handlePlaybackSeek(){
    let slider = document.querySelector('#slider');
    let thumb = slider.querySelector('#thumb');
  }

  async function handleThumbDrag(event){
      let slider = document.querySelector("#slider");
      let thumb = slider.querySelector('#thumb');

      event.preventDefault();

      let shiftX = event.clientX - thumb.getBoundingClientRect().left;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;

        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = slider.offsetWidth - thumb.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        thumb.style.left = newLeft + 'px';
      }

      function onMouseUp() {
        handlePlaybackSeek();

        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
  }

  return (
    <div className="container" id="dashboard-container">
      <div className="player-container">
        <div id="slider">
          <div id="past-slider"></div>
          <div id="thumb" onMouseDown={handleThumbDrag} onDragStart={() => false}></div>
        </div>
        <div className="buttons-container">
          <button className="previous-btn" onClick={handlePrevious}><FaStepBackward size={16} /></button>
          <button className="rewind-btn" onClick={handleRewind}><FaBackward size={16} /></button>
          <button className="play-btn" onClick={handlePlay}>{isPaused ? <FaPlay size={16} /> : <FaPause size={16} />}</button>
          <button className="forward-btn" onClick={handleForward}><FaForward size={16} /></button>
          <button className="next-btn" onClick={handleNext}><FaStepForward size={16} /></button>
        </div>
      </div>
      <div className="content" id="dashboard-content">
        <h1>Spotify-Lyrics</h1>
        {!songFailed ? (
          <h2>
            You are listening to {songName}, by {artist}
          </h2>
        ) : (
          <h2>{songMessage}</h2>
        )}

        <div className="lyricsContainer">
          {!lyricsFailed ? (
            <>
              {lyrics.map((phrase) => (
                <>
                  {phrase !== "" ? (
                    <p className="phrase">{phrase}</p>
                  ) : (
                    <>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                    </>
                  )}
                </>
              ))}
            </>
          ) : (
            <p className="phrase">{message}</p>
          )}
        </div>
        <p className="reference">Lyrics by </p>
        <a href="https://lyrics.ovh/">lyrics.ovh</a>
        <p className="alert">The player functions only work if you have a Spotify premium account</p>
      </div>
    </div>
  );
}