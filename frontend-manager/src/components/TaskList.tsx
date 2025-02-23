import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  }[];
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>Nenhuma tarefa encontrada.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} />
      ))}
    </ul>
  );
}
