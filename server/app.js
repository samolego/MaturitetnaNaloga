const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/quizApp';

const Admin = require('./model/admin');
const Player = require('./model/player');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));


// Admin login
app.post('/api/admin/login', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, (err) => {
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


// Player creation
app.post('/api/player/create', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, (err) => {
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
				answer: null,
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

// Modifying player
app.post('/api/player/modify', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, (err) => {
		if(err)
			console.log(err);
		Player.update({
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


// Different cors header
app.post('/api/player/answer', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, (err) => {
		if(err)
			console.log(err);
		Player.update({
			id : req.ip.toString()
		}, {$set: {
			answer: req.body.answer
		}},(err, player) => {
			if(err)
				console.log(err);
			return res.status(200).json({
				status: 'success'
			});
		});
	});
});

app.listen(3000, () => console.log('API server running on port 3000!'))