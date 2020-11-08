const passport = require("passport");
const ExtraJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/user");
//Estrategia de passport
module.exports = passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtraJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRETORKEY,
    },
    (payload, done) => {
      User.findById(payload._doc._id)
        .then((user) => {
          if (!user) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        })
        .catch((error) => {
          return done(error, false);
        });
    }
  )
);
