require("dotenv").config();
const express = require("express");
const http = require("http");
let { LocalStorage } = require("node-localstorage");
localStorage = new LocalStorage("./localstorage");
let viewCount = Number(localStorage.getItem("viewCount")) || 0;
saveToLocal();
const intervalTime = 3600 * 1000; // 3600 seconds
const app = express();
console.log(`Viewcount: ${viewCount}`);
app.post("/add-view", (req, res) => {
  viewCount += 1;
  console.log(`Viewcount: ${viewCount}`);
  saveToLocal();
  res.json({
    message: "Thank you for visiting my site",
  });
});

setInterval(() => {
  loadToLocal();
  console.log(`Viewcount: ${viewCount}`);
}, intervalTime);
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

function saveToLocal() {
  localStorage.setItem("viewCount", viewCount);
}
function loadToLocal() {
  localStorage = Number(localStorage.getItem("viewCount"));
}
