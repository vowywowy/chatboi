//express and socket.io
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//enable use of uws
io.engine.ws = new (require('uws').Server)({
    noServer: true,
    perMessageDeflate: false
});

//setting static asset path
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

//array to hold connected users
var users = [];
io.on('connection', function(socket) {
	//send the client it's own id
	socket.send(socket.id);
	var rename = socket.id;

	//add it to the array, rename will hold the user's desired name
	users.push({
		id: socket.id,
		name: rename
	});
	//send the new user list
	io.emit('list', users);

	//on rename event
	socket.on('name', (name) => {
		//verify it; 1-16 characters
		if (typeof name !== "undefined") {
			rename = name.substr(0, 16);
			//find that users id in the list
			var obj = users.find(x => x.id === socket.id),
				index = users.indexOf(obj);
			//modify the list with the new name
			users.fill(obj.name = rename, index, index++);
			//send that new user list
			io.emit('list', users);
		}
	});

	//when we receive a chat message
	socket.on('chat', (chat) => {
		//verify it
		if (typeof chat !== "undefined" && /\S/.test(chat)) {
			//send it to everyone
			io.emit('chat', chat.trim(), rename, socket.id);
		}
	});

	//when a user leaves
	socket.on('disconnect', () => {
		var obj = users.find(x => x.id === socket.id),
			index = users.indexOf(obj);
		//splice the list where the user was found
		if (index > -1) {
			users.splice(index, 1);
		}
		//send that new list
		io.emit('list', users);
	});
});

//we listen on 80
http.listen(port = 80, function() {
	console.log('listening on *:' + port);
});