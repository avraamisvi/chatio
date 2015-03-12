var mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
  label: String,
  id:  String,
  targets: [{
    name:String
  }]
});

mongoose.model('Conversation', ConversationSchema);
