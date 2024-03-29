const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const playerSchema = new Schema({
  playername: { type: String, required: true, unique: true },
  points: { type: Number, required: false, unique: false },
  place: { type: Number, required: false, unique: false },
  answerValue: { type: String, required: false, unique: false },
  answerDate: { type: Date, required: false, unique: false },
  avatarString: { type: String, required: true, unique:false },
  id: { type: String, required: true, unique: true }

}, { collection : 'players' });

const player = mongoose.model('players', playerSchema);

module.exports = player;