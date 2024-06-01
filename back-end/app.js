const express = require('express');
const app = express();
const contractController = require('./controller/contractController');
const userController = require ('./controller/userController');

// Middleware pour analyser le corps des requêtes entrantes au format JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Associer tout les route au controller
app.use('/', contractController);
app.use('/', userController);

module.exports = app;
