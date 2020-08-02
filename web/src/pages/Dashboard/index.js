import React from "react";
import { useEffect } from "react";

import api from "../../services/api";

export default function Dashboard() {
  useEffect(() => {
    async function handleInit() {
      const code = localStorage.getItem("code");
      const state = localStorage.getItem("state");

      try {
        const response = await api.post("/get-info", { code, state });

        if (response.status === 200) {
          console.log(response.data);
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
      </div>
    </div>
  );
}
