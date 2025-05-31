const express = require('express');
const mongoose = require('mongoose');
const Vote = require('./models/Vote');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/vote', async (req, res) => {
  const { code, tshirtColor, tshirtModel, pantColor } = req.body;
  const existing = await Vote.findOne({ code });
  if (existing) return res.status(400).json({ error: "Kod kullanılmış." });

  const vote = new Vote({ code, tshirtColor, tshirtModel, pantColor });
  await vote.save();
  res.json({ success: true });
});

app.get('/results', async (req, res) => {
  const votes = await Vote.find();
  res.json(votes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));

