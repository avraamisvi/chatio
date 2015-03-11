var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.post('/list', function(req, res, next) {

  /*
    data = {
    conversations:
      [
        {
          id:1,
          targets:[{name:"abraao"}, {name:"fulano"}]
        },
        {
          id:2,
          targets:[{name:"sicrano"}, {name:"beltrano"}]
        }
      ]
    };*/

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

    //data = { conversations: )};

  //res.send(data);
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
