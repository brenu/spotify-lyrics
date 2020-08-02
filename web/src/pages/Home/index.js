import React from "react";

import "./styles.css";

export default function Home({ history }) {
  function handleNavigation() {
    history.push("Dashboard");
  }

  return (
    <div className="container" id="home-container">
      <div className="background-filter">
        <div className="content">
          <h1 className="home-title">Spotify-Lyrics</h1>
          <p className="calling">
            See the lyrics of your favorite songs as you are listening to them.
          </p>
          <div style={{ alignSelf: "center" }}>
            <button onClick={handleNavigation} className="btn">
              Give it a try
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
