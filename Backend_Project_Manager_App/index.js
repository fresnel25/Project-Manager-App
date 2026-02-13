const express = require("express");
const colonneRouter = require("./routes/colonne.route");
const carteRouter = require("./routes/carte.route");
const categorieRouter = require("./routes/categorie.route");
const swagger = require("./swagger");
const userRouter = require("./routes/user.route");
const projectRouter = require("./routes/project.route");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/colonne", colonneRouter);
app.use("/api/carte", carteRouter);
app.use("/api/categorie", categorieRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/docs", swagger.serve, swagger.setup); //

app.get("/", (req, res) => {
  res.send("API is running!");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
