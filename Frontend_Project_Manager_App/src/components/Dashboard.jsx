// src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { allProjects } from "../Api/projectApi";
import CreateProjectModal from "../components/CreateProjectModal";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await allProjects();
      setProjects(res.data.data);
    } catch (err) {
      console.error("Erreur récupération projets", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Project Manager</h1>
        </div>

        <div className="flex gap-6">
          <div className="">
            <span className="w-8 h-8 rounded-full bg-accent flex text-base items-center justify-center font-bold">
              {user?.name[0]}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="btn btn-error btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-end mb-4">
          <CreateProjectModal onProjectCreated={fetchProjects} />
        </div>

        <h2 className="text-2xl font-bold mb-6">Liste des projets</h2>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="alert">
            <span>Aucun projet disponible.</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
              >
                <div className="card-body">
                  <h2 className="card-title">{project.title}</h2>
                  <p className="text-sm opacity-80">{project.description}</p>

                  <div className="mt-4 text-sm">
                    <p>Votes : {project.votesCount}</p>
                    <p>Créé par : {project.createdBy?.name}</p>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          projectId={selectedProject}
          onVote={fetchProjects}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
