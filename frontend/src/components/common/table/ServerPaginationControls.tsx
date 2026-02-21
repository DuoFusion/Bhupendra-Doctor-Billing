type ServerPaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentCount: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const ServerPaginationControls = ({
  page,
  limit,
  total,
  totalPages,
  currentCount,
  onPageChange,
  onLimitChange,
}: ServerPaginationControlsProps) => {
  return (
    <div className="flex flex-col gap-3 border-t border-[#1f3557] px-6 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {total === 0 ? 0 : currentCount} of {total} records
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-[#2a466f] bg-[#0f2037] px-2 py-1 text-slate-100"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-md border border-[#2a466f] bg-[#0f2037] px-3 py-1 text-slate-100 transition enabled:hover:border-sky-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages || 1, page + 1))}
          disabled={page >= totalPages}
          className="rounded-md border border-[#2a466f] bg-[#0f2037] px-3 py-1 text-slate-100 transition enabled:hover:border-sky-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServerPaginationControls;
