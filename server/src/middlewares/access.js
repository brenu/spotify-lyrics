const api = require("axios");

module.exports = {
  async getAccessToken(req, res, next) {
    const { code, state } = req.body;

    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", process.env.REDIRECT_URI);
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
        res.locals.refresh_token = response.data.refresh_token;
        next();
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Não foi possível realizar a operação" });
    }
  },
  async getRefreshedToken(req, res, next) {
    const { refresh_token } = req.body;

    const data = new URLSearchParams();
    data.append("grant_type", "refresh_token");
    data.append("refresh_token", refresh_token);
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
        res.locals.refresh_token = refresh_token;
        next();
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "Não foi possível realizar a operação" });
    }
  },
};
