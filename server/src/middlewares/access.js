const api = require("axios");

module.exports = {
  async getAccessToken(req, res, next) {
    const { code, state } = req.body;

    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", "https://spotify-lyrics.netlify.app/");
    data.append("client_id", process.env.CLIENT_ID);
    data.append("client_secret", process.env.SECRET_ID);

    try {
      const response = await api.post(
        "https://accounts.spotify.com/api/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        res.locals.access_token = response.data.access_token;
        next();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
