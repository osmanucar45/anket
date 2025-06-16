const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:<ANKET_ŞİFREN>@cluster0.jex5juo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Şifreyi yerleştir
const client = new MongoClient(uri);

app.post('/api/kod-kontrol', async (req, res) => {
  const { code } = req.body;
  try {
    await client.connect();
    const db = client.db("anketDB");
    const codes = db.collection("codes");
    const valid = await codes.findOne({ code: code, used: false });
    if (valid) {
      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.post('/api/oyla', async (req, res) => {
  const { code, tshirt, pants } = req.body;
  try {
    await client.connect();
    const db = client.db("anketDB");
    const codes = db.collection("codes");
    const oylar = db.collection("oylar");

    const isValid = await codes.findOne({ code: code, used: false });
    if (!isValid) {
      return res.status(400).json({ message: "Kod geçersiz veya kullanılmış." });
    }

    await oylar.insertOne({ code, tshirt, pants, date: new Date() });
    await codes.updateOne({ code }, { $set: { used: true } });

    res.status(200).json({ message: "Oy başarıyla kaydedildi" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.get('/api/sonuclar', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("anketDB");
    const oylar = db.collection("oylar");
    const veriler = await oylar.find().toArray();
    res.status(200).json(veriler);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Sonuçlar alınamadı" });
  }
});

app.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor");
});
