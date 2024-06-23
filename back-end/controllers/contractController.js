const express = require('express');

const Contract = require('../models/Contract');

require('dotenv').config();

const cloudinary = require("../utils/cloudinary");

const upload = require("../middleware/multer");
const verifyAdmin = require('../middleware/verifyAdmin')

const router = express.Router();


router.get('/test2', (req, res) => {
  console.log("Requête GET reçue sur /api/test2");
  res.status(200).send({ message: "ceci est un test du controlleur" });
});

router.get('/admin/get-contract', verifyAdmin, (req, res) => {
  console.log("Requête GET reçue sur /api/get-contract");
  Contract.find()
    .then(contracts => {
      console.log("Contrats trouvés :", contracts);
      res.status(200).json(contracts);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des contrats :", error);
      res.status(400).json({ error });
    });
});

router.get('/admin/get-contract/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  console.log("Requête GET reçue sur /api/get-contract/" + id);
  Contract.findById(id)
    .then(contract => {
      if (!contract) {
        console.log("Contrat non trouvé");
        return res.status(404).json({ message: "Contrat non trouvé" });
      }
      console.log("Contrat trouvé :", contract);
      res.status(200).json({ contract });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération du contrat :", error);
      res.status(400).json({ error });
    });
});

router.post('/send-contract', upload.single('photo'), async (req, res) => {
  const { uri, date } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image téléchargée" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const contract = new Contract({
      uri: uri,
      imageUrl: result.secure_url, 
      date: date
    });

    await contract.save();
    console.log("Contrat sauvegardé :", contract);
    res.status(201).json({ message: 'Contrat enregistré', contract });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du contrat :", error);
    res.status(400).json({ message: "Erreur lors de l'enregistrement du contrat", error });
  }
});

router.delete('/admin/delete-contract/:id',verifyAdmin, async (req, res) => {
  const { id } = req.params;
  console.log("Requête DELETE reçue sur /api/delete-contract/" + id);
  try {
    const deletedContract = await Contract.findByIdAndDelete(id);
    if (!deletedContract) {
      console.log("Contrat non trouvé");
      return res.status(404).json({ message: "Contrat non trouvé" });
    }
    console.log("Contrat supprimé avec succès :", deletedContract);
    res.status(201).json({ message: "Contrat supprimé avec succès", deletedContract });
  } catch (error) {
    console.error("Erreur lors de la suppression du contrat :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du contrat" });
  }
});

module.exports = router;
