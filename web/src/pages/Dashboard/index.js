import React, { useState } from "react";
import { useEffect } from "react";

import api from "../../services/api";

export default function Dashboard() {
  const [songName, setSongName] = useState("");

  useEffect(() => {
    async function handleInit() {
      const code = localStorage.getItem("code");
      const state = localStorage.getItem("state");

      try {
        const response = await api.post("/get-song", { code, state });

        if (response.status === 200) {
          console.log(response.data);
          setSongName(response.data.item.name);
        }
      } catch (error) {
        console.log(error);
      }
    }

    handleInit();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1>Dashboard</h1>
        <h2>Você está ouvindo {songName}</h2>
      </div>
    </div>
  );
}
