import { useNavigate } from "react-router-dom";

interface DeleteTaskProps {
  taskId: string;
  onDeleteSuccess: () => void;
}

function DeleteTask({ taskId, onDeleteSuccess }: DeleteTaskProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    console.log(`🗑️ Tentando excluir a tarefa com ID: ${taskId}`);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro ao excluir a tarefa:", errorData);
        return;
      }

      console.log("✅ Tarefa excluída com sucesso!");

      onDeleteSuccess();
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Erro inesperado ao excluir a tarefa:", error);
    }
  };

  return (
    <button className="btn btn-error btn-sm" onClick={handleDelete}>
      Excluir
    </button>
  );
}

export default DeleteTask;
