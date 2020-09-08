const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }
}, { collection : 'admins' });

const admin = mongoose.model('admins', adminSchema);

module.exports = admin;