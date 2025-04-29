const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const cron = require('node-cron');

const authRouter = require("./controllers/auth");     
const prayersRouter = require("./controllers/prayers"); 
const Prayer = require('./models/prayer'); 


dotenv.config();

const app = express();


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(logger("dev"));


app.use("/auth", authRouter);            
app.use("/prayers", prayersRouter);   

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