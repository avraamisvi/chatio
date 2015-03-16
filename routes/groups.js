var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/users', function(req, res, next) {

  var modl = mongoose.model("UserGroup");
  var data = {users:[]};

  modl.find({owner:req.query.owner},function (err, result) {

    if (err) {
      console.error(err);
      return;
    }

    data.users = result;
    res.send(data);
  });

});

router.get('/requests', function(req, res, next) {

  var modl = mongoose.model("GroupRequest");
  var data = {requests:[]};

  modl.find({targetuser:req.query.username},function (err, result) {

    if (err) {
      console.error(err);
      return;
    }

    data.requests = result;
    res.send(data);
  });

});

module.exports = router;
