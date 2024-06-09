  const express = require('express');
  const User = require('../models/User');
  const jwt = require('jsonwebtoken');
  require('dotenv').config();

  const router = express.Router();

  router.use(express.json());

  router.get('/testUser', (req, res) => {
    console.log("Requête GET reçue sur /api/testUser");
    res.status(200).send({ message: "ceci est un test du controlleur user" });
  });

  router.post('/login', async (req, res) => {
    const { adresse_email, mot_de_passe } = req.body;
    console.log("Données reçues pour la connexion :", adresse_email, mot_de_passe);

    try {
      const user = await User.findOne({ adresse_email });
      console.log("Utilisateur trouvé :", user);

      if (!user) {
        console.log("Utilisateur non trouvé");
        return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect' });
      }

      const comparaisonMDP = mot_de_passe === user.mot_de_passe;

      if (!comparaisonMDP) {
        console.log("Mot de passe incorrect");
        return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY_SECRET, { expiresIn: '12h' });
      console.log("Token généré :", token);

      res.status(200).json({ message: 'Connexion réussie', token, user });
    } catch (error) {
      console.error("Erreur du serveur :", error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  });

  router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    console.log("Requête de déconnexion reçue avec le token :", authHeader);

    if (!authHeader) {
      console.log("Token manquant");
      return res.status(401).json({ message: 'Token manquant, déconnexion impossible' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_KEY_SECRET, (err) => {
      if (err) {
        console.log("Token invalide ou expiré :", err);
        return res.status(401).json({ message: 'Token invalide ou expiré, déconnexion impossible' });
      }

      res.status(200).json({ message: 'Déconnexion réussie' });
    });
  });

  module.exports = router;
