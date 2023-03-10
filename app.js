var express = require("express");
var app = express();
var port = 5000;
var cors = require("cors");
var bodyParser = require("body-parser");
var router = require("./router/index");
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(router);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
