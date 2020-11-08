const https = require("https");
var CryptoJS = require("crypto-js");

var pubkey = process.env.PUBKEY;
var pvtkey = process.env.PRIVKEY;
var ts = new Date().getTime();

var hash = ts + pvtkey + pubkey;
var a = CryptoJS.MD5(hash).toString();

const superherosController = {
  getHeros: (req, res) => {
    const page = req.params.page ? parseInt(req.params.page) : 0;
    var offset = page === 0 ? 0 : page === 1 ? 0 : page === 2 && 10;
    var limit = page === 0 ? 20 : (page === 1 || page === 2) && 10;
    console.log(offset, limit);
    https.get(
      `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}&offset=${offset}&series=24229&ts=${ts}&apikey=${pubkey}&hash=${a}`,
      (resp) => {
        let response = "";

        resp.on("data", (chunk) => {
          response += chunk;
        });

        resp.on("end", () => {
          var newData = JSON.parse(response);

          let heros = [];
          let generalInfo = {};
          newData.data.results.map((hero) => {
            if (hero.name !== "Avengers") {
              var description =
                hero.description === ""
                  ? "This hero is reserved, so we don´t have this information"
                  : hero.description;
              heros.push({
                name: hero.name,
                description,
                photo: hero.thumbnail.path + "." + hero.thumbnail.extension,
              });
            } else {
              generalInfo = {
                name: hero.name,
                description: hero.description,
                photo: hero.thumbnail.path + "." + hero.thumbnail.extension,
              };
            }
          });
          res.status(200).json({
            success: true,
            generalInfo,
            heros,
          });
        });

        resp.on("error", (err) => {
          console.log("Error: " + err.message);
          res.status(404).json({
            success: false,
            error: err.message,
          });
        });
      }
    );
  },
  getHero: (req, res) => {
    var name = req.params.nombre;
    var nameToSearch = name.replace("_", "%20");

    https.get(
      `https://gateway.marvel.com:443/v1/public/series/24229/characters?nameStartsWith=${nameToSearch}&ts=${ts}&apikey=${pubkey}&hash=${a}`,
      (resp) => {
        let response = "";

        resp.on("data", (chunk) => {
          response += chunk;
        });

        resp.on("end", () => {
          var newData = JSON.parse(response);

          let heros = [];

          newData.data.results.map((hero) => {
            var description =
              hero.description === ""
                ? "This hero is reserved, so we don´t have this information"
                : hero.description;
            heros.push({
              name: hero.name,
              description,
              photo: hero.thumbnail.path + "." + hero.thumbnail.extension,
            });
          });
          if (heros.length !== 0) {
            res.status(200).json({
              success: true,
              heros,
            });
          } else {
            res.status(404).json({
              success: false,
              error: "Hero not found",
            });
          }
        });

        resp.on("error", (err) => {
          res.status(404).json({
            success: false,
            error: "Hero not found",
          });
        });
      }
    );
  },
};

module.exports = superherosController;
