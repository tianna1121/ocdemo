const express = require("express");
const http = require("http");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const mysqlx = mysql.createPool({
  user: "root",
  password: "Imtianna1121",
  database: "myssql",
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

const httpServer = http.createServer(app);
httpServer.listen(8080);
