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

/*function create(req, res, labelname, userstargets) {

  try {
    var Conversation = mongoose.model("Conversation");

    var uid = uuid.v1();

    var data = {
            label: labelname,
            id: uid+"",
            targets: userstargets
          };

    var convers = new Conversation(data);

    convers.save(function(err, result) {

      if (err) {
        console.error(err);
        res.send(err);
        return;
      }

      res.send(result);
    });

  } catch(ex) {
      console.error(ex);
  }
}

router.post('/create', function(req, res, next) {

    try {
      var Conversation = mongoose.model("Conversation");

      var labelname = "";
      var targs = req.body["targets[]"];
      var userstargets = [];

      if(req.body.labelname)
        labelname = req.body.labelname;

      for(var i = 0; i < targs.length; i++) {
        userstargets.push({name:targs[i]});
      }

      Conversation.where("targets").equals(targs).exec(function(err, result){

        if (err) {
          console.error(err);
        }

        if(!result || result.length <= 0) {
          create(req, res, labelname.trim(), userstargets);//if it not find, creates
        } else {
          res.send(result);
        }

      });
  } catch(ex) {
    console.log(ex);
  }

});*/

module.exports = router;
