import { ReactNode } from "react";

interface TableProps {
  data: (string | number | ReactNode)[][];
}

export default function Table({ data }: TableProps) {
  return (
    <div className="w-full mx-auto my-8">
      <div className="overflow-hidden rounded-md shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
        {data.map((row, index) => {
          const isHeader = index === 0;
          const isLastRow = index === data.length - 1;

          return (
            <div
              key={index}
              className={`
                flex justify-between items-center
                ${isHeader ? "bg-gray-50" : "bg-background hover:bg-gray-100"}
                ${isHeader ? "font-medium" : "font-normal"}
                ${isHeader ? "text-gray-700" : "text-gray-600"}
                ${!isLastRow ? "border-b border-gray-100" : ""}
                px-6 py-4
              `}
            >
              {row.map((cell, cellIndex) => (
                <span
                  key={cellIndex}
                  className={`
                    flex flex-1 justify-center items-center
                    text-wrap text-sm
                    transition-colors duration-200
                    ${isHeader ? "font-medium" : ""}
                  `}
                >
                  {cell}
                  {cellIndex === 1 && typeof cell === "number" && (
                    <img
                      className="w-5 h-5 ml-2 transition-transform duration-200 hover:scale-105"
                      src="/public/points.png"
                      alt="points"
                    />
                  )}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
