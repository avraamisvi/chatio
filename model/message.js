var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  conversation:  Number,
  text: String,
  sender: String
});

mongoose.model('Message', MessageSchema);
