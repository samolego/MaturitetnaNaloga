const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/quizApp';
const http = require('http').Server(app);
const io = require("socket.io")(http, {
	cors: {
	  origin: "http://localhost:4200",
	  methods: ["GET", "POST"],
	  allowedHeaders: ["main-header"],
	  credentials: true
	}
});

const Admin = require('./model/admin');
const Player = require('./model/player');
const { response } = require('express');
const player = require('./model/player');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };
var settings = {
	enableAnswers: true
}

/*
	// Admin login
app.post('/api/admin/login', (req, res) => {
	mongoose.connect(url, mongooseOptions, (err) => {
		if(err)
			console.log(err);
		Admin.find({
			username : req.body.username, password : req.body.password
		}, (err, admin) => {
			if(err)
				console.log(err);
			if(admin.length === 1){	
				return res.status(200).json({
					status: 'success',
					data: admin
				});
			} else {
				return res.status(200).json({
					status: 'fail',
					message: 'Login Failed'
				});
			}
		});
	});
});

// Modifying player
app.post('/api/admin/playerModify', (req, res) => {
	mongoose.connect(url, mongooseOptions, (err) => {
		if(err)
			console.log(err);
		Player.updateOne({
			id : req.ip.toString()
		}, {$set: {
			points: this.points + req.body.pointsPlus
		}},(err, player) => {
			if(err)
				console.log(err);
			return res.status(200).json({
				status: 'success'
			});
		});
	});
});


// OPEN TO ALL CLIENTS

// Player creation
app.post('/api/player/create', (req, res) => {
	mongoose.connect(url, mongooseOptions, (err) => {
		if(err)
			console.log(err);
		Player.find({
			id : req.ip.toString()
		}, (err, el) => {
			if(el.length === 1) {
				return res.status(200).json({
					status: 'fail',
				});
			}

			const player = new Player({
				playername: req.body.playername,
				points: 0,
				answerValue: null,
				answerDate: null,
				isMale: req.body.isMale,
				id: req.ip.toString()
			});
			player.save((err, _res) => {
				if(err)
					console.log(err);
				return res.status(200).json({
					status: 'success'
				});
			});
		});
	});
});

// Answer
app.post('/api/player/answer', (req, res) => {
	mongoose.connect(url, mongooseOptions, (err) => {
		if(err)
			console.log(err);
		Player.updateOne({
			id : req.ip.toString(),
			answerValue: null
		}, {$set: {
			answerValue: req.body.answer,
			answerDate: new Date()
		}},(err, player) => {
			if(err)
				console.log(err);
			
			// socket
			var answers = [];
			/*Player.find(
				{  $nor: 
					[{
						answerValue: null
					}]
				}, (err, author) => {
					if(err)
						console.log(err);

					answers.push(author.answerValue);
					console.log(answers);
				}
			);*/
/*
			return res.status(200).json({
				status: player.nModified > 0 ? 'success' : 'fail'
			});
		});
	});
});

app.listen(3000, () => console.log('API server running on port 3000!'));*/

// NEW

mongoose.connect(url, mongooseOptions, (err) => {
	if(err)
		console.log(err);

	io.on('connection', (socket) => {
		const address = socket.handshake.address;
		console.log(address);
		console.log("A user connected");
	
		// Player
		socket.emit('clientSettingsS2C', settings);

		socket.on('createPlayerC2SPlayer', (data) => {
			Player.find({
				id : address.toString()
			}, (err, el) => {
				if(err)
					console.log(err);
				if(el.length === 1)
					socket.emit("createPlayerS2CPlayer", 'fail');
				
	
				const player = new Player({
					playername: data.playername,
					points: 0,
					answerValue: null,
					answerDate: null,
					isMale: data.isMale,
					id: address.toString()
				});
				player.save((err, _res) => {
					if(err)
						console.log(err);
					socket.emit("createPlayerS2CPlayer", 'success');
					refreshPlayers();
				});
			});
		});

		socket.on('writeAnswerC2SPlayer', (answer) => {
			Player.updateOne({
				id : address.toString(),
				answerValue: null
			}, {$set: {
				answerValue: answer,
				answerDate: new Date()
			}},(err, player) => {
				if(err)
					console.log(err);

				socket.emit("writeAnswerS2CPlayer", player.nModified > 0 ? 'success' : 'fail');
				Player.find({}, (err, players) => {
					if(err)
						console.log(err);
					// Sending to all except sender
					socket.broadcast.emit("refreshPlayersS2C", players);
				});
			});
		});




		// Admin
		socket.on('refreshPlayersC2S', () => {
			refreshPlayers();
		});

		async function refreshPlayers() {
			console.log("Refreshing players.");
			Player.find({}, (err, players) => {
				if(err)
					console.log(err);
				io.emit("refreshPlayersS2C", players);
			});
		}

		socket.on('pointsC2S', (data) => {
			Player.updateOne({
				id : data.id
			}, {$inc: {
				points: data.points
			}},(err) => {
				if(err)
					console.log(err);
			});
		});

		socket.on('clearAnswersC2S', () => {
			Player.updateMany({}, {$set: {
				answerValue: null
			}},(err) => {
				if(err)
					console.log(err);
			});
		});
	});
});


http.listen(4444);
