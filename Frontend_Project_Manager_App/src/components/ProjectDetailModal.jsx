// src/components/ProjectDetailModal.jsx
import { useEffect, useState } from "react";
import { getProjectById, voteProject } from "../Api/projectApi";

export default function ProjectDetailModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await getProjectById(projectId);
        const p = res.data.data;
        const hasVoted = p.votes.some((v) => v.userId === p.currentUserId);
        setProject({ ...p, hasVoted });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleVote = async () => {
    if (!projectId) return;
    setVoting(true);
    try {
      await voteProject(projectId);
      // après vote, on met à jour le compteur local
      setProject((prev) => ({ ...prev, votesCount: prev.votesCount + 1 }));
    } catch (err) {
      console.error("Erreur vote:", err);
    } finally {
      setVoting(false);
    }
  };

  if (!projectId) return null;

  return (
    <dialog id="project_detail_modal" open className="modal">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-xl mb-2">{project?.title}</h3>
        <p className="mb-4">{project?.description}</p>

        <p className="text-sm mb-1">Créé par : {project?.createdBy?.name}</p>
        <p className="text-sm mb-4">Votes : {project?.votesCount}</p>

        <div className="flex justify-between mt-4">
          <button
            className={`btn btn-sm ${project?.hasVoted ? "btn-disabled" : "btn-success"} ${voting ? "loading" : ""}`}
            onClick={handleVote}
            disabled={project?.hasVoted || voting}
          >
            Voter
          </button>

          <button className="btn btn-ghost" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </dialog>
  );
}
