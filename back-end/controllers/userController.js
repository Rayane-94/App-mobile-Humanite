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

  router.get('/get-user', (req, res) => {
    console.log("Requête GET reçue sur /api/get-user");
    User.find()
      .then(users => {
        console.log("Utilisateurs trouvés :", users);
        res.status(200).json(users);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des utilisateur :", error);
        res.status(400).json({ error });
      });
  });
  
  // router.get('/get-user/:id', (req, res) => {
  //   const { id } = req.params;
  //   console.log("Requête GET reçue sur /api/get-user/" + id);
  //   User.findById(id)
  //     .then(user => {
  //       if (!user) {
  //         console.log("Utilisateur non trouvé");
  //         return res.status(404).json({ message: "Utilisateur non trouvé" });
  //       }
  //       console.log("Utilisateur trouvé :", user);
  //       res.status(200).json({ user });
  //     })
  //     .catch(error => {
  //       console.error("Erreur lors de la récupération du user :", error);
  //       res.status(400).json({ error });
  //     });
  // });

  // router.put('/update-user/:id', async (req, res) => {
  //   const { id } = req.params;
  //   const { adresse_email, mot_de_passe, nom, prenom} = req.body;
  //   console.log("Requête PUT reçue sur /api/update-user/" + id);
  
  //   try {
  //     const user = await User.findById(id);
  //     if (!user) {
  //       console.log("Utilisateur non trouvé");
  //       return res.status(404).json({ message: "Utilisateur non trouvé" });
  //     }
  
  //     let aucunChampUpdate = false;
  
  //     if (adresse_email !== undefined && adresse_email !== user.adresse_email) {
  //       user.adresse_email = adresse_email;
  //       aucunChampUpdate = true;
  //     }
  
  //     if (mot_de_passe !== undefined && mot_de_passe !== user.mot_de_passe) {
  //       user.mot_de_passe = mot_de_passe;
  //       aucunChampUpdate = true;
  //     }
  
  //     if (nom !== undefined && nom !== user.nom) {
  //       user.nom = nom;
  //       aucunChampUpdate = true;
  //     }
  
  //     if (prenom !== undefined && prenom !== user.prenom) {
  //       user.prenom = prenom;
  //       aucunChampUpdate = true;
  //     }
      
  //     if (!aucunChampUpdate) {
  //       console.log("Aucun champ n'a été modifié");
  //       return res.status(400).json({ message: "Aucun champ n'a été modifié" });
  //     }
  
  //     await user.save();
  //     console.log("Utilisateur mis à jour avec succès :", user);
  //     return res.status(200).json({ message: "Utilisateur mis à jour avec succès", user });
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
  //     return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  //   }
  // });
  

  // router.delete('/delete-user/:id', async (req, res) => {
  //   const { id } = req.params;
  //   console.log("Requête DELETE reçue sur /api/delete-user/" + id);
  //   try {
  //     const deletedUser = await User.findByIdAndDelete(id);
  //     if (!deletedUser) {
  //       console.log("Utilisateur non trouvé");
  //       return res.status(404).json({ message: "Utilisateur non trouvé" });
  //     }
  //     console.log("Utilisateur supprimé avec succès :", deletedUser);
  //     res.status(201).json({ message: "Utilisateur supprimé avec succès", deletedUser });
  //   } catch (error) {
  //     console.error("Erreur lors de la suppression de l'utilisateur :", error);
  //     res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  //   }
  // });

  module.exports = router;
