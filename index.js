const express = require("express");
const http = require("http");
const mysql = require("mysql2/promise");
const MongoClient = require("mongodb").MongoClient;

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
  MongoClient.connect(
    "mongodb://mongodb:mongodb@mongodb:27017/test?authMechanism=MONGODB-CR",
    { useUnifiedTopology: true },
    function (err, client) {
      const db = client.db("test");
      console.log("已连接到mongodb的test数据库");
      res.status(200).json({
        code: 0,
        msg: "已连接到mongodb",
      });
    }
  );
});

const httpServer = http.createServer(app);
httpServer.listen(8080);
