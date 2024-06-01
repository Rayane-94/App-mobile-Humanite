const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
  /*user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }*/
});

module.exports = mongoose.model('Contract', ContractSchema);
