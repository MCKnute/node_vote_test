
var express = require("express");
var path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render("index");
});



//app.get('/result', function(req, res) {
//	console.log("You have entered the Result page");
// 	res.render("result");
//});

var server = app.listen(8000, function() {
 console.log("listening on port 8000");

});



var io = require('socket.io').listen(server);

	var yesVotes = 0;
	var noVotes = 0;

io.sockets.on('connection', function (socket) {
	console.log("We are couting votes!!");
	io.emit('sum_yesVotes', {response: yesVotes});
	io.emit('sum_noVotes', {response: noVotes});

	

	socket.on("vote", function (data){
	    console.log('Received a new vote of:' + data.newVote);
	    if (data.newVote == 'newYes') {
	    	yesVotes += 1;
	    	console.log("We now have "+ yesVotes +" Yes votes and "+ noVotes +" No votes!");
	    	///socket.emit('votes_response', {response: "Thank you for your vote!"});
	    	io.emit('sum_yesVotes', {response: yesVotes});
	    	io.emit('sum_all', {response: (yesVotes + noVotes)});
	    	return yesVotes;
	    } else if (data.newVote == 'newNo') {
	    	noVotes += 1;
	    	console.log("We now have "+ yesVotes +" Yes votes and "+ noVotes +" No votes!");
	    	//socket.emit('votes_response', {response: "Thank you for your vote!"});
	    	io.emit('sum_noVotes', {response: noVotes});
	    	io.emit('sum_all', {response: (yesVotes + noVotes)});
	    	return noVotes;
	    } else if (data.newVote == 'changeToYes') {
	    	yesVotes += 1;
	    	noVotes -= 1;
	    	console.log("We now have "+ yesVotes +" Yes votes and "+ noVotes +" No votes!");
	    	//socket.emit('votes_response', {response: "Thank you for your vote!"});
	    	io.emit('sum_noVotes', {response: noVotes});
	    	io.emit('sum_yesVotes', {response: yesVotes});
	    	io.emit('sum_all', {response: (yesVotes + noVotes)});
	    	return noVotes, yesVotes;
	    } else if (data.newVote == 'changeToNo') {
	    	noVotes += 1;
	    	yesVotes -= 1;
	    	console.log("We now have "+ yesVotes +" Yes votes and "+ noVotes +" No votes!");
	    	//socket.emit('votes_response', {response: "Thank you for your vote!"});
	    	io.emit('sum_noVotes', {response: noVotes});
	    	io.emit('sum_yesVotes', {response: yesVotes});
	    	io.emit('sum_all', {response: (yesVotes + noVotes)});
	    	return noVotes, yesVotes;
	    }
	    
	});

	socket.on("button_clicked", function (data){
	    console.log('Someone clicked a button!  Reason: ' + data.reason);
	    socket.emit('server_response', {response: "sockets are the best!"});
	});

})





