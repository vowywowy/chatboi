document.addEventListener('DOMContentLoaded', () => {
	const socket = io();
	let myid;

	//get the id of this client's socket
	socket.on('message', (id) => {
		myid = id;
	});

	//when we receive the list of users...
	socket.on('list', (users) => {
		const current = document.getElementById('list');
		//remove the outdated list
		while (current.firstChild) {
			current.removeChild(current.firstChild);
		}
		//append the new list
		users.forEach((user) => {
			const add = document.createElement('div');
			add.setAttribute('class', 'user')
			add.textContent = user.name;
			current.appendChild(add);
		});
		document.getElementById('title').textContent = 'Users Connected (' + users.length + ')';
	});

	//listen for events on #chat and #name
	['chat', 'name'].forEach((i) =>
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
			}
		})
	);

	const nameInput = document.getElementById('name');
	//listen for focus and blur on this ^
	['focus', 'blur'].forEach((e) => {
		nameInput.addEventListener(e, (e) => {
			e.type == 'focus' 
				? nameInput.style.padding = '16px'
				: nameInput.style.padding = '4px';
		})
	});

	//when we receive a new message...
	socket.on('chat', (text, user, id) => {
		//create the elements appropriately
		const chat = document.createElement('div');
		const userSpan = document.createElement('span');
		const textSpan = document.createElement('span');

		userSpan.setAttribute('class', 'username');
		textSpan.setAttribute('class', 'text');
		userSpan.textContent = user + ": ";
		textSpan.innerText = text;

		//check if it's from yourself
		id == myid 
			? chat.setAttribute('class', 'chat me')
			: chat.setAttribute('class', 'chat other');

		//append it
		chat.appendChild(userSpan);
		chat.appendChild(textSpan);
		document.getElementById('container').appendChild(chat);
		document.getElementById('box').scrollTop = document.getElementById('box').scrollHeight;
	});

	//always refocus the chatinput
	document.getElementById('name').focus();
});