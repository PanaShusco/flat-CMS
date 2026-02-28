const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;
const ARCHIVO_NOTICIAS = "./noticias.json";

app.use(cors());
app.use(express.json());

const leerNoticias = () => {
  try {
    const data = fs.readFileSync(ARCHIVO_NOTICIAS, "utf-8");
    let noticias = JSON.parse(data);

    const ahora = Date.now();
    const noticiasValidas = noticias.filter((n) => n.fechaExpiracion > ahora);

    if (noticiasValidas.length !== noticias.length) {
      guardarNoticias(noticiasValidas);
    }

    return noticiasValidas;
  } catch (error) {
    return [];
  }
};

const guardarNoticias = (noticias) => {
  fs.writeFileSync(ARCHIVO_NOTICIAS, JSON.stringify(noticias, null, 2));
};

app.get("/noticias", (req, res) => {
  const noticias = leerNoticias();
  res.json(noticias);
});

app.post("/noticias", (req, res) => {
  const nuevaNoticia = req.body;
  const TIEMPO_DE_VIDA_MS = 60 * 1000;

  nuevaNoticia.fechaExpiracion = Date.now() + TIEMPO_DE_VIDA_MS;

  const noticias = leerNoticias();
  noticias.unshift(nuevaNoticia);
  guardarNoticias(noticias);

  res.status(201).json({ mensaje: "Noticia temporal guardada" });
});

app.delete("/noticias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let noticias = leerNoticias();
  noticias = noticias.filter((n) => n.id !== id);
  guardarNoticias(noticias);
  res.json({ mensaje: "Noticia eliminada manualmente" });
});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
  console.log(`Las noticias se auto-eliminarán después de 1 minuto.`);
});
