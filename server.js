/////////////////////
//This is an unstable section!!!!

//This is to allow for notifications
var notifier = require('node-notifier');
var path = require('path');

notifier.notify({
	title: 'Welcome to the party',
	message: 'Hello, lets get weird',
  icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons) 
  sound: true, // Only Notification Center or Windows Toasters 
  wait: true // wait with callback until user action is taken on notification 
}, function (err, response) {
  // response is response from notification 
});

notifier.on('click', function (notifierObject, options) {
  // Happens if `wait: true` and user clicks notification 
});

notifier.on('timeout', function (notifierObject, options) {
  // Happens if `wait: true` and notification closes 
});

/////////////////////

// Load the TCP Library
var net = require('net');

// Keep track of chat clients
var clients = [];

// Allows us to write to a file
var fs = require('fs');

// stores the old chat
var chatArray = []

// Establishes a port
var port = 3000

// Start a TCP Server
var server = net.createServer(function(socket) {

	// Create a new file and send the data from clients to it as a string
	fs.readFile("chatHist.txt", function(err, data) {
		if(err) {
			console.log(err)
		}
		else {
			var history = data.toString();
			socket.write(history);
		}
	});

	// Identify this client
	socket.name = socket.remoteAddress + ":" + socket.remotePort

	
	// Put this new client in the list
	clients.push(socket);

	// Send a nice welcome message and announce
	socket.write("Welcome" + socket.name + "\n");
	broadcast(socket.name, "joined the chat\n", socket);

	// Handle incoming messages from clients.
	socket.on('data', function(data) {
		broadcast(socket.name + ">" + data, socket);
		
		//Pushes chat history to chatHist.txt file
		var clientWords = data.toString().trim();
		chatArray.push(clientWords);
		fs.writeFile("chatHist.txt", chatArray, function(err) {
			if(err) {
				console.log(err);
			}
			else {
				console.log("It worked!");
			}
		});
	});

	// Remove the client from the list when it leaves
	socket.on('end', function() {
		clients.splice(clients.indexOf(socket), 1);
		broadcast(socket.name + " left the chat.\n");
	});

	//Send a message to all clients
	function broadcast(message, sender) {
		clients.forEach(function (client) {
			if(client === sender) return;
			client.write(message);
			notifier.notify({
				title: 'New Message',
				message: 'The party is poppin\', where are you?',
  icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons) 
  sound: true, // Only Notification Center or Windows Toasters 
  wait: true // wait with callback until user action is taken on notification 
}, function (err, response) {
  // response is response from notification 
});

		});
		// Log it to the server output too
		process.stdout.write(message)
	}
});

server.listen(port, function() {
	console.log("listening on port "+ port);
});

