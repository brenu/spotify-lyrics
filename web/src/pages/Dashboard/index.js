import React, { useState } from "react";
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
          }
        } else {
          var response = await api.put("/get-song-refreshed", {
            refresh_token,
          });
          localStorage.setItem("refresh_token", response.data.refresh_token);
          if(response.data.is_playing != undefined){
            setIsPaused(isPaused => !response.data.is_playing);
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
    setTimeout(() => setCounter((counter) => counter + 1), [5000]);
  }, [counter]);

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
      
      if(isPaused){
        response = await api.put("/previous",{refresh_token});
      }else{
        response = await api.put("/pause",{refresh_token});
      }

      if(response.status === 204){
        setIsPaused(isPaused => !isPaused);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  async function handleNext() {
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      let response;
      
      if(isPaused){
        response = await api.put("/next",{refresh_token});
      }else{
        response = await api.put("/pause",{refresh_token});
      }

      if(response.status === 204){
        setIsPaused(isPaused => !isPaused);
      }
    } catch (error) {
      console.log("Unable to make request");
    }
  }

  return (
    <div className="container" id="dashboard-container">
      <div className="buttons-container">
        <button className="previous-btn" onClick={handlePrevious}>Previous</button>
        <button className="play-btn" onClick={handlePlay}>{isPaused ? 'Play' : 'Pause'}</button>
        <button className="next-btn" onClick={handleNext}>Next</button>
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
      </div>
    </div>
  );
}