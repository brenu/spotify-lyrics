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

  useEffect(() => {
    let localLyrics =
      "Here's to the ones that we got\r\nCheers to the wish you were here, but you're not\r\n'Cause the drinks bring back all the memories\r\nOf everything we've been through\r\nToast to the ones here today\r\nToast to the ones that we lost on the way\n\n'Cause the drinks bring back all the memories\n\nAnd the memories bring back, memories bring back you\n\n\n\nThere's a time that I remember, when I did not know no pain\n\nWhen I believed in forever, and everything would stay the same\n\nNow my heart feel like December when somebody say your name\n\n'Cause I can't reach out to call you, but I know I will one day, yeah\n\n\n\nEverybody hurts sometimes\n\nEverybody hurts someday, ayy-ayy\n\nBut everything gon' be alright\n\nGo and raise a glass and say, ayy\n\n\n\nHere's to the ones that we got\n\nCheers to the wish you were here, but you're not\n\n'Cause the drinks bring back all the memories\n\nOf everything we've been through\n\nToast to the ones here today\n\nToast to the ones that we lost on the way\n\n'Cause the drinks bring back all the memories\n\nAnd the memories bring back, memories bring back you\n\n\n\nDoo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo\n\nMemories bring back, memories bring back you\n\n\n\nThere's a time that I remember when I never felt so lost\n\nWhen I felt all of the hatred was too powerful to stop (Ooh, yeah)\n\nNow my heart feel like an ember and it's lighting up the dark\n\nI'll carry these torches for ya that you know I'll never drop, yeah\n\n\n\nEverybody hurts sometimes\n\nEverybody hurts someday, ayy-ayy\n\nBut everything gon' be alright\n\nGo and raise a glass and say, ayy\n\n\n\nHere's to the ones that we got (Oh-oh)\n\nCheers to the wish you were here, but you're not\n\n'Cause the drinks bring back all the memories\n\nOf everything we've been through (No, no)\n\nToast to the ones here today (Ayy)\n\nToast to the ones that we lost on the way\n\n'Cause the drinks bring back all the memories (Ayy)\n\nAnd the memories bring back, memories bring back you\n\n\n\nDoo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo\n\nMemories bring back, memories bring back you\n\nDoo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo-doo\n\nDoo-doo-doo-doo, doo-doo-doo (Ooh, yeah)\n\nMemories bring back, memories bring back you\n\n\n\nYeah, yeah, yeah\n\nYeah, yeah, yeah, yeah, yeah, no, no\n\nMemories bring back, memories bring back you";

    localLyrics = localLyrics.split("\n\n").join("\n").split("\n");
    const lyricsArray = [];

    for (let phrase of localLyrics) {
      if (phrase === "") {
        lyricsArray.push("");
      } else {
        lyricsArray.push(phrase);
      }
    }

    setLyricsFailed(false);
    setSongFailed(false);
    setLyrics(lyricsArray);
  }, [lyrics]);

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
