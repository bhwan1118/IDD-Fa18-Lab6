/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, hello I am \"RudeBot\" a terrible chat bot."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = input + '? What an Ugly Name'; // output response
    waitTime = 5000;
    question = 'How old are you?'; // load next question
  } else if (questionNum == 1) {
    answer = 'Man you are old, ' + input + ' years old means you are: ' + (100 - parseInt(input)) + ' years away from kicking the can'; // output response
    waitTime = 5000;
    question = 'How old do you think I am?'; // load next question
  } else if (questionNum == 2) {
    answer = 'Wrong: younger than you.';
    waitTime = 5000;
    question = 'Whats your favorite color?'; // load next question
  } else if (questionNum == 3) {
    
        if( input.toLowerCase() === 'red') {
	answer = 'Ah. Maybe you arent so bad afterall';
	socket.emit('changeBG','red');
	waitTime = 5000;
	question = 'Last Question: who is the fairest of them all?'
	
	} else{
	answer = input + '? meh I only like red';
    	socket.emit('changeBG', 'red');
    	waitTime = 5000;
    	question = 'Last Question: who is the fairest of them all?'; // load next question
  	}
} else if (questionNum == 4) {
    if (input.toLowerCase() === 'Ben' || input === 'ben') {
      answer = 'Perfect!';
      waitTime = 5000;
      question = '';

    } else {
      answer = 'My Creator Ben of Course! Jeez go get educated'
      waitTime = 5000;
      question = '';
    }
    // load next question
} else {
    answer = 'You have just been served by rudebot. Goodbye'; // output response    
    waitTime = 0;

}


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
