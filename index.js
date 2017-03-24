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
	//send the client it's own id
	socket.send(socket.id);

	//add it to the array, name will hold the user's desired name
	users.push({
		id: socket.id,
		name: socket.id
	});
	//send the new user list
	io.emit('list', users);

	//on rename event
	socket.on('name', renameEv);
	function renameEv(name) {
		//verify it; 1-16 characters
		if (typeof name !== "undefined") {
			const rename = name.substr(0, 15);
			//find that users id in the list
			const obj = users.find((user) => (user).id == socket.id);
			let index = users.indexOf(obj);
			//modify the list with the new name
			users.fill(obj.name = rename, index, index++);
			//send that new user list
			io.emit('list', users);
		}
	}

	//when we receive a chat message
	socket.on('chat', chatEv);
	function chatEv(chat) {
		//verify it
		if (typeof chat !== 'undefined' && /\S/.test(chat)) {
			//send it to everyone
			io.emit('chat', chat.trim(), rename, socket.id);
		}
	}

	//when a user leaves
	socket.on('disconnect', disconnectEv);
	function disconnectEv() {
		const obj = users.find((user) => user.id == socket.id);
		const index = users.indexOf(obj);
		//splice the list where the user was found
		if (index > -1) {
			users.splice(index, 1);
		}
		//send that new list
		io.emit('list', users);
	}
});


//we listen on 80
http.listen(port = 80, function() {
	console.log('Listening on *:' + port);
});