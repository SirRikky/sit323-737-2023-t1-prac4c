const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const userService = require('./user-service');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
};

// Authenticates user
passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  const user = userService.findUserByUsername(jwt_payload.username);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'User not found' });
  }
}));

module.exports = passport;