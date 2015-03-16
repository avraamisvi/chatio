var mongoose = require('mongoose');

/*
  Users associated to a group.
*/
var GroupRequestSchema = new mongoose.Schema({
  username: String,
  targetgroup: String,
  targetuser: String
});

mongoose.model('GroupRequest', GroupRequestSchema);
