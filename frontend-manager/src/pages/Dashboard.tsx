import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Suas Tarefas</h1>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul>
          {tasks.map((task: any) => (
            <li key={task.id} className="p-4 bg-gray-200 rounded mb-2">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <span className="text-sm text-gray-600">
                Status: {task.status}
              </span>
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
