var mongoose = require('mongoose');

module.exports = {

  users: {},

  init: function(){//temp
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
    var Message = mongoose.model("Message");

    var msg = new Message({
      text: data.message,
      conversation:  data.conversation,
      sender: data.sender
    });

    msg.save(function(err, result){
      if(err) console.error(err);
    });

  }

}
