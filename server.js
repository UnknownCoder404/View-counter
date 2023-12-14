// Import modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://odvjetnik.josip.cicek.hr",
    "https://odvjetnik.josip.cicek.hr",
  ],
  methods: ["POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
cors(corsOptions);
// Connect to MongoDB database using mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((err) => console.error(err));

// Define a schema and a model for the log collection
const logSchema = new mongoose.Schema({
  item: String,
  count: Number,
});
const Log = mongoose.model("Log", logSchema);

// Create an express app and a router
const app = express();
const router = express.Router();

// Define an array of items
const items = [
  "helpful",
  "not-helpful",
  "google-maps",
  "telephone",
  "email",
  "view",
];

items.forEach(async (item) => {
  let tempLog = await Log.findOne({ item });
  if (!tempLog) {
    tempLog = new Log({ item, count: 0 });
  }
  console.log(`Current state of ${item}: ${tempLog.count}`);
});
// Create a dynamic route for each item
items.forEach((item) => {
  router.post(`/add-log/${item}`, async (req, res) => {
    // Find or create a log document for the item
    let log = await Log.findOne({ item });
    if (!log) {
      log = new Log({ item, count: 0 });
    }
    // Increment the count and save the log
    log.count++;
    await log.save();
    // Send a response
    console.log(`Added a log for ${item}. Count is now ${log.count}.`);
    res.send(`Added a log for ${item}. Count is now ${log.count}.`);
  });
});
app.post("/restart-server", (req, res) => {
  console.log("Server restarted.");
  res.status(200).json({ message: "Server restarted" });
});
const PORT = process.env.PORT || 3000;
app.use(router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
