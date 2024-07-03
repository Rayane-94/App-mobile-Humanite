const mongoose = require('mongoose');

const CamionSchema = new mongoose.Schema({
  depart: {
    localisation: {
      type: {
        latitude: {
          type: Number,
          required: true
        },
        longitude: {
          type: Number,
          required: true
        }
      },
      required: true
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  debut_chargement: {
    localisation: {
      type: {
        latitude: {
          type: Number,
          required: false
        },
        longitude: {
          type: Number,
          required: false
        }
      },
      required: false
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  fin_chargement: {
    localisation: {
      type: {
        latitude: {
          type: Number,
          required: false
        },
        longitude: {
          type: Number,
          required: false
        }
      },
      required: false
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  /*contract_id: {
    type: Number,
    required: false
  }*/
});

module.exports = mongoose.model('Camion', CamionSchema);
