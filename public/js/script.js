document.addEventListener('DOMContentLoaded', () => {
	const socket = io();
	let myid;

	//for dev live reload purposes only
	socket.on('disconnect', () => {
		location.reload();
	});

	//get the id of this client's socket
	socket.on('id', (id) => {
		myid = id;
	});

	//list and newUser events perform similar operations
	['list', 'newUser'].forEach((e) => {
		socket.on(e, (users) => {
			const current = document.getElementById('list');
			//if it's the entire list then...
			if (e == 'list') {
				//remove the old list
				while (current.firstChild) {
					current.removeChild(current.firstChild);
				}
			}
			//for every user we receive...
			users.forEach((user) => {
				//check if it's already being displayed
				if (!document.getElementById(user.id)) {
					//create the new user element
					const add = document.createElement('div');
					add.setAttribute('class', 'user');
					add.setAttribute('id', user.id);
					add.textContent = user.name;
					current.appendChild(add);
					//increase the user count
					document.getElementById('count').textContent++;
				}
			});
		});
	});

	//on a rename event...
	socket.on('rename', (user) => {
		let names = [];
		document.querySelectorAll('.user').forEach((e) => {
			names.push(e.textContent);
		});
		let diff = {
			fluff: '',
			inc: ''
		};
		while (names.find((name) => name == user.name + diff.fluff + diff.inc)) {
			if (diff.fluff == '') {
				diff.fluff = ' - ';
				diff.inc++;
			}
			diff.inc++;
		}
		const change = document.getElementById(user.id);
		change.textContent = user.name + diff.fluff + diff.inc;
	});

	//on a user's disconnection...
	socket.on('oldUser', (user) => {
		document.getElementById(user.id).remove();
		document.getElementById('count').textContent--;
	});

	//listen for events on #chat and #name
	['chat', 'name'].forEach((i) => {
		document.getElementById(i).addEventListener('keydown', (e) => {
			//if key is enter and not shift or it's enter in #name...
			if ((e.keyCode == 13 && !e.shiftKey) || (e.keyCode == 13 && e.target.id == 'name')) {
				e.preventDefault();

				const input = document.getElementById(i);
				if (e.target.id == 'name') {
					input.setAttribute('placeholder', 'Typing as ' + input.textContent + ' (click to change)');
				}

				//string testing, of course this is mirrored on the server
				if (/\S/.test(input.innerText)) {
					socket.emit(e.target.id, input.innerText.trim());
					input.innerHTML = '';
				}
				document.getElementById('chat').focus();
			} else if (e.keyCode == 9) {
				e.preventDefault();
				e.target.id == 'name'
					? (
						document.getElementById('chat').focus(), 
						document.execCommand('selectAll', false, null)
					)
					: (
						document.getElementById('name').focus(),
						document.execCommand('selectAll', false, null)
					);
			}
		});
	});

	const nameInput = document.getElementById('name');
	//listen for focus and blur on this ^
	['focus', 'blur'].forEach((e) => {
		nameInput.addEventListener(e, (e) => {
			e.type == 'focus'
				? nameInput.style.padding = '16px'
				: nameInput.style.padding = '4px';
		});
	});

	//when we receive a new message...
	socket.on('chat', (chat) => {
		//create the elements appropriately
		const message = document.createElement('div');
		const userSpan = document.createElement('span');
		const textSpan = document.createElement('span');

		userSpan.setAttribute('class', 'username');
		textSpan.setAttribute('class', 'text');
		userSpan.textContent = document.getElementById(chat.id).textContent + ": ";
		textSpan.innerText = chat.text;

		//check if it's from yourself
		chat.id == myid
			? message.setAttribute('class', 'chat me')
			: message.setAttribute('class', 'chat other');

		//append it
		message.appendChild(userSpan);
		message.appendChild(textSpan);
		document.getElementById('container').appendChild(message);
		document.getElementById('box').scrollTop = document.getElementById('box').scrollHeight;
	});

	//always refocus the chatinput
	document.getElementById('name').focus();
});
