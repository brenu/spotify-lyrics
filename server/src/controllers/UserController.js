const api = require("axios");

module.exports = {
  async getUserInfo(req, res) {
    const access_token = res.locals.access_token;

    try {
      const connectionResponse = await api.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
      if (connectionResponse.status === 200) {
        return res.status(200).json(connectionResponse.data);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Não foi possível fazer a solicitação no momento." });
    }
  },
};
