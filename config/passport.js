const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// This just sets up the strategy. All DB work is done in auth.js
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      if (!email.endsWith('@acts2.network')) {
        return done(null, false, { message: 'Unauthorized domain' });
      }

      // Send only minimal profile info forward (DB logic happens in auth.js)
      return done(null, {
        id: profile.id,
        email,
        name: profile.displayName
      });

    } catch (err) {
      console.error("Passport Google Strategy Error:", err);
      return done(err, null);
    }
  }
));
