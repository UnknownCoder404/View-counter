// Import the required modules
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const dotenv = require("dotenv");

// Load the environment variables from the .env file
dotenv.config();

// Create an express app
const app = express();

// Connect to MongoDB Atlas cloud database using the mongoURI from the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the viewCount document
const viewCountSchema = new mongoose.Schema({
  count: Number,
});

// Create a model for the viewCount collection
const ViewCount = mongoose.model("ViewCount", viewCountSchema);

// Create a middleware to parse JSON requests
app.use(express.json());

// Create a route handler for /add-view POST requests
app.post("/add-view", async (req, res) => {
  try {
    // Find the viewCount document in the database
    let viewCount = await ViewCount.findOne();

    // If it does not exist, create a new one with count 0
    if (!viewCount) {
      viewCount = new ViewCount({ count: 0 });
    }

    // Increment the count by 1
    viewCount.count++;

    // Save the updated document to the database
    await viewCount.save();
    console.log(`Added viewcount: ${viewCount.count}`);
    // Send a success response with the current count
    res
      .status(200)
      .json({ message: "View count updated", count: viewCount.count });
  } catch (error) {
    // If there is an error, send a failure response with the error message
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// Create a cron job that runs every hour and logs the viewCount to the console
cron.schedule("0 * * * *", async () => {
  try {
    // Find the viewCount document in the database
    let viewCount = await ViewCount.findOne();

    // If it exists, log the count to the console
    if (viewCount) {
      console.log(`The view count is ${viewCount.count}`);
    } else {
      // If it does not exist, log a message to the console
      console.log("The view count is not initialized");
    }
  } catch (error) {
    // If there is an error, log it to the console
    console.error(error);
  }
});

// Start the server on the port from the .env file
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
