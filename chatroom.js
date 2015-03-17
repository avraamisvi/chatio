var mongoose = require('mongoose');
var uuid = require('uuid');

function saveUserGroup(usergrp, callback) {
  usergrp.save(function(err, reslt) {//save request

    if(err)
      console.error(err);
    else
      callback.call(this);

  });//end save
}

function createConversation(userssocks, labelname, userstargets) {

  try {
    var Conversation = mongoose.model("Conversation");

    var uid = uuid.v1();

    var data = {
            label: labelname,
            id: uid+"",
            targets: userstargets
          };

    var convers = new Conversation(data);

    convers.save(function(err, result) {

      if (err) {
        console.error(err);
        res.send(err);
        return;
      }

      console.log(userstargets);
      console.log("for");

      for(ic = 0; ic < userstargets.length; ic++) {

        sock = null;


        console.log(userstargets[ic]);

        if(userstargets[ic])
          sock = userssocks[userstargets[ic].name];

        if(sock)
          sock.emit('loadConversations');
      }
    });

  } catch(ex) {
      console.error(ex);
  }
}

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
        sender: data.sender,
        created: Date.now()
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

    var usergrp = new UserGroup({
      username: data.username,
      groupname: groupname,
      owner: data.owner
    });

    UserGroup.find({username:data.username, owner: data.owner}, function (err, result) {

      if (err) {
        console.error(err);
        return;
      }

      if(!result || result.length <= 0) {
        saveUserGroup(usergrp, function(){ //creates group 1

          var usergrp2 = new UserGroup({
            username: data.owner,
            groupname: groupname,
            owner: data.username
          });

          saveUserGroup(usergrp2, function() {
            GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});

            if(sourceSocket) { //send event to target
              sourceSocket.emit('reloadUsers');
            }//end if

            if(targSocket) { //send event to target
              targSocket.emit('reloadUsers');
            }//end if

          })
        });
      } else {
        GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});
      }

    });
  },

  rejectRequest: function(data) {
    var GroupRequest = mongoose.model("GroupRequest");
    GroupRequest.remove({username:data.username, targetuser: data.owner}, function(err,res){});
  },

  createConversation: function(data) {

        try {
          var Conversation = mongoose.model("Conversation");

          var labelname = "";
          var targs = data.targets;
          var userstargets = [];
          var userssocks = this.users;

          if(data.labelname)
            labelname = data.labelname;

          for(var i = 0; i < targs.length; i++) {
            userstargets.push({name:targs[i]});
          }

          Conversation.where("targets").equals(targs).exec(function(err, result){

            if (err) {
              console.error(err);
            }

            console.log(userstargets);

            if(!result || result.length <= 0) {
              createConversation(userssocks, labelname.trim(), userstargets);//if it not find, creates
            }

          });
      } catch(ex) {
        console.log(ex);
      }
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
