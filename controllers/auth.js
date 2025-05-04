const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const ADMIN_EMAILS = [
  "shufei.lei@acts2.network",
  "karen.lei@acts2.network",
  "claire.chen@acts2.network",
];

// Middleware to ensure cookie-parser is available
const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    try {
      const profile = req.user;

      if (!profile || !profile.email) {
        return res.status(400).json({ error: "Invalid Google profile data" });
      }

      const email = profile.email;

      // Only allow Acts2 emails
      if (!email.endsWith("@acts2.network")) {
        return res.status(403).json({ error: "Only Acts2 emails allowed." });
      }

      // Find or create user
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.name,
          isAdmin: ADMIN_EMAILS.includes(email),
        });
      } else if (user.isAdmin !== ADMIN_EMAILS.includes(email)) {
        user.isAdmin = ADMIN_EMAILS.includes(email);
        await user.save();
      }

      // Sign JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set cookie (critical settings for cross-origin)
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // secure: true only on HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 3600000,
      });

      console.log("Token cookie set. Redirecting to frontend.");

      // Redirect to frontend
      res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
    } catch (err) {
      console.error("OAuth Callback Error:", err);
      res.status(500).json({ error: "OAuth login failed" });
    }
  }
);

// Authenticated user check
router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    console.warn("⚠️ No token found in cookies");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-__v");
    res.json(user);
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  console.log("Cleared token cookie, logged out.");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
