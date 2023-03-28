const express = require("express");
const http = require("http");
const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
const { InfluxDB } = require("@influxdata/influxdb-client");
const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "redis",
    port: "6379",
  },
});
redisClient.on("connect", function () {
  console.log("Redis connected!");
});
redisClient.on("error", (err) => console.log("Redis Client Error: ", err));

mongoose.connect("mongodb://mongodb:mongodb@mongodb:27017/test", {
  useNewUrlParser: true,
});
var conn = mongoose.connection;
conn.on("connected", function () {
  console.log(" mongodb database is connected successfully");
});

conn.on("disconnected", function () {
  console.log("mongodb database is disconnected successfully");
});

conn.on("error", console.error.bind(console, "mongodb connection error:"));

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
    msg: "connected to mongodb database",
  });
});

app.get("/influxdb", async function (req, res) {
  var outJson = [];

  const queryApi = new InfluxDB({
    url: "http://influxdb:8086",
    token:
      "ur6ugfV9HarVQFpNwth5lNu8DbZuUcTZP7NG3yulNXdqbUCYcFq9Id2Iz3TfXulWI_1bc7btAHVrLHzE8-TdjA==",
  }).getQueryApi("pxaiot");

  queryApi.queryRows(
    'from(bucket: "test")|> range(start: -1d)|> filter(fn: (r) => r["_measurement"] == "boltdb_reads_total")|> filter(fn: (r) => r["_field"] == "counter")',
    {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        console.log(o);
        outJson.push({
          time: o._time,
          value: o._value,
        });
      },
      error(error) {
        console.log("QUERY FAILED", error);
      },
      complete() {
        console.log(outJson);
        res.status(200).json({
          code: 0,
          data: outJson,
          msg: "connected to influxdb database",
        });
      },
    }
  );
});

const httpServer = http.createServer(app);
httpServer.listen(8080);
