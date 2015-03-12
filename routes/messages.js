var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/list', function(req, res, next) {

  var Message = mongoose.model("Message");

  Message.where('conversation').equals('879f72f0-c8e4-11e4-b910-0d0e7c1a12bf').exec(function (err, resl) {

    if (err) {
      console.error(err);
      return;
    }

  //  console.log("consultado");
  //  console.log(resl);

    var data = {messages:[]};

    if(resl)
      data.messages = resl;

    res.send(data);
  });

});

module.exports = router;
