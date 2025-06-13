import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TableProps {
  data: (string | number | ReactNode)[][];
  variant?: "default" | "primary" | "secondary";
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  sortable?: boolean;
  onSort?: (columnIndex: number) => void;
  sortColumn?: number;
  sortDirection?: "asc" | "desc";
  emptyState?: ReactNode;
  loading?: boolean;
}

export default function Table({
  data,
  variant = "default",
  striped = true,
  hoverable = true,
  className = "",
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  emptyState,
  loading = false,
}: TableProps) {
  if (!data || data.length === 0) {
    return emptyState ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-text-light"
      >
        {emptyState}
      </motion.div>
    ) : null;
  }

  const header = data[0];
  const rows = data.slice(1);

  const variantClasses = {
    default: {
      header: "bg-primary/5",
      hover: "hover:bg-primary/5",
      stripe: "bg-primary/2",
      loading: "bg-primary/5",
    },
    primary: {
      header: "bg-primary/10",
      hover: "hover:bg-primary/10",
      stripe: "bg-primary/5",
      loading: "bg-primary/10",
    },
    secondary: {
      header: "bg-secondary/5",
      hover: "hover:bg-secondary/5",
      stripe: "bg-secondary/2",
      loading: "bg-secondary/5",
    },
  };

  const handleSort = (columnIndex: number) => {
    if (sortable && onSort) {
      onSort(columnIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3,
      }}
      className={`overflow-x-auto rounded-2xl shadow-soft bg-white/90 backdrop-blur-lg border border-gray-200/50 my-8 ${className}`}
    >
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead
          className={`${variantClasses[variant].header} sticky top-0 z-10`}
        >
          <tr>
            {header.map((cell, idx) => (
              <motion.th
                key={idx}
                className={`px-6 py-4 text-left text-sm font-semibold text-text-dark uppercase tracking-wider ${
                  sortable ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => handleSort(idx)}
                whileHover={sortable ? { scale: 1.02 } : undefined}
                whileTap={sortable ? { scale: 0.98 } : undefined}
              >
                <div className="flex items-center gap-2">
                  {cell}
                  {sortable && sortColumn === idx && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-primary"
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </motion.span>
                  )}
                </div>
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/50">
          <AnimatePresence>
            {loading ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={variantClasses[variant].loading}
              >
                <td colSpan={header.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-text-light">Loading...</span>
                  </div>
                </td>
              </motion.tr>
            ) : (
              rows.map((row, rowIdx) => (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    delay: rowIdx * 0.05,
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`${
                    hoverable ? variantClasses[variant].hover : ""
                  } ${
                    striped && rowIdx % 2 === 1
                      ? variantClasses[variant].stripe
                      : ""
                  } transition-all duration-200`}
                  whileHover={hoverable ? { scale: 1.01, x: 4 } : undefined}
                >
                  {row.map((cell, cellIdx) => (
                    <motion.td
                      key={cellIdx}
                      className="px-6 py-4 text-sm text-text-dark align-middle"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cellIdx * 0.05 }}
                    >
                      {cell}
                    </motion.td>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}
