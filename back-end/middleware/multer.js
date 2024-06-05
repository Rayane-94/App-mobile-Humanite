const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Assurez-vous que ce répertoire existe
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Utilisation d'un timestamp pour éviter les conflits de nom de fichier
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
