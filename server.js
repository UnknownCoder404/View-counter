require("dotenv").config();
const express = require("express");
const http = require("http");

const intervalTime = 60 * 1000;
let viewCount = 0;
const app = express();
console.log(`Viewcount: ${viewCount}`);
app.post("/view", (req, res) => {
  viewCount += 1;
  console.log(`Viewcount: ${viewCount}`);
  res.json({
    message: "Thank you for visiting my site",
  });
});

setInterval(() => {
  console.log(`Viewcount: ${viewCount}`);
}, intervalTime);
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
