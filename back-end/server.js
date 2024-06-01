const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoURI = "mongodb+srv://rayane:rayane@cluster0.tneegxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your details

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/api/test', (req, res) => {
  res.send('Hello World from Express & Mongoose!')
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));