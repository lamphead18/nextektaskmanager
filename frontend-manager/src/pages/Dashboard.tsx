import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";
import Pagination from "../components/Pagination";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
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
    if (searchQuery.trim()) params.append("search", searchQuery.trim());

    if (params.toString()) url += `&${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const delaySearch = setTimeout(() => {
      fetchTasks(page);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [page, statusFilter, searchQuery]);

  const handleDelete = async (taskId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks(page);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suas Tarefas</h1>
        <button className="btn btn-error" onClick={() => navigate("/login")}>
          Sair
        </button>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchTasks={fetchTasks}
      />

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <TaskList tasks={tasks} onDelete={handleDelete} />
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/create-task")}
        >
          Criar Nova Tarefa
        </button>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}
