import { useNavigate } from "react-router-dom";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <li className="p-4 bg-gray-200 rounded mb-2">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-600">
        Criado em: {formatDate(task.createdAt)}
      </p>
      <span className="text-sm text-gray-600">Status: {task.status}</span>
      <div className="flex gap-2 mt-2">
        <button
          className="btn btn-info btn-sm"
          onClick={() => navigate(`/edit-task/${task.id}`)}
        >
          Editar
        </button>
        <button
          className="btn btn-error btn-sm"
          onClick={() => onDelete(task.id)}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
