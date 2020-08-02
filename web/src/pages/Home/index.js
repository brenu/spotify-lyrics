import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import api from "../../services/api";

import "./styles.css";

import useQuery from "../../components/query";

export default function Home({ history }) {
  const [isSubmitFailed, setIsSubmitFailed] = useState(false);
  const [message, setMessage] = useState("");
  const query = useQuery();

  useEffect(() => {
    async function handleInit() {
      const code = query.get("code");
      const state = query.get("state");

      if (code && state) {
        localStorage.setItem("code", code);
        localStorage.setItem("state", state);
        history.push("/dashboard");
      }
    }

    handleInit();
  }, []);

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
