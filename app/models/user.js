// load the things we need
const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

// define the schema for our user model
const userSchema = Schema({
  requestId: { type: String, required: true },
  userId: { type: Number, required: false },
  phoneNumbers: { type: Array },
  name: { type: Object },
  onlineId: { type: Object },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
