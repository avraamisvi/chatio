var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  conversation: String,
  text: String,
  sender: String,
  created: { type: Date, default: Date.now }
});

mongoose.model('Message', MessageSchema);
