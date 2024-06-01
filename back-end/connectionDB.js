const express = require('express');
const mongoose = require('mongoose');
const app = express();


const uri = "mongodb+srv://rayane:rayane@cluster0.tneegxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connexion à la base de données MongoDB
const ConnectDB = async () => {

    try {
        await mongoose.connect(uri);
        console.log("Connexion à MongoDB réussie ");
        }
    catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
      }

};


module.exports = ConnectDB;