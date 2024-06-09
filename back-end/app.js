const express = require('express');

const app = express();
const contractController = require('./controller/contractController');
const userController = require('./controller/userController');


app.use(express.json());


app.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Associer tout les route au controller
app.use('/api', contractController);
app.use('/api', userController);

module.exports = app;
