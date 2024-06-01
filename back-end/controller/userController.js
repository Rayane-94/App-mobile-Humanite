const express = require('express');
const app = express();
const User = require ('../models/User.js')
const jwt = require('jsonwebtoken');
require('dotenv').config()

//const cle_secrete = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZGF0YSI6IkZvcm11bGFpcmUgZGUgQ29uZW54aW9uIiwiaWF0IjoxNTE2MjM5MDIyfQ.D7sPMuAqslb4b0z4NJrEaZs30qfHPg_nGrho-kC6YBc';
//stoker le token dans une variable d'env au prochain step
app.use(express.json());
//const bcrypt = require('bcryptjs')

app.get('/api/testUser', (req, res) => {

    console.log("Requête GET reçue sur /api/test");
    res.send ({ message: "ceci est un test du controlleur user " });
    res.status(200);
  
  });

app.post('/api/login', async (req, res) => {
    
    const { adresse_email, mot_de_passe } = req.body;
  
    try {
      const user = await User.findOne({ adresse_email });
  
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      const comparaisonMDP = mot_de_passe === user.mot_de_passe;
      //Version apres la mise en place de bcrypt =  const comparaisonMDP = await bcrypt.compare (mot_de_passe, user.mot_de_passe);
  
      if (!comparaisonMDP) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({ userId: user._id}, process.env.TOKEN_KEY_SECRET, {expiresIn:'12h'}); //generer un token qui va contenir l'id de l'utilsateur et il a besoin de la clés secrete
  
      res.status(200).json({ message: 'Connexion réussie', token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  });

app.post('/api/logout', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token manquant, déconnexion impossible' });
    }
    const token = authHeader.split(' ')[1]; // Extraction du token sans le préfixe 'Bearer'
    console.log('Mon token est le suivant:', token);

    jwt.verify(token, process.env.TOKEN_KEY_SECRET, (err) => {
        if (err) {
          console.log(err);
            return res.status(401).json({ message: 'Token invalide ou expiré, déconnexion impossible' });
        }

        // Si le token est valide, vous pouvez procéder à la déconnexion
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});

module.exports = app;
