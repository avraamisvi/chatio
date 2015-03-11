module.exports = {

  conversations:{}

  receive: function(socket, data){
    //save in mongo
    socket.emit('publish',
      {
        message: data.message,
        conversation:  data.conversation,
        sender: data.sender
      });
  },

  save: function(data) {//will save async in mongodb
    conv = conversations[""+data.conversation];

    if(!conv) {
      conv = {messages:[]};
      conversations[""+data.conversation] = conv;
    }

    conv.messages.push(data);
  }

}
