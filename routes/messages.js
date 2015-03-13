var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/list', function(req, res, next) {

  var Message = mongoose.model("Message");

  Message.where('conversation').equals(req.query.id).exec(function (err, resl) {

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
