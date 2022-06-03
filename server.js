const { all } = require('express/lib/application');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
var alluser = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){


    socket.on('RegistName', function(name){
        if(alluser.indexOf(name) != -1){
            socket.emit('ServerRespond', 'This name is already used',false);
        }else{
            socket.emit('ServerRespond', 'You have successfully registered',true);
            alluser.push(name);
            users[socket.id] = name;
            socket.broadcast.emit('userlog', name + ' has entered the chat');
        }
    });

    console.log('a user connected');

    socket.on('disconnect', function(){ 
        if(users[socket.id]){
            socket.broadcast.emit('userlog', users[socket.id] + ' has left the chat');
            delete users[socket.id];
            var index = alluser.indexOf(users[socket.id]);
            alluser.splice(index,1);
        }
        console.log('user disconnected');
    });
    socket.on('Pesanmasuk', function(user,msg){
        io.emit('pesanbaru', user,msg);
        console.log(user + ' : ' + msg);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});