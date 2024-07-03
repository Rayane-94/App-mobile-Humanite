const mongoose = require('mongoose');

const CamionSchema = new mongoose.Schema({
  depart: {
    localisation: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true,
      //default: Date.now
    }
  },
  debut_chargement: {
    localisation: {
      type: String,
      required: false
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  fin_chargement: {
    localisation: {
      type: String,
      required: false
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  contract_id: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model('Camion', CamionSchema);
