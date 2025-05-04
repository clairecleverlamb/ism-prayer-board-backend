const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const cron = require('node-cron');

const authRouter = require("./controllers/auth");     
const prayersRouter = require("./controllers/prayers"); 
const Prayer = require('./models/prayer'); 
const passport = require("passport");
const cookieParser = require("cookie-parser");


dotenv.config();
require('./config/passport');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});


app.use(cookieParser());
app.use(passport.initialize());

const allowedOrigins = [
  "https://ism-prayer-board-frontend.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(logger("dev"));


app.use("/auth", authRouter);            
app.use("/prayers", prayersRouter);   


app.get("/", (req, res) => {
  res.send("ISM Prayer Board backend is running");
});


cron.schedule('0 0 * * *', async () => {
  console.log('Running daily reset of prayer counts...');

  try {
    await Prayer.updateMany({}, { $set: { prayedBy: [] } }); 
    console.log('Prayer counts have been reset!');
  } catch (error) {
    console.error('Error resetting prayer counts:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PrayerBoard server ready on port ${PORT}! `);
});