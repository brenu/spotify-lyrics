import React, { useState } from "react";

import api from "../../services/api";

import "./styles.css";

export default function Home({ history }) {
  const [isSubmitFailed, setIsSubmitFailed] = useState(false);
  const [message, setMessage] = useState("");

  async function handleNavigation() {
    try {
      const response = await api.get("/login-url");

      if (response.status === 200) {
        window.location.replace(response.data);
      }
    } catch (error) {
      setIsSubmitFailed(true);
      setMessage(
        "Não foi possível realizar esta operação no momento, tente novamente mais tarde :("
      );
    }
  }

  return (
    <div className="container" id="home-container">
      <div className="background-filter">
        <div className="content">
          <h1 className="home-title">Spotify-Lyrics</h1>
          <p className="calling">
            See the lyrics of your favorite songs as you are listening to them.
          </p>
          <button onClick={handleNavigation} className="btn">
            Give it a try
          </button>
          {isSubmitFailed && <p className="error">{message}</p>}
        </div>
      </div>
    </div>
  );
}
