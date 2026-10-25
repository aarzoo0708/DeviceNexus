
function DataTable({
  columns = [],
  data = [],
  minWidth = "min-w-[850px]",
  emptyMessage = "No records found",
}) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-10 text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 max-w-full w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-sm">
      <table className={`w-full border-collapse text-sm text-left text-slate-800 dark:text-slate-200 ${minWidth}`}>
        <thead className="bg-slate-50/80 dark:bg-[#111827]/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#334155] text-xs font-semibold uppercase tracking-wider">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-5 sm:px-6 py-4 whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
          {data.map((row, index) => (
            <tr
              key={typeof row.id === "string" || typeof row.id === "number" ? row.id : index}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-5 sm:px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-200">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
