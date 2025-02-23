interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchTasks: (pageNumber: number) => void;
}

export default function TaskFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  fetchTasks,
}: TaskFiltersProps) {
  return (
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
  );
}
