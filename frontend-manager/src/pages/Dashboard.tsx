import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    let url = "http://localhost:3000/tasks";

    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (searchQuery) params.append("search", searchQuery);

    if (params.toString()) url += `?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, searchQuery]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Suas Tarefas</h1>

      <div className="flex gap-4 mb-4">
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por título"
          className="input input-bordered"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchTasks}>
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-gray-200 rounded mb-2">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <span className="text-sm text-gray-600">
                Status: {task.status}
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/edit-task/${task.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() =>
                    setTasks((prev) => prev.filter((t) => t.id !== task.id))
                  }
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/create-task")}
      >
        Criar Nova Tarefa
      </button>
    </div>
  );
}
export default Dashboard;
