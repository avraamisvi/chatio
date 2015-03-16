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

  requestAddUser: function(data) {

      var GroupRequest = mongoose.model("GroupRequest");
      var targSocket = this.users[data.targetuser];

      var grpr = new GroupRequest({
        username: data.username,
        targetgroup: "_Default",
        targetuser: data.targetuser
      });

      GroupRequest.find({username:data.username, targetuser: data.targetuser},function (err, result) {

        if (err) {
          console.error(err);
          return;
        }

        if(!result || result.length <= 0) {

            grpr.save(function(err, reslt) {//save request
              if(err) console.error(err);

              if(targSocket) { //send event to target
                  targSocket.emit('requestAddUser',
                  {
                    username: data.username
                  });
              }//end if

            });//end save

        }//end if result

      });//end find

  },

  acceptRequest: function(data) {
    var UserGroup = mongoose.model("UserGroup");
    var GroupRequest = mongoose.model("GroupRequest");

    var groupname = '_Default';

    var sourceSocket = this.users[data.username];
    var targSocket = this.users[data.owner];

    var usergrp = new GroupRequest({
      username: data.username,
      groupname: groupname,
      owner: data.owner
    });

    UserGroup.find({username:data.username, owner: data.owner},function (err, result) {

      if (err) {
        console.error(err);
        return;
      }

      if(!result || result.length <= 0) {
        usergrp.save(function(err, reslt) {//save request
          if(err) console.error(err);

          if(sourceSocket) { //send event to target
            sourceSocket.emit('reloadUsers');
          }//end if

          if(targSocket) { //send event to target
            targSocket.emit('reloadUsers');
          }//end if

          GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});

        });//end save
      } else {
        GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});
      }

    });
  },

  rejectRequest: function(data) {
    var GroupRequest = mongoose.model("GroupRequest");
    GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});
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
