const express = require('express');
const Admin = require('../models/Admin');  
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.use(express.json());

router.get('/testAdmin', (req, res) => {
  console.log("Requête GET reçue sur /api/testAdmin");
  res.status(200).send({ message: "Ceci est un test du contrôleur admin" });
});

// Route de connexion pour les admins
router.post('/admin/login', async (req, res) => {
  const { adresse_email, mot_de_passe } = req.body;
  console.log("Données reçues pour la connexion admin :", adresse_email, mot_de_passe);

  try {
    const admin = await Admin.findOne({ adresse_email });
    console.log("Admin trouvé :", admin);

    if (!admin) {
      console.log("Admin non trouvé");
      return res.status(400).json({ message: 'Adresse email ou mot de passe incorrect' });
    }

    const comparaisonMDP = mot_de_passe === admin.mot_de_passe;

    if (!comparaisonMDP) {
      console.log("Mot de passe incorrect");
      return res.status(400).json({ message: 'Adresse email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.TOKEN_KEY_SECRET, { expiresIn: '12h' });
    console.log("Token généré pour l'admin :", token);

    res.status(200).json({ message: "Connexion réussie en tant qu'admin", token, admin });
  } catch (error) {
    console.error("Erreur du serveur lors de la connexion admin :", error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

router.get('/get-admin', (req, res) => {
  console.log("Requête GET reçue sur /api/get-admins");
  Admin.find()
    .then(admins => {
      console.log("Admins trouvés :", admins);
      res.status(200).json(admins);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des admins :", error);
      res.status(400).json({ error });
    });
});

// Route pour récupérer un admin par son ID
router.get('/get-admin/:id', (req, res) => {
  const { id } = req.params;
  console.log("Requête GET reçue sur /api/get-admin/" + id);
  Admin.findById(id)
    .then(admin => {
      if (!admin) {
        console.log("Admin non trouvé");
        return res.status(404).json({ message: "Admin non trouvé" });
      }
      console.log("Admin trouvé :", admin);
      res.status(200).json({ admin });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de l'admin :", error);
      res.status(400).json({ error });
    });
});

// Route pour mettre à jour un admin par son ID
router.put('/update-admin/:id', async (req, res) => {
  const { id } = req.params;
  const { adresse_email, mot_de_passe, nom, prenom } = req.body;
  console.log("Requête PUT reçue sur /api/update-admin/" + id);

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      console.log("Admin non trouvé");
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    let aucunChampUpdate = false;

    if (adresse_email !== undefined && adresse_email !== admin.adresse_email) {
      admin.adresse_email = adresse_email;
      aucunChampUpdate = true;
    }

    if (mot_de_passe !== undefined && mot_de_passe !== admin.mot_de_passe) {
      admin.mot_de_passe = mot_de_passe;
      aucunChampUpdate = true;
    }

    if (nom !== undefined && nom !== admin.nom) {
      admin.nom = nom;
      aucunChampUpdate = true;
    }

    if (prenom !== undefined && prenom !== admin.prenom) {
      admin.prenom = prenom;
      aucunChampUpdate = true;
    }

    if (!aucunChampUpdate) {
      console.log("Aucun champ n'a été modifié");
      return res.status(400).json({ message: "Aucun champ n'a été modifié" });
    }

    await admin.save();
    console.log("Admin mis à jour avec succès :", admin);
    return res.status(200).json({ message: "Admin mis à jour avec succès", admin });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'admin :", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de l'admin" });
  }
});

// Route pour supprimer un admin par son ID
router.delete('/delete-admin/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Requête DELETE reçue sur /api/delete-admin/" + id);
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      console.log("Admin non trouvé");
      return res.status(404).json({ message: "Admin non trouvé" });
    }
    console.log("Admin supprimé avec succès :", deletedAdmin);
    res.status(201).json({ message: "Admin supprimé avec succès", deletedAdmin });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'admin :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'admin" });
  }
});

module.exports = router;
