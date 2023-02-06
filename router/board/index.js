var express = require("express");
var app = express();
var router = express.Router();
var path = require("path");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  port: "3306",
  database: "user",
});
connection.connect();

router.get("/list", function (req, res, next) {
  res.redirect("/board/1"); // /board로 접속요청이 들어왔을 때 1페이지로 자동으로 이동하도록 리다이렉트 해줍니다.
});
router.get("/list/:page", function (req, res, next) {
  var query = connection.query(
    'select idx,title,writer,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T") as moddate from board',
    function (err, rows) {
      if (err) console.log(err); // 만약 에러값이 존재한다면 로그에 표시합니다.
      console.log("rows :" + rows);
      res.render("list", { title: "Board List", rows: rows }); // view 디렉토리에 있는 list 파일로 이동합니다.
    }
  );
});

router.get("/", function (req, res) {
  if (req.cookies.user) {
    res.render("board.ejs", { cookie: req.cookies.user });
  } else {
    res.render("board.ejs", { cookie: "false" });
  }
});

module.exports = router;
