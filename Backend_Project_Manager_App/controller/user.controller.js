const prisma = require("../db/dbconfig.js");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const secret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, secret, { expiresIn: "24h" });

      const { password, ...userWithoutPassword } = user;

      return res.json({
        ...userWithoutPassword,
        token,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.password || !req.body.email) {
      return res
        .status(400)
        .json({ message: "Les champs obligatoires sont manquants." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    // Créer l'utilisateur
    const createUser = await prisma.user.create({
      data: {
        name: req.body.name,
        password: hash,
        email: req.body.email,
      },
    });

    const { password, ...userWithoutPassword } = createUser;
    res.status(201).json({
      message: "user created",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message || error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUser = await prisma.user.findMany({
      include: {
        project: true,
        votes: true,
        comments: true,
      },
    });
    res.status(200).json({
      message: "All users",
      data: allUser
        .map((u) => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        })
        .sort((a, b) => a.id - b.id),
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getOneUser = async (req, res) => {
  try {
    const singleUser = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        project: true,
        votes:true,
        comments:true,
      },
    });
    if (!singleUser) return;
    const { password, ...userWithoutPassword } = singleUser;
    res.status(200).json({
      message: "user",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { loginUser, createUser, getAllUsers, getOneUser, deleteUser };
