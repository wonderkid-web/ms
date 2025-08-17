
import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { DeclarationRow } from "./types";

interface PaginationProps {
  table: Table<DeclarationRow>;
  pageSize: number;
  setPageSize: (value: number) => void;
}

export function Pagination({
  table,
  pageSize,
  setPageSize,
}: PaginationProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
        >
          Prev
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </span>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
        >
          Next
        </Button>
        <div className="ml-3 flex items-center gap-2">
          <label className="text-sm">Rows</label>
          <select
            className="rounded border px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
