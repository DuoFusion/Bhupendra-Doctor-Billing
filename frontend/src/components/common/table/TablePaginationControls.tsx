import type { Table } from "@tanstack/react-table";

type TablePaginationControlsProps<TData> = {
  table: Table<TData>;
};

const TablePaginationControls = <TData,>({ table }: TablePaginationControlsProps<TData>) => {
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="flex flex-col gap-3 border-t border-[#1f3557] px-6 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {totalRows === 0 ? 0 : table.getRowModel().rows.length} of {totalRows} records
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
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
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border border-[#2a466f] bg-[#0f2037] px-3 py-1 text-slate-100 transition enabled:hover:border-sky-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-md border border-[#2a466f] bg-[#0f2037] px-3 py-1 text-slate-100 transition enabled:hover:border-sky-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePaginationControls;
