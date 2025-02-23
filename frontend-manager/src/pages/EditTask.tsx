import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTask() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa.");
      }

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Tarefa</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleUpdateTask}>
          <input
            type="text"
            placeholder="Título"
            className="input input-bordered w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descrição"
            className="input input-bordered w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="select select-bordered w-full mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
          <button className="btn btn-primary w-full">Salvar Alterações</button>
        </form>
        <button
          className="btn btn-secondary w-full mt-2"
          onClick={() => navigate("/dashboard")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default EditTask;
