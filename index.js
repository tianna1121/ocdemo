const express = require("express");
const http = require("http");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    code: 0,
    msg: "Welcome to OpenShift Demo",
  });
});

const httpServer = http.createServer(app);
httpServer.listen(8080);
