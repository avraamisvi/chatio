var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  name: String,
  owner: String,
  created: { type: Date, default: Date.now }
});

mongoose.model('Group', GroupSchema);
