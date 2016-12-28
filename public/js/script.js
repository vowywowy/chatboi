document.addEventListener('DOMContentLoaded', () => {
	var socket = io(),
		myid;

	//get the id of this client's socket
	socket.on('message', function(id) {
		myid = id;
	});

	//when we receive the list of users...
	socket.on('list', function(users) {
		var current = document.getElementById("users");
		//remove the outdated list
		while (current.firstChild) {
			current.removeChild(current.firstChild);
		}
		//append the new list
		users.forEach((user) => {
			var add = document.createElement('div');
			add.setAttribute('class', 'user')
			add.textContent = user.name;
			current.appendChild(add);
		});
		document.getElementById("title").textContent = 'Users Connected (' + users.length + ')'
	});

	//listen for events on #chat and #name
	['chat', 'name'].forEach(i =>
		document.getElementById(i).addEventListener('keydown', (e) => {
			//if key is enter and not shift or it's enter in #name...
			if ((e.keyCode == 13 && !e.shiftKey) || (e.keyCode == 13 && e.target.id == 'name')) {
				e.preventDefault();
				var input = document.getElementById(i);
				if (e.target.id == 'name') {
					input.setAttribute('placeholder', 'Typing as ' + input.textContent + " (click to change)")
				}
				//string testing, of course this is mirrored on the server
				if (/\S/.test(input.innerText)) {
					socket.emit(e.target.id, input.innerText.trim());
					input.innerHTML = '';
				}
				document.getElementById('chat').focus();
			}
		})
	);

	var nameInput = document.getElementById('name');
	//listen for focus and blur on this ^
	['focus', 'blur'].forEach(function(e) {
		nameInput.addEventListener(e, (e) => {
			if (e.type == 'focus') {
				nameInput.style.padding = "16px";
			} else {
				nameInput.style.padding = "4px";
			}
		})
	});

	//when we receive a new message...
	socket.on('chat', function(text, user, id) {
		//create the element appropriately
		var chat = document.createElement('div'),
			userSpan = document.createElement('span'),
			textSpan = document.createElement('span'),
			container = document.getElementById('container'),
			box = document.getElementById('box');
		userSpan.setAttribute('class', 'username');
		textSpan.setAttribute('class', 'text');
		userSpan.textContent = user + ": ";
		textSpan.innerText = text;

		//check if it's from yourself
		if (id === myid) {
			chat.setAttribute('class', 'chat me');
		} else {
			chat.setAttribute('class', 'chat other');
		}

		//append it
		chat.appendChild(userSpan);
		chat.appendChild(textSpan);
		container.appendChild(chat);
		box.scrollTop = box.scrollHeight;
	});

	//always refocus the chatinput
	document.getElementById('name').focus();
});