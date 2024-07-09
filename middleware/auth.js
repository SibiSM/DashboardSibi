var User = require("../models/user");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var config = require("../config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
  var strategy = new Strategy(params, async function(payload, done) {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(new Error("UserNotFound"), null);
      } else if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      } else {
        return done(null, user);
      }
    } catch (error) {
      console.error("Error:", error);
      return done(error, null);
    }
  });

  passport.use(strategy);

  return { initialize: function() { return passport.initialize() }};
};