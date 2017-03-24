# Chatboi
This is a drop-in, easily deployable, chat room written for Node.js. It's written mainly as a demonstration but it's definitely fully usable. As this is more a demonstration application you'll find the code is commented quite fully and explains exactly the purpose of each block. It uses the following packages:

Package|Reason
---|---
[Express](http://expressjs.com/)|Serves the static assets better than default Node
[Socket.io](http://socket.io/)|Websockets are used to exchange chat messages
[µWebSockets](https://github.com/uWebSockets/uWebSockets)|A better web socket engine

There are no front end dependencies apart from a stereotypical modern webstack.

# Customization
Pretty much just CSS; it's in `/public/css/style.css`. I used CSS variables that should be self explanatory, they're at the top of the file. I wouldn't advise messing with the layout if you aren't into that kind of thing, but the whole thing is flexbox so it should be relatively easy.

# Running
- Clone the repo
- `npm install`
- `node`

You should see: `Listening on *:80` if all goes correctly. It uses port 80 by default so that deployment and access is as easy as possible. You can change that at the bottom of `index.js`. Then you can browse to [localhost](http://localhost) in your web browser.

# To Do
1. **More efficient userlist events (join, leave, rename)** - As it stands now, whenever *any* of those events occur the entire userlist is emitted to every single user and the list display is redrawn entirely. This provides an amplification platform that can DoS users by spamming events when there are large numbers of users. Imagine a room of 1000 users and 10 users spamming rename events.
2. End-user visualization of users with the same name - If there are 2 users named 'Bob' in the room a third user cannot distinguish between the 2. Something like: Bob, Bob(2), Bob(n)... with the incrementer styled to prevent incrementer spoofing via renames.
3. Continuous tab indexing - Pressing the tab key should alternate focus between the rename box and the chat box while also highlighting the contents of the respective target.
4. Implement the web crypto API for all exhanged messages - Why not? Seems like an interesting and not too complex thing to implement.
5. Implement web worker multithreading where possible - In the distant future. For example, userlist events and chat events could be threaded. This would require investigation into NodeJS solutions as well.
6. WebRTC channels between users - In the even further distant future. Channels between users means much less server interaction and user to user file transfers/etc. This is a pipe dream for now as it's essentially a rewrite/entirely different functionality. 