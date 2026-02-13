const prisma = require("../db/dbconfig");

// Créer un projet
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.userId; 

    if (!userId)
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    if (!title)
      return res.status(400).json({ message: "Le titre est obligatoire" });

    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdById: userId,
      },
    });

    res.status(201).json({ message: "Projet créé", data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        votes: true,
        comments: { include: { user: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = projects.map((p) => ({
      ...p,
      votesCount: p.votes.length,
    }));

    res.json({ message: "Liste des projets", data: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getOneProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        createdBy: { select: { id: true, name: true } },
        votes: true,
        comments: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    if (!project)
      return res.status(404).json({ message: "Projet introuvable" });

    res.json({ data: { ...project, votesCount: project.votes.length,currentUserId: req.user.userId  } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const voteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user.userId; 

    const existingVote = await prisma.vote.findFirst({
      where: { projectId, userId },
    });
    if (existingVote) return res.status(400).json({ message: "Déjà voté" });

    await prisma.vote.create({ data: { projectId, userId } });
    res.json({ message: "Vote ajouté" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const commentProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user.userId;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Commentaire vide" });

    const comment = await prisma.comment.create({
      data: { text, projectId, userId },
    });

    res.status(201).json({ message: "Commentaire ajouté", data: comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user.userId;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project)
      return res.status(404).json({ message: "Projet introuvable" });
    if (project.createdById !== userId)
      return res.status(403).json({ message: "Accès refusé" });

    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getOneProject,
  voteProject,
  commentProject,
  deleteProject,
};
