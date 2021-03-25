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

  async getPlayingSong(req, res) {
    const { access_token, refresh_token } = res.locals;

    try {
      let response = await api.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );

      if (response.status === 204) {
        return res.status(206).json({ refresh_token });
      }

      if (response.status === 200) {
        response.data.refresh_token = refresh_token;
        return res.json(response.data);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Não foi possível fazer a requisição no momento" });
    }
  },

  async playSong(req, res) {
    const { access_token, refresh_token } = res.locals;

    try {
      const response = await api.put("https://api.spotify.com/v1/me/player/play",{}, {headers: {"Authorization": `Bearer ${access_token}`}});

      if(response.status === 204){
        return res.status(206).json({refresh_token});
      }
    } catch (error) {
      return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
    }
    
    return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
  },

  async pauseSong(req, res) {
    const { access_token, refresh_token } = res.locals;

    try {
      const response = await api.put("https://api.spotify.com/v1/me/player/pause",{}, {headers: {"Authorization": `Bearer ${access_token}`}});

      if(response.status === 204){
        return res.status(206).json({refresh_token});
      }
    } catch (error) {
      return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
    }
    
    return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
  },

  async previousSong(req, res){
    const { access_token, refresh_token } = res.locals;

    try {
      const response = await api.put("https://api.spotify.com/v1/me/player/previous",{}, {headers: {"Authorization": `Bearer ${access_token}`}});

      if(response.status === 204){
        return res.status(206).json({refresh_token});
      }
    } catch (error) {
      return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
    }
    
    return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
  },

  async nextSong(req, res){
    const { access_token, refresh_token } = res.locals;

    try {
      const response = await api.post("https://api.spotify.com/v1/me/player/next",{}, {headers: {"Authorization": `Bearer ${access_token}`}});

      if(response.status === 204){
        return res.status(206).json({refresh_token});
      }
    } catch (error) {
      return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
    }
    
    return res.status(400).json({message: "Não foi possível fazer a requisição no momento"});
  }
};
