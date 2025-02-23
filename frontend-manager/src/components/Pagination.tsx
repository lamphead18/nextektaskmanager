interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-6 gap-4">
      <button
        className="btn btn-secondary"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </button>
      <span className="font-semibold text-lg">
        Página {totalPages > 0 ? page : 0} de {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        disabled={page >= totalPages || totalPages === 0}
        onClick={() => setPage(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
