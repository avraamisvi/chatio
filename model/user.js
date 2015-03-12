var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  name: String,
  completename: String
});

mongoose.model('User', UsersSchema);
