// Goal is to echo keypresses sent from the front end
// to the other client. Whenever a client experiences
// a button press, it will send that information
// to the server to be stored by the server.
// Periodically, both clients will
// call home to the server, looking for new updated 
// keypress information from the other client. The server
// basically just sends json data representing the current
// key presses of the other client. 


//app: Express application. 
module.exports = function(app) {
	var express = require('express');
	var path = require('path');

	

	return app;
};