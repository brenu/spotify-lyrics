const Router = require("express");
const api = require("axios");
const btoa = require("btoa");
const { json } = require("express");

const routes = new Router();

routes.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

routes.get("/login-url", (req, res) => {
  return res.send(
    "https://accounts.spotify.com/authorize?client_id=e5e0a3b8cdd6434dadcd232b7e483fbe&response_type=code&redirect_uri=https://spotify-lyrics.netlify.app/&scope=user-read-private%20user-read-email&state=activity"
  );
});

routes.post("/get-info", async (req, res) => {
  const { code, state } = req.body;

  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("redirect_uri", "https://spotify-lyrics.netlify.app/");
  data.append("client_id", "e5e0a3b8cdd6434dadcd232b7e483fbe");
  data.append("client_secret", "61b16a1d82034ec6b14e45ddbd72a726");

  try {
    const response = await api.post(
      "https://accounts.spotify.com/api/token?grant_type=authorization_code",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: "Tudo certo aqui!" });
});

module.exports = routes;
