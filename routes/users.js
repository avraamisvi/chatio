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

function getMyUsers(req, res) {
  var modl = mongoose.model("UserGroup");

  modl.find({owner:req.query.username},function (err, result) {

    if (err) {
      console.error(err);
      return;
    }

    if(result && result.length > 0) {
      getUserIn(res, result);
    }

  });
}

function getUserIn(res, list) {
  var User = mongoose.model("User");
  var data = {users:[]};

  var names = [];

  for(var ix = 0; ix < list.length; ix++) {
    names.push(list[ix].username)
  }

  User.where("name").in(names).exec(function (err, result) {

    if (err) {
      console.error(err);
      return;
    }

    data.users = result;
    res.send(data);
  });
}

router.get('/myusers', function(req, res, next) {
  getMyUsers(req, res);
});

module.exports = router;
