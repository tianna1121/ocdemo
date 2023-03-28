const express = require("express");
const http = require("http");
const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
mongoose.connect("mongodb://mongodb:mongodb@mongodb:27017/test", {
  useNewUrlParser: true,
});

conn.on("connected", function () {
  console.log("database is connected successfully");
});

conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
});

conn.on("error", console.error.bind(console, "connection error:"));

const app = express();
app.use(express.json());

const mysqlx = mysql.createPool({
  host: "mysql8",
  user: "root",
  password: "6zbMNFmCSl7b/UKfB42N4A",
  database: "mysql",
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.status(200).json({
    code: 0,
    msg: "Welcome to OpenShift Demo",
  });
});

app.get("/mysql", async function (req, res) {
  let retObj = await mysqlx.query("SELECT * From user;");
  res.status(200).json(retObj);
});

app.get("/mongodb", async function (req, res) {
  res.status(200).json({
    code: 0,
    msg: "已连接到mongodb",
  });
});

const httpServer = http.createServer(app);
httpServer.listen(8080);
