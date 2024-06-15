const express = require('express');
const Admin = require('../models/Admin'); 
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const verifyAdmin = require('../middleware/verifyAdmin')

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

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

    const comparaisonMDP = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);

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

router.post('/admin/logout', (req, res) => {
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


router.post('/admin/add-admin', verifyAdmin, async (req, res) => {
  const { nom, prenom, adresse_email, mot_de_passe } = req.body;

  try {
    
    const existingAdmin = await Admin.findOne({ adresse_email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Cette adresse email est deja utiliser' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10); 
    const newAdmin = new Admin({ nom, prenom, adresse_email, mot_de_passe: hashedPassword });
    await newAdmin.save();

    console.log("L'administrateur a bien été ajouter :", newAdmin);
    res.status(201).json({ message: "L'administrateur a bien été ajouter ", user: newAdmin });
  } catch (error) {
    console.error("Erreur lors de l'ajout de 'administrateur :", error);
    res.status(400).json({ message: "Erreur lors de l'ajout de l'administrateur", error });
  }
});

router.get('/admin/get-admin', verifyAdmin, (req, res) => {
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

router.get('/admin/get-admin/:id',verifyAdmin, (req, res) => {
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


router.put('/admin/update-admin/:id', verifyAdmin, async (req, res) => {
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
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      admin.mot_de_passe = hashedPassword;
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

router.delete('/admin/delete-admin/:id', verifyAdmin, async (req, res) => {
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

router.post('/admin/add-user', verifyAdmin, async (req, res) => {
  const { nom, prenom, adresse_email, mot_de_passe } = req.body;

  try {
    
    const existingUser = await User.findOne({ adresse_email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cette adresse email est deja utiliser' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10); 
    const newUser = new User({ nom, prenom, adresse_email, mot_de_passe: hashedPassword });
    await newUser.save();

    console.log("L'utilisateur a bien été ajouter :", newUser);
    res.status(201).json({ message: "L'utilisateur a bien été ajouter ", user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    res.status(400).json({ message: "Erreur lors de l'ajout de l'utilisateur", error });
  }
});


router.get('/admin/get-user', verifyAdmin, (req, res) => {
  console.log("Requête GET reçue sur /api/get-user");
  User.find()
    .then(users => {
      console.log("Utilisateurs trouvés :", users);
      res.status(200).json(users);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(400).json({ error });
    });
});

router.get('/admin/get-user/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  console.log("Requête GET reçue sur /api/get-user/" + id);
  User.findById(id)
    .then(user => {
      if (!user) {
        console.log("Utilisateur non trouvé");
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      console.log("Utilisateur trouvé :", user);
      res.status(200).json({ user });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      res.status(400).json({ error });
    });
});

router.put('/admin/update-user/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { adresse_email, mot_de_passe, nom, prenom } = req.body;
  console.log("Requête PUT reçue sur /api/update-user/" + id);

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let aucunChampUpdate = false;

    if (adresse_email !== undefined && adresse_email !== user.adresse_email) {
      user.adresse_email = adresse_email;
      aucunChampUpdate = true;
    }

    if (nom !== undefined && nom !== user.nom) {
      user.nom = nom;
      aucunChampUpdate = true;
    }

    if (prenom !== undefined && prenom !== user.prenom) {
      user.prenom = prenom;
      aucunChampUpdate = true;
    }

    if (mot_de_passe !== undefined) {
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      user.mot_de_passe = hashedPassword;
      aucunChampUpdate = true;
    }

    if (!aucunChampUpdate) {
      console.log("Aucun champ n'a été modifié");
      return res.status(400).json({ message: "Aucun champ n'a été modifié" });
    }

    await user.save();
    console.log("Utilisateur mis à jour avec succès :", user);
    return res.status(200).json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
});

router.delete('/admin/delete-user/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  console.log("Requête DELETE reçue sur /api/delete-user/" + id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log("Utilisateur supprimé avec succès :", deletedUser);
    res.status(201).json({ message: "Utilisateur supprimé avec succès", deletedUser });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
});

module.exports = router;
