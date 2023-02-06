var express = require("express");
var axios = require("axios");
var app = express();
var router = express.Router();
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var convert = require("xml-js");
var bodyParser = require("body-parser");
var rp = require("request-promise");
const ermct =
  "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire?serviceKey=CHuYeCfPC5tzm52m0mF0eiOdbnYIPjTlaYxVHNH6zMgO6i%2FBHMDtr8OEv4I%2BkA9mUGTckmwjCJnnc%2Fg15DRX%2BQ%3D%3D";
const ermct_rltm =
  "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=CHuYeCfPC5tzm52m0mF0eiOdbnYIPjTlaYxVHNH6zMgO6i%2FBHMDtr8OEv4I%2BkA9mUGTckmwjCJnnc%2Fg15DRX%2BQ%3D%3D";
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  var data = {};
  const option = {
    pageNo: 1,
    numOfRows: 1000,
  };

  await rp.get(
    {
      // 응급의료기관 데이터 받아오기
      uri: ermct,
      qs: option,
    },
    async function (err, res, body) {
      var result = body;
      var xjon = convert.xml2json(result, { compact: true, spaces: 4 });

      mediData = JSON.parse(xjon); //json으로 파싱
      let mediLogt = {};
      let mediLat = {};
      let mediName = {};
      let mediTel = {};
      let mediAddr = {};

      for (let i = 0; i < mediData.response.body.items.item.length; i++) {
        mediLogt[i] = mediData.response.body.items.item[i].wgs84Lon["_text"];
        mediLat[i] = mediData.response.body.items.item[i].wgs84Lat["_text"];
        mediName[i] = mediData.response.body.items.item[i].dutyName["_text"];
        mediTel[i] = mediData.response.body.items.item[i].dutyTel1["_text"];
        mediAddr[i] = mediData.response.body.items.item[i].dutyAddr["_text"];
      }
      return new Promise(function (resolve, reject) {
        resolve(
          (data.mediLogt = mediLogt),
          (data.mediLat = mediLat),
          (data.mediName = mediName),
          (data.mediTel = mediTel),
          (data.mediAddr = mediAddr)
        );
      });
    }
  );
  if (req.cookies.user) {
    data.cookie = req.cookies.user;
  } else {
    data.cookie = "false";
  }

  await rp.get(
    {
      // 응급의료기관 데이터 받아오기
      uri: ermct_rltm,
      qs: option,
    },
    async function (err, res, body) {
      var result = body;
      var xjon = convert.xml2json(result, { compact: true, spaces: 4 });

      rltmData = JSON.parse(xjon); //json으로 파싱
      let mediHvec = {};
      let mediHvoc = {};
      let mediHvamyn = {};
      let mediHvventiayn = {};

      for (let i = 0; i < rltmData.response.body.items.item.length; i++) {
        mediHvec[i] = rltmData.response.body.items.item[i].hvec["_text"];
        mediHvoc[i] = rltmData.response.body.items.item[i].hvoc["_text"];
        mediHvamyn[i] = rltmData.response.body.items.item[i].hvamyn["_text"];
        mediHvventiayn[i] =
          rltmData.response.body.items.item[i].hvventiayn["_text"];
      }

      return new Promise(function (resolve, reject) {
        resolve(
          (data.mediHvec = mediHvec),
          (data.mediHvoc = mediHvoc),
          (data.mediHvamyn = mediHvamyn),
          (data.mediHvventiayn = mediHvventiayn)
        );
      });
    }
  );
  if (req.cookies.user) {
    data.cookie = req.cookies.user;
  } else {
    data.cookie = "false";
  }
  res.render("findmap.ejs", data);
});

router.post("/", async (req, res) => {});

module.exports = router;
