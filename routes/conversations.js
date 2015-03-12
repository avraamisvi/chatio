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

router.post('/create', function(req, res, next) {

    var Conversation = mongoose.model("Conversation");

    var uid;

    try {
      uid = uuid.v1();
    } catch(e) {
      console.log(e);
      return;
    }

    var targs = req.body["targets[]"];
    var userstargets = [];

    var labelname = "";

    for(var i = 0; i < targs.length; i++) {
      userstargets.push({name:targs[i]});

      labelname += targs[i] + " ";
    }

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

      console.log("===salvo===");
      console.log(result);
      res.send(result);
    });

});

router.post('/history', function(req, res, next) {

  //load from mongodb

  data = {
    messages:
      [
        {
          sender:"abraao",
          targets:["abraao", "fulano"],
          message:"baksdjsalkdj #adsad #asdsad asdjsadj #asdsads asdksadkaslçdk"
        },
        {
          sender:"fulano",
          targets:["abraao", "fulano"],
          message:"#baksdjsalkdj #dddd #asdsad asdjsadj #asdsads asdksadkaslçdk"
        }
      ]
    };

  res.send(data);
});

module.exports = router;
