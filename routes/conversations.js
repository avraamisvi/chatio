var express = require('express');
var mongoose = require('mongoose');
var uuid = require('uuid');

var router = express.Router();

router.post('/list', function(req, res, next) {//transformar em get

    var conversationDB = mongoose.model("Conversation");
    var data = {conversations:[]};

    conversationDB.find(function (err, resl) {

      if (err) {
        console.error(err);
        return;
      }

      data.conversations = resl;
      res.send(data);
    });

});

function create(req, res, Conversation) {

  var uid = uuid.v1();
  var targs = req.body["targets[]"];
  var userstargets = [];

  var data = {
          label: labelname.trim(),
          id: uid+"",
          targets: userstargets
        };

  var convers = new Conversation(data);

  convers.save(function(err, result) {

    if (err) {
      console.error(err);
      return;
    }

    res.send(result);
  });
}

router.post('/create', function(req, res, next) {

    var Conversation = mongoose.model("Conversation");

    var labelname = "";

    for(var i = 0; i < targs.length; i++) {
      userstargets.push({name:targs[i]});

      labelname += targs[i] + " ";
    }

    Conversation.where("label").equals("livia abraao").exec(function(err, result){

      if (err) {
        console.error(err);
      }

      if(!result) {
        create(req, res, Conversation);//if it not find, creates
      } else {
        res.send(result);
      }

    })

});

module.exports = router;
