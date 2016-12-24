# Chatboi
This is a drop-in, easily deployable, chat room written for Node.js. It's written mainly as a demonstration but it's definitely fully usable. As this is more a demonstration application you'll find the code is commented quite fully and explains exactly the purpose of each block. It uses the following packages:

Package|Reason
---|---
[Express](http://expressjs.com/)|Serves the static assets better than default Node
[Socket.io](http://socket.io/)|Websockets are used to exchange chat messages

There are no front end dependencies apart from a stereotypical modern webstack.

# Customization
Pretty much just CSS; it's in `/public/css/style.css`. I used CSS variables that should be self explanatory, they're at the top of the file. I wouldn't advise messing with the layout if you aren't into that kind of thing, but the whole thing is flexbox so it should be relatively easy.

# Running
- Clone the repo
- `npm install`
- `node app.js`

You should see: `listening on *:80` if all goes correctly. It uses port 80 by default so that deployment and access is as easy as possible. You can change that at the bottom of `app.js`. Then you can browse to [localhost](http://localhost) in your web browser.
