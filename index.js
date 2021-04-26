const path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
//    res.sendfile('');

   res.sendFile(path.join(__dirname, 'home.html'));
});

app.use(express.static(path.join(__dirname, 'assets')));

var clients = 0;

var color = "#fff";

io.on('connection', function(socket) {
    clients++;

    console.log(clients + 'connected');

    io.sockets.emit('broadcast',{ description: clients + ' clients connected!', color : color});

    //Send a message when 
    setTimeout(function() {
        //Sending an object when emmiting an event
        socket.emit('testerEvent', { description: 'This is Nevil'});
    }, 4000);

    socket.on('disconnect', function () {
        clients--;
        console.log(clients + 'connected');

        io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
    });

    socket.on('bgColorChageEvent', function(data) {
        color = data.color;
        io.sockets.emit('broadcast',{ description: clients + ' clients connected!', color : data.color });
    });

    
});

const listener = http.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
});