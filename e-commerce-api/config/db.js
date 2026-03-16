require('dotenv').config();
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));
