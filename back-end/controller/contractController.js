const express = require('express');
const multer = require('multer');
const Contract = require('../models/Contract');
const fs = require('fs');
const sharp = require('sharp');
require('dotenv').config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/test2', (req, res) => {
  console.log("Requête GET reçue sur /api/test2");
  res.status(200).send({ message: "ceci est un test du controlleur" });
});

router.get('/get-contract', (req, res) => {
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

router.get('/get-contract/:id', (req, res) => {
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
  const photoPath = req.file ? req.file.path : '';
  const imageUrl = req.body.imageUrl || uri;

  console.log("Données reçues pour l'envoi du contrat :", uri, date, imageUrl);

  try {
    const compressedImageBuffer = await sharp(photoPath)
      .resize({ width: 800 })
      .jpeg({ quality: 100 })
      .toBuffer();

    const base64Image = compressedImageBuffer.toString('base64');

    const contract = new Contract({
      uri: uri,
      photo: base64Image,
      imageUrl: imageUrl,
      date: date
    });

    await contract.save();
    console.log("Contrat sauvegardé :", contract);
    res.status(201).json({ message: 'Contrat enregistré' });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du contrat :", error);
    res.status(400).json({ error });
  } finally {
    if (photoPath) {
      setTimeout(() => {
        try {
          fs.unlinkSync(photoPath);
          console.log('Fichier supprimé avec succès');
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier :', error);
        }
      }, 1000);
    }
  }
});

router.delete('/delete-contract/:id', async (req, res) => {
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
