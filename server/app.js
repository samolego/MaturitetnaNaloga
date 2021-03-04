const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/quizApp';
const http = require('http').Server(app);

const io = require("socket.io")(http, {
	cors: {
	  origin: "*", //todo CHANGE AFTER RELEASE
	  methods: ["GET", "POST"],
	  allowedHeaders: ["main-header"],
	  credentials: true
	}
});
const crypto = require('crypto');

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

const username = "admin"
const passwd = crypto.createHash("sha256").update("admin").digest("hex");
const token = generateUuid();

function generateUuid() {
	// https://gist.github.com/LeverOne/1308368
	let a, b;
	for(b=a=''; a++<72; b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'');
	return b;
}

/*
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

*/
// NEW

mongoose.connect(url, mongooseOptions, (err) => {
	if(err)
		console.log(err);

	io.on('connection', (socket) => {
		const address = socket.handshake.address;
		if (socket.handshake.query && socket.handshake.query.token) {
			console.log(socket.handshake.query.token);
		}

		var admin = true;/*
		if (socket.handshake.query && socket.handshake.query.username == username && crypto.createHash("sha256").update(socket.handshake.query.password).digest("hex") == passwd) {
			// Succes, let's send token.
			socket.emit("tokenSecretS2CAdmin", token);
			admin = true;
		}
		else
			admin = socket.handshake.query && socket.handshake.query.token == token;*/

		console.log("A user connected: " + address);
		console.log("Admin: " + admin);


		// Player
		socket.emit('clientSettingsS2CPlayer', settings);
		refreshWisePlayers();

		socket.on('createPlayerC2SPlayer', (data) => {
			Player.find({
				id : address.toString()
			}, (err, el) => {
				if(err) {
					console.log(err);
					socket.emit("createPlayerS2CPlayer", 'fail');
				}
				else if(el.length === 1)
					socket.emit("createPlayerS2CPlayer", 'fail');
				else {
					console.log(address);
					const player = new Player({
						playername: data.playername,
						points: 0,
						place: 0,
						answerValue: null,
						answerDate: null,
						avatarString: data.avatar,
						id: address.toString()
					});
					player.save((err, _res) => {
						if(err)
							console.log(err);
						else {
							socket.emit("createPlayerS2CPlayer", 'success');
							refreshPlayers();
						}
					});
				}

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
				refreshPlayers();
				Player.find({
					answerValue: {
						$ne: null
					}
				}, (err, players) => {
					if(err)
						console.log(err);
					players.sort((a, b) => {
						a.answerValue = null;
						b.answerValue = null;
						return a.answerDate - b.answerDate;
					});
					io.emit("wisePlayersS2CPlayer", players);
				});
			});
		});

		socket.on("wisePlayersC2SPlayer", () => {
			refreshWisePlayers();
		});




		// Admin
		socket.on('refreshPlayersC2SAdmin', () => {
			if(admin) {
				refreshPlayers();
			}
			else {
				socket.emit('invalidTokenS2CAdmin');
			}
		});

		socket.on('sortPlayersC2SAdmin', () => {
			if(admin) {
				Player.updateMany({}, {
					$set: {
						place: 0
					}
				}, (err) => {
					if(err)
						console.log(err);
				});
				
				/*
				Player.sort({
					points: -1,
					_id: -1
				}).update((err, players) => {
					if(err)
						console.log(err);
					console.log(players);
				});/*.update();
				// or this?
				Player.update({
					points: -1,
					_id: -1
				});*/
				refreshPlayers();
			}
			else {
				socket.emit('invalidTokenS2CAdmin');
			}
		});

		async function refreshPlayers() {
			Player.find({}, (err, players) => {
				if(err)
					console.log(err);
				io.emit("refreshPlayersS2CAdmin", players);
			});
		}

		async function refreshWisePlayers() {
			Player.find({
				answerValue: {
					$ne: null
				}
			}, (err, players) => {
				if(err)
					console.log(err);
				players.sort((a, b) => {
					a.answerValue = null;
					b.answerValue = null;
					return a.answerDate - b.answerDate;
				});
				socket.emit("wisePlayersS2CPlayer", players);
			});
		}

		socket.on('pointsC2SAdmin', (data) => {
			if(admin) {
				Player.updateOne({
					id : data.id
				}, {$inc: {
					points: data.points
				}},(err) => {
					if(err)
						console.log(err);
					refreshPlayers();
				});
			}
			else {
				socket.emit('invalidTokenS2CAdmin');
			}
		});

		socket.on('clearAnswersC2SAdmin', () => {
			if(admin) {
				Player.updateMany({}, {$set: {
					answerValue: null
				}},(err) => {
					if(err)
						console.log(err);
					io.emit("wisePlayersS2CPlayer", []);
				});
			}
			else {
				socket.emit('invalidTokenS2CAdmin');
			}
		});
	});
});


http.listen(4444);
