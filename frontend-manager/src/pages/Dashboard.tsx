import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

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
        <h1 className="text-2xl font-bold mb-4">Suas Tarefas</h1>
        <button className="btn btn-error" onClick={handleLogout}>
          Sair
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
