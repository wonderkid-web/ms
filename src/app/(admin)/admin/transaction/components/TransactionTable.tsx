
import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { DeclarationRow } from "./types";
import { RowDetail } from "./RowDetail";
import { DeclarationDetail } from "@/services/declarationServices";

interface TransactionTableProps {
  table: Table<DeclarationRow>;
  loading: boolean;
  detailCache: Record<number, { loading: boolean; items: DeclarationDetail[] | null; error?: string; }>;
  loadDetails: (id: number) => void;
}

export function TransactionTable({
  table,
  loading,
  detailCache,
  loadDetails,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border bg-white shadow-sm">
      <table className="min-w-[1600px] w-full border-collapse">
        <thead className="bg-emerald-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border-b p-3 text-left font-semibold text-emerald-800 whitespace-nowrap ${
                    // @ts-expect-error custom meta
                    header.column.columnDef.meta?.headerClassName ?? ""
                  }`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length}
                className="p-4 text-center"
              >
                Loading…
              </td>
            </tr>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-emerald-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`border-b p-3 align-top whitespace-nowrap ${
                        // @ts-expect-error custom meta
                        cell.column.columnDef.meta?.cellClassName ?? ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {row.getIsExpanded() && (
                  <tr>
                    <td
                      colSpan={table.getVisibleLeafColumns().length}
                      className="border-b bg-emerald-50/40"
                    >
                      <RowDetail
                        id={row.original.id}
                        cache={detailCache[row.original.id]}
                        load={loadDetails}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length}
                className="p-4 text-center text-muted-foreground"
              >
                Data tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
