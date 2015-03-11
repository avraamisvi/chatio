var mongoose = require('mongoose');

module.exports = {

  users: {},

  init: function(){//temp
    var Conversation = mongoose.model("Conversation");

    var convers = new Conversation(
      {
        id:1,
        targets:[{name:"abraao"}, {name:"fulano"}]
      }
    );

    convers.save(function (err, fluffy) {
      if (err) return console.error(err);
    });

    //-------------------------------------------------
    
    convers = new Conversation(
      {
        id:2,
        targets:[{name:"sicrano"}, {name:"beltrano"}]
      }
    );

    convers.save(function (err, fluffy) {
      if (err) return console.error(err);
    });

  },

  register: function (socket, data) {

    this.users[data.username] = socket;
    socket.emit('registered', {status: "ok"});

  },

  receive: function(data) {
    //save in mongo

    this.save(data);

    for(var i = 0; i < data.targets.length; i++) {
      if(this.users[data.targets[i].name]) {
        this.publish(this.users[data.targets[i].name], data);
      }
    }
  },

  publish: function(socket, data){

      socket.emit('publish',
      {
        message: data.message,
        conversation:  data.conversation,
        sender: data.sender
      });
  },

  save: function(data) {//will save async in mongodb

  }

}
