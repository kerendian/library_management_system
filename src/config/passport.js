import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import logger from '../utils/logger.js';

passport.use(new BasicStrategy(
  function(username, password, done) {
    try {
      // Simulate database lookup
      const user = { name: "admin" };
      if (username.trim().toLowerCase() === "admin" && password.trim().toLowerCase() === "password") {
        return done(null, user);
      } else {
        throw new Error('Incorrect username or password');
      }
    } catch (error) {
      logger.error(`${error.message} - Authentication failed.`);
      return done(null, false, { message: error.message });
    }
  }
));

export default passport;
