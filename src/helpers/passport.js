const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.checkPassword(password)) {
        console.log("Username and password doesn't match");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log(userId);
  User.findById(userId).then((user) => {
    if (user) {
      done(null, user);
    }
    done(null, false);
  });
});
