var express = require('express');
var mongoose = require('mongoose');
require('date-utils');

var router = express.Router();

router.get('/list', function(req, res, next) {

  var Message  = mongoose.model("Message");
  var lastDay  = Date.now();
  var firstDay = Date.today();

  var lastDaynum = 0;
  var firstDaynum = 2;

  if(req.query.lastDay) {
    lastDaynum = req.query.lastDay;
  }

  if(req.query.firstDay) {
    firstDaynum = req.query.firstDay;
  }

  if(lastDaynum)
    lastDay.removeDays(lastDaynum);

  firstDay.removeDays(firstDaynum);

  Message.where('conversation').
  equals(req.query.id).
  where('created').
  gte(firstDay).
  lte(lastDay).
  exec(function (err, resl) {

    if (err) {
      console.error(err);
      return;
    }

    var data = {messages:[]};

    if(resl)
      data.messages = resl;

    res.send(data);
  });

});

router.get('/search', function(req, res, next) {

  var Message  = mongoose.model("Message");

  var qry = Message.find({$text:{$search:"sdsdsdsd"}});

  Message.where('conversation').
  equals(req.query.id).
  where('created').
  exec(function (err, resl) {

    if (err) {
      console.error(err);
      return;
    }

    var data = {messages:[]};

    if(resl)
      data.messages = resl;

    res.send(data);
  });

});

module.exports = router;
