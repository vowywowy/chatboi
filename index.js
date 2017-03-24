//express, socket.io, and uws
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uws = require('uws').Server;

//enable use of uws
io.engine.ws = new (uws)({
    noServer: true,
    perMessageDeflate: false
});

//setting static asset path
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

//array to hold connected users
let users = [];
io.on('connection', (socket) => {
	//tell the client it's own id
	socket.emit('id', socket.id);

	//send the master user list to the new connection
	socket.emit('list', users);

	//tell everyone the new user's info
	io.emit('newUser', [{id: socket.id, name: socket.id}]);

	//add new info to the array, name will hold the user's desired name
	users.push({
		id: socket.id,
		name: socket.id
	});

	//on rename event
	socket.on('name', renameEv);
	function renameEv(name) {
		//verify it; 1-16 characters
		if (typeof name !== "undefined") {
			name = name.substr(0, 15);
			//find that users id in the list
			const user = users.find((old) => old.id == socket.id);
			let index = users.indexOf(user);
			//modify the master list with the new name
			users.fill(user.name = name, index, index++);
			//send renamed user
			io.emit('rename', user);
		}
	}

	//when we receive a chat message
	socket.on('chat', chatEv);
	function chatEv(chat) {
		//verify it
		if (typeof chat !== 'undefined' && /\S/.test(chat)) {
			//send it to everyone
			io.emit('chat', { text: chat.trim(), id: socket.id });
		}
	}

	//when a user leaves
	socket.on('disconnect', disconnectEv);
	function disconnectEv() {
		const user = users.find((old) => old.id == socket.id);
		const index = users.indexOf(user);
		//splice the list where the user was found
		if (index > -1) {
			users.splice(index, 1);
		}
		//send user to remove
		io.emit('oldUser', user);
	}
});


//we listen on 80
http.listen(port = 80, function() {
	console.log('Listening on *:' + port);
});