require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a MariaDB");
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const { filename, path: filepath } = req.file;

  const sql = "INSERT INTO archivos (filename, filepath) VALUES (?, ?)";
  db.query(sql, [filename, filepath], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
    res.json({ message: "Archivo subido con éxito", file: { filename, filepath } });
  });
});

app.get("/files", (req, res) => {
  db.query("SELECT * FROM archivos ORDER BY uploadedAt DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
