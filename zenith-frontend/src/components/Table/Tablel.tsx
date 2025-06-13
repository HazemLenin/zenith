import { ReactNode } from "react";

interface TableProps {
  data: (string | number | ReactNode)[][];
}

export default function Table({ data }: TableProps) {
  if (!data || data.length === 0) return null;
  const header = data[0];
  const rows = data.slice(1);

  return (
    <div className="overflow-x-auto rounded-3xl shadow-lg bg-white/90 backdrop-blur-lg border border-blue-100 my-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50 sticky top-0 z-10">
          <tr>
            {header.map((cell, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-blue-50 transition">
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-6 py-4 text-sm text-gray-700 align-middle"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
