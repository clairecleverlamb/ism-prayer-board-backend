const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(null, false, { message: 'Email not found in profile' });
      }

      // TEMP: Allow all @gmail.com and @acts2.network emails
      if (
        !email.endsWith('@acts2.network') &&
        !email.endsWith('@gmail.com')
      ) {
        return done(null, false, { message: 'Unauthorized domain' });
      }

      // Successful login
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
