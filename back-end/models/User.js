const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  adresse_email: {
    type: String,
    required: true
  },
  mot_de_passe: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
