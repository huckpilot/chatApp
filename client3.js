/////////////////////
//This is an unstable section!!!!

//This is to allow for notifications
var notifier = require('node-notifier');
var path = require('path');

notifier.notify({
  title: 'My awesome title',
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

var net = require('net');

var client = net.Socket();
client.connect(3000, function() {
  console.log('Connected to Server');
  //client.write("Hello Server");

//-----------This block allows me to write to the server
process.stdin.on('readable', function() {
  var say = process.stdin.read();
  if (say !== null) {
    client.write('data: ' + say);
  }
});

process.stdin.on('end', function() {
  client.write('end');
});

//--------This block of code reacts and displays the info from server
  client.on('data', function(data){
    console.log(data.toString().trim());
  });


  client.on('end', function() {
    console.log('disconnected from server');
  });
});