import { useState } from "react";
import { createProject } from "../Api/projectApi";

export default function CreateProjectModal({ onProjectCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProject({ title, description });
      setTitle("");
      setDescription("");
      document.getElementById("create_project_modal").close();
      onProjectCreated(); // refresh liste
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          document.getElementById("create_project_modal").showModal()
        }
      >
        ➕ Nouveau Projet
      </button>

      <dialog id="create_project_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Créer un projet</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="modal-action">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
              >
                Créer
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("create_project_modal").close()
                }
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
