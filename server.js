const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("."));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "anketDB";

app.post("/kontrol", async (req, res) => {
  await client.connect();
  const db = client.db(dbName).collection("oylar");
  const veri = await db.findOne({ tc: req.body.tc });
  res.json({ varMi: veri ? true : false });
});

app.post("/oyver", async (req, res) => {
  await client.connect();
  const db = client.db(dbName).collection("oylar");
  await db.insertOne(req.body);
  res.json({ ok: true });
});

app.get("/sonuclar", async (req, res) => {
  await client.connect();
  const db = client.db(dbName).collection("oylar");
  const sonuc = await db.find().toArray();
  res.json(sonuc);
});

app.listen(3000, () => console.log("Sunucu çalışıyor..."));
