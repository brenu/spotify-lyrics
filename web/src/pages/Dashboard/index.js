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

  useEffect(() => {
    async function handleInit() {
      const code = localStorage.getItem("code");
      const state = localStorage.getItem("state");

      try {
        const response = await api.post("/get-song", { code, state });

        if (response.status === 200) {
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

            setLyrics(lyricsArray);
          } else {
            setLyricsFailed(true);
            setMessage("We couldn't find the lyrics for this song :(");
          }
        } else if (response.status === 204) {
          setSongFailed(true);
          setSongMessage("You are not listening to anything yet!");
        }
      } catch (error) {
        setLyricsFailed(true);
        setMessage("We couldn't find the lyrics for this song :(");
      }
    }

    handleInit();
  }, []);

  return (
    <div className="container" id="dashboard-container">
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
