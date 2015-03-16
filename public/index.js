var socket;

var conversationid = 1;
var conversationSelected = null;
var conversations;

var login = "abraao";

var conversationstmpl;
var messageshistory;
var messagetmpl;
var userstmpl;
var requeststmpl;

function load() {

  parseTemplates();

  startWebSocket();

  //load users
  loadUsers();
}

function loadUsers() {
  $.get( "/users/list", function( data ) {

    var rendered = Mustache.render(userstmpl, data);
    $( "#usersselect" ).html( rendered );
    $( "#usersselectgroups" ).html( rendered );
    $( "#username" ).html( rendered );

  });
}

function parseTemplates() {
  conversationstmpl = $("#conversationlist").html();
  Mustache.parse(conversationstmpl);

  messageshistory = $("#messageshistory").html();
  Mustache.parse(messageshistory);

  messagetmpl = $("#messagetmpl").html();
  Mustache.parse(messagetmpl);

  userstmpl = $("#userstmpl").html();
  Mustache.parse(userstmpl);

  requeststmpl = $("#requeststmpl").html();
  Mustache.parse(requeststmpl);

}

function startWebSocket() {
    socket = io('http://localhost:3000');

    socket.on('publish', function (data) {
      createMessage(data);
    });

    socket.on('registered', function (data) {

      if(data.status == 'ok') {
        loadConversations();
        $("#username").attr("disabled", true);
      } else {
        alert("falhou ao registrar");
      }

    });

}

function filter(filt) {

}

function selectConversation(id){

  conversationSelected = null;

  clearMsgCounter(id);

  for(var i = 0; i < conversations.length; i++) {
    if(conversations[i].id == id) {
      conversationSelected = conversations[i];
      break;
    }
  }

  if(conversationSelected)
    loadHistory();
}

function loadHistory() {

  $.get( "/messages/list",{id:conversationSelected.id}, function( data ) {

    data.messagetext = function() {
      return processMessageText(this.text);
    };

    data.date = function(){
      var dat = new Date(this.created);
      return dat.getDate() + "-" + dat.getMonth() + "-" + dat.getFullYear();
    }

    var rendered = Mustache.render(messageshistory, data);
    $( "#output" ).prepend( rendered );
  });
}

function loadConversations() {
  $.post( "/conversations/list",{username:$("#username").val()}, function( data ) {//todo pass username

    conversations = data.conversations;
    var usrname = $("#username").val();

    data.nameConversation = function () {

      if(this.label && this.label.length > 0) {
        return this.label;
      } else {

        var out = "";

        for(var i = 0; i < this.targets.length; i++) {
          if(this.targets[i].name != usrname) {
            out += this.targets[i].name + " ";
          }
        }

        return out.trim();
      }
    }

    var rendered = Mustache.render(conversationstmpl, data);
    $( "#conversations" ).html( rendered );
  });
}

function addMsgCounter(data) {
  var divcnt = $("#msgcounter"+data.conversation);
  var cnt = divcnt.attr("msgcounter");

  if(cnt)
    cnt++;
  else
    cnt = 1;

  divcnt.attr("msgcounter", cnt);

  divcnt.html(cnt);
}

function clearMsgCounter(id) {
  var divcnt = $("#msgcounter"+id);
  divcnt.attr("msgcounter", 0);
  divcnt.html("");
}

function createMessage(data) {

  if(!conversationSelected || conversationSelected.id != data.conversation) {
    addMsgCounter(data);
  } else if(conversationSelected) {

    data.messagetext = function() {
      return processMessageText(this.message);
    };

    var rendered = Mustache.render(messagetmpl, data);

    data.date = function(){
      var dat = new Date(this.created);
      return dat.getDate() + "-" + dat.getMonth() + "-" + dat.getFullYear();
    }

    $( "#output" ).append( rendered );

  }
}

function processMessageText(message){
  message = message.replace(/#.\w*/g, function fhref(x){
    ref = "<a href='"+x+"' onclick='filter(\""+x.substring(1)+"\")'>"+x+"</a>";
    return ref;
  });

  return message;
}

function send() {

  if(!conversationSelected)
    return;

  socket.emit('chat', {
      message: document.getElementById("chatbox").value,
      sender: login,
      conversation: conversationSelected.id,
      targets: conversationSelected.targets
  });
}

function register() {

  login = document.getElementById("username").value;

  socket.emit('register', {
      username: login,
      sender: login,
      conversation: conversationid
  });
}

function createConversation() {

  var labelname = $("#labelconversation").val();

  $.post( "/conversations/create",
  {
    username:$("#username").val(),
    labelname: ((labelname) && labelname.length > 0? labelname : null),
    targets: [$("#usersselect").val(), $("#username").val()]
  },
  function( data ) {
    loadConversations();
  });
}

function requestAddUser() {
  socket.emit('requestAddUser', {
      username: $("#username").val(),
      targetuser:  $("#usersselectgroups").val()
  });
}
