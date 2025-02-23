import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteTask from "../components/DeleteTask";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchTasks = async (pageNumber: number) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    let url = `http://localhost:3000/tasks?page=${pageNumber}&limit=5`;

    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (searchQuery) params.append("search", searchQuery);

    if (params.toString()) url += `&${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks(page);
  }, [page, statusFilter, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suas Tarefas</h1>
        <button className="btn btn-error" onClick={handleLogout}>
          Sair
        </button>
      </div>

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
        <button className="btn btn-primary" onClick={() => fetchTasks(1)}>
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="p-4 bg-gray-200 rounded mb-2">
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p className="text-sm text-gray-600">
                  Criado em: {formatDate(task.createdAt)}
                </p>
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
                  <DeleteTask
                    taskId={task.id}
                    onDeleteSuccess={() => fetchTasks(1)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-4 gap-4">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>
            <span className="font-semibold">
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </button>
          </div>
        </>
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
