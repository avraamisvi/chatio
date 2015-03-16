var mongoose = require('mongoose');

/*
  Users associated to a group.
*/
var UserGroupSchema = new mongoose.Schema({
  username: String,
  groupname: String
});

mongoose.model('UserGroup', UserGroupSchema);
