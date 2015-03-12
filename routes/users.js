var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/list', function(req, res, next) {

  var userdb = mongoose.model("User");
  var data = {users:[]};

  userdb.find(function (err, result) {

    if (err) {
      console.error(err);
      return;
    }

    data.users = result;
    res.send(data);
  });

});

module.exports = router;
