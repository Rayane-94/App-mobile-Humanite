const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom:{
    type:String,
    required: false
  },
  prenom:{
    type:String,
    required: false
  },
  adresse_email: {
    type: String,
    required: true
  },
  mot_de_passe: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema); //Mongoose convertira le model User en une collections "users" => pluriel + minuscules 
