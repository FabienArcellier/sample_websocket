var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);

// The server should start listening
server.listen(8000);

var list = []
var iam = ''

// Register the index route of your app that returns the HTML file
app.get('/', function (req, res) {
    console.log("Homepage");
    iam = req.query.iam
    res.sendFile(__dirname + '/index.html');
});

app.get('/msg', function (req, res) {
    console.log("Msg");
    to = req.query.to
    msg = req.query.msg

    list.push({"to": to, "msg": msg})
    res.send("hello");
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));

// Handle connection
io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ...");
    socket.join(iam);

    var news = [
        { title: 'The cure of the Sadness is to play Videogames',date:'04.10.2016'},
        { title: 'Batman saves Racoon City, the Joker is infected once again',date:'05.10.2016'},
        { title: "Deadpool doesn't want to do a third part of the franchise",date:'05.10.2016'},
        { title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales',date:'04.10.2016'},
    ];

    // Send news on the socket
    socket.emit('news', news);
});

function syncHello() {
    // tous les 100 ms je peux requeter un serveur redis 
    // pour savoir les messages à notifier
    while(list.length !== 0) {
        msg = list.shift()
        console.log(msg)
        io.to(msg["to"]).emit("msg", msg["msg"])
    }

    setTimeout(syncHello, 100);
}

setTimeout(syncHello, 100);
