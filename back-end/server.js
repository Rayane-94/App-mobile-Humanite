const express = require('express');
const mongoose = require('mongoose');

const app = express();
const contractController = require('../back-end/controller/contractController');
const userController = require('../back-end/controller/userController');

const mongoURI = "mongodb+srv://rayane:rayane@cluster0.tneegxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Remplacez par vos détails

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion MongoDB réussie'))
  .catch(err => console.error(err));

// Middleware global pour traiter les requêtes JSON
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.send('Hello World from Express & Mongoose!')
});

app.use('/api', contractController);
app.use('/api', userController);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Serveur écoute sur le port ${port}`));
