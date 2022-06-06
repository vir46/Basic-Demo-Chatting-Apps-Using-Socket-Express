const { all } = require('express/lib/application');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
var alluser = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// initiated when a user connects to platform
io.on('connection', function(socket){

    // server validation for username
    socket.on('RegistName', function(name){
        if(alluser.indexOf(name) != -1){
            socket.emit('ServerRespond', 'This name is already used',false);
        }else{
            socket.emit('ServerRespond', 'You have successfully registered',true);
            alluser.push(name);
            users[socket.id] = name;
            socket.broadcast.emit('userlog', name + ' has entered the chat');
            io.emit('showOnline', alluser);
        }
    });

    console.log('a user connected');

    // initiate when a user disconnects
    socket.on('disconnect', function(){ 
        if(users[socket.id]){
            socket.broadcast.emit('userlog', users[socket.id] + ' has left the chat');
            var index = alluser.indexOf(users[socket.id]);
            delete users[socket.id];
            alluser.splice(index,1);
            io.emit('showOnline', alluser);
        }
        console.log('user disconnected');
    });

    // broadcast to all client if someone typing
    socket.on('typing', function(data){
       socket.broadcast.emit('typing', data);
    });
    
    // broadcast to all client if someone stop typing
    socket.on('stoptyping', function(data){
        socket.broadcast.emit('stopTyping', data);
    });

    // broadcast to all client if someone sending message
    socket.on('Pesanmasuk', function(user,msg){
        io.emit('pesanbaru', user,msg);
        console.log(user + ' : ' + msg);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});