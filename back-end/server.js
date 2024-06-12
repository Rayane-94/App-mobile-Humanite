const express = require('express');
const mongoose = require('mongoose');

const app = express();
const contractController = require('./controllers/contractController');
const userController = require('./controllers/userController');

const mongoURI = process.env.MY_MONGO_URI

mongoose.connect(mongoURI)
  .then(() => console.log('Connexion MongoDB réussie'))
  .catch(err => console.error(err));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.get('/api/test', (req, res) => {
  res.send('Hello World from Express & Mongoose!')
});

app.use('/api', contractController);
app.use('/api', userController);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Serveur écoute sur le port ${port}`));
