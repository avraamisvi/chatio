var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  conversation: String,
  text: String,
  sender: String
});

mongoose.model('Message', MessageSchema);
