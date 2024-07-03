const express = require('express');
const Camion = require('../models/Camion');
const router = express.Router();
router.use(express.json());

let camionData = {
  depart: null,
  debut_chargement: null,
  fin_chargement: null,
  contract_id: null
};

router.get('/testCamion', (req, res) => {
  console.log("Requête GET reçue sur /api/testCamion");
  res.status(200).send({ message: "Ceci est un test du contrôleur camion" });
});

router.post('/depart', async (req, res) => {
  try {
    const { localisation, timestamp } = req.body;

    if (!localisation || !localisation.latitude || !localisation.longitude) {
      return res.status(400).json({ message: 'Les données de localisation pour le départ sont incomplètes ou incorrectes' });
    }

    // Vérifier que camionData.depart n'a pas déjà été enregistré
    if (camionData.depart) {
      return res.status(400).json({ message: 'Les données de départ ont déjà été enregistrées' });
    }

    camionData.depart = {
      localisation: {
        latitude: localisation.latitude,
        longitude: localisation.longitude
      },
      timestamp: timestamp
    };

    console.log('Données de départ enregistrées:', camionData.depart);

    res.status(200).json({ message: 'Données de départ enregistrées' });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête :', error);
    res.status(500).json({ message: 'Erreur lors du traitement de la requête' });
  }
});

router.post('/debut-chargement', async (req, res) => {
  try {
    const { localisation, timestamp } = req.body;

    if (!localisation || !localisation.latitude || !localisation.longitude) {
      return res.status(400).json({ message: 'Les données de localisation pour le début de chargement sont incomplètes ou incorrectes' });
    }

    // Vérifier que camionData.depart a été enregistré avant de poursuivre
    if (!camionData.depart) {
      return res.status(400).json({ message: 'Les données de départ doivent être enregistrées avant le début de chargement' });
    }

    // Vérifier que camionData.debut_chargement n'a pas déjà été enregistré
    if (camionData.debut_chargement) {
      return res.status(400).json({ message: 'Les données de début de chargement ont déjà été enregistrées' });
    }

    camionData.debut_chargement = {
      localisation: {
        latitude: localisation.latitude,
        longitude: localisation.longitude
      },
      timestamp: timestamp
    };

    console.log('Données de début de chargement enregistrées:', camionData.debut_chargement);

    res.status(200).json({ message: 'Données de début de chargement enregistrées' });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête :', error);
    res.status(500).json({ message: 'Erreur lors du traitement de la requête' });
  }
});

router.post('/fin-chargement', async (req, res) => {
  try {
    const { localisation, timestamp, contract_id } = req.body;

    if (!localisation || !localisation.latitude || !localisation.longitude) {
      return res.status(400).json({ message: 'Les données de localisation pour la fin de chargement sont incomplètes ou incorrectes' });
    }

    // Vérifier que camionData.depart et camionData.debut_chargement ont été enregistrés avant de poursuivre
    if (!camionData.depart || !camionData.debut_chargement) {
      return res.status(400).json({ message: 'Les données de départ et de début de chargement doivent être enregistrées avant la fin de chargement' });
    }

    // Vérifier que camionData.fin_chargement n'a pas déjà été enregistré
    if (camionData.fin_chargement) {
      return res.status(400).json({ message: 'Les données de fin de chargement ont déjà été enregistrées' });
    }

    camionData.fin_chargement = {
      localisation: {
        latitude: localisation.latitude,
        longitude: localisation.longitude
      },
      timestamp: timestamp
    };

    camionData.contract_id = contract_id;

    console.log('Données de fin de chargement enregistrées:', camionData.fin_chargement);
    console.log('Contract ID:', camionData.contract_id);

    const camion = new Camion({
      depart: camionData.depart,
      debut_chargement: camionData.debut_chargement,
      fin_chargement: camionData.fin_chargement,
      contract_id: camionData.contract_id
    });

    await camion.save();
    console.log('Données enregistrées en base de données.');

    // Réinitialisation de camionData après l'enregistrement en base de données
    camionData = {
      depart: null,
      debut_chargement: null,
      fin_chargement: null,
      contract_id: null
    };

    console.log('camionData réinitialisé:', camionData);

    res.status(200).json({ message: 'Données de fin de chargement enregistrées et fusionnées' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du camion :', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du camion' });
  }
});

module.exports = router;
