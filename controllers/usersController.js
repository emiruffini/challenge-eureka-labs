const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const usersController = {
  //Controlador para crear una cuenta
  newUser: async (req, res) => {
    //Obtengo los datos del usuario
    const { username, password, mail } = req.body;
    const usernameExist = await User.findOne({ username });
    const mailExist = await User.findOne({ mail });
    if (usernameExist || mailExist) {
      res.status(404).json({
        success: false,
        message:
          usernameExist && mailExist
            ? "El nombre de usuario y el email ya han sido utilizados"
            : usernameExist
            ? "El nombre de usuario ya ha sido utilizado"
            : mailExist && "El email ya ha sido utilizado",
      });
    } else {
      let error = false;
      //Hasheo la contraseña
      const passwordHash = bcryptjs.hashSync(password.trim(), 10);
      //Creo el nuevo usuario
      const newUser = new User({
        mail: mail.trim(),
        username: username.trim(),
        password: passwordHash,
      });

      try {
        //Lo guardo en la BD
        const res = await newUser.save();
      } catch (err) {
        error = err;
      } finally {
        if (error) {
          res.json({
            success: false,
            response: error,
          });
        } else {
          //Genero el token
          jwt.sign(
            { ...newUser },
            process.env.SECRETORKEY,
            {},
            (error, token) => {
              if (error) {
                res.status(404).json({ success: false, error });
              } else {
                res.status(200).json({
                  success: true,
                  response: {
                    token,
                    username: newUser.username,
                  },
                });
              }
            }
          );
        }
      }
    }
  },
  validateUser: (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(2).max(40).trim().required(),
      password: Joi.string()
        .required()
        .pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,60}/, "password")
        .trim(),
      mail: Joi.string().email().required().trim(),
    });
    const validation = schema.validate(req.body);
    if (validation.error !== undefined) {
      res.status(404).json({
        success: false,
        error: "Algunos campos son invalidos",
        message: validation.error,
      });
    } else {
      next();
    }
  },
  logUser: async (req, res) => {
    var { username, password } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      res.status(404).json({
        success: false,
        response: "El usuario y/o contraseña son incorrectos",
      });
    } else {
      const passwordMatches = bcryptjs.compareSync(
        password,
        userExist.password
      );
      if (!passwordMatches) {
        res.status(404).json({
          success: false,
          response: "El usuario y/o contraseña son incorrectos",
        });
      } else {
        jwt.sign(
          { ...userExist },
          process.env.SECRETORKEY,
          {},
          (error, token) => {
            if (error) {
              res.json({ success: false, response: "Algo salió mal" });
            } else {
              res.status(200).json({
                success: true,
                response: {
                  token,
                  username: userExist.name,
                },
              });
            }
          }
        );
      }
    }
  },
  async likeAvenger(req, res) {
    const username = req.user.username;

    const user = await User.findOne({ username });

    const avenger = req.body.avenger.toLowerCase();

    if (user) {
      if (user.likes.find((like) => like.avenger.toLowerCase() === avenger)) {
        //Si ya esta likeado lo elimino del array
        user.likes = user.likes.filter(
          (like) => like.avenger.toLowerCase() !== avenger
        );
      } else {
        //Si no lo está lo agrego
        user.likes.push({
          avenger,
          createdAt: new Date().toISOString(),
        });
      }

      await user.save();
      res.status(200).json({
        success: true,
        likes: user.likes,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
  },
};

module.exports = usersController;
