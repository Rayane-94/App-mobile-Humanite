const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
 // ['Bearer', 'my token']
  jwt.verify(token, process.env.TOKEN_KEY_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    Admin.findById(decoded.adminId)
      .then(admin => {
        if (!admin) {
          return res.status(403).json({ message: 'Accès refusé' });
        }
        req.admin = admin;
        next();
      })
      .catch(err => {
        return res.status(500).json({ message: 'Erreur du serveur' });
      });
  });
};

module.exports = verifyAdmin;