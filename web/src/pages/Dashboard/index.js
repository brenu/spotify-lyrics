import React, { useState } from "react";
import { useEffect } from "react";

import api from "../../services/api";

import "./styles.css";

export default function Dashboard() {
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    async function handleInit() {
      const code = localStorage.getItem("code");
      const state = localStorage.getItem("state");

      try {
        const response = await api.post("/get-song", { code, state });

        if (response.status === 200) {
          console.log(response.data);
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
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    handleInit();
  }, []);

  return (
    <div className="container" id="dashboard-container">
      <div className="content" id="dashboard-content">
        <h1>Dashboard</h1>
        <h2>
          Você está ouvindo {songName}, por {artist}
        </h2>
        <div className="lyricsContainer">
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
        </div>
        <p className="reference">Lyrics by </p>
        <a href="https://lyrics.ovh/">lyrics.ovh</a>
      </div>
    </div>
  );
}
