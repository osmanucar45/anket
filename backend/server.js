const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:anket123@cluster0.jex5juo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let codesCollection;
let oylarCollection;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db("anketDB");
    codesCollection = db.collection("codes");
    oylarCollection = db.collection("oylar");
    console.log("MongoDB bağlantısı başarılı.");
  } catch (err) {
    console.error("Veritabanı bağlantı hatası:", err);
  }
}

app.post("/vote", async (req, res) => {
  const { code, tshirtColor, tshirtModel, pantColor } = req.body;

  if (!code || !tshirtColor || !tshirtModel || !pantColor) {
    return res.status(400).json({ error: "Eksik bilgi" });
  }

  try {
    const kod = await codesCollection.findOne({ code });
    if (!kod) {
      return res.status(404).json({ error: "Kod bulunamadı" });
    }
    if (kod.used) {
      return res.status(403).json({ error: "Kod zaten kullanıldı" });
    }

    await oylarCollection.insertOne({ code, tshirtColor, tshirtModel, pantColor });
    await codesCollection.updateOne({ code }, { $set: { used: true } });

    res.status(200).json({ message: "Oy kaydedildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.get("/results", async (req, res) => {
  try {
    const results = await oylarCollection.find().toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Sonuç alınamadı" });
  }
});

connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
  });
});
