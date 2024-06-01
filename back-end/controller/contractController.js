const express = require('express');
const multer = require('multer');
const Contract = require('../models/Contract');
const app = express();

app.get('/api/test2', (req, res) => {
  console.log("Requête GET reçue sur /api/test");
  const test = { message: "ceci est un test du controlleur" };
  res.status(200).json(test);
});

// Middleware de configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Répertoire où les fichiers téléchargés seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilisez le nom de fichier d'origine pour stocker le fichier
  }
});
const upload = multer({ storage: storage }); // Initialiser multer avec la configuration de stockage



// Route pour récupérer tous les contrats
app.get('/api/get-contract', (req, res) => {
  Contract.find()
    .then(contracts => res.status(200).json(contracts))
    .catch(error => res.status(400).json({ error }));
});

// Route pour envoyer un contrat
app.post('/api/send-contract',  async (req, res) => {
  //await upload.single('photo');

  const uri = req.body.uri;
  const imageUrl = req.file.path;
  const date = req.body.date;

  const contract = new Contract({
      uri: uri,
      imageUrl: imageUrl,
      date: date,
  });

  try {
      await contract.save();
      console.log("Contrat sauvegardé" + '\n' + date + '\n' + imageUrl);
      res.status(201).json({ message: 'Contrat enregistré' });
  } catch (error) {
      console.error("Erreur lors de l'enregistrement du contrat:", error);
      res.status(400).json({ error });
  }
});

// Route pour supprimer un contrat
app.delete('/api/delete-contract/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContract = await Contract.findByIdAndDelete(id);
    if (!deletedContract) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }
    res.status(201).json({ message: "Contrat supprimé avec succès", deletedContract });
  } catch (error) {
    console.error("Erreur lors de la suppression du contrat", error);
    res.status(500).json({ message: "Erreur lors de la suppression du contrat" });
  }
});

module.exports = app;