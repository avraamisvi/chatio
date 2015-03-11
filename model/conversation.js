var mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
  id:  Number,
  targets: [{
    name:String
  }]
});

mongoose.model('Conversation', ConversationSchema);
