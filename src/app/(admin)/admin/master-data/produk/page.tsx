"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getProductGroups, createProductGroup, updateProductGroup, deleteProductGroup } from "@/services/productGroupService";

type ProductGroup = {
  id: number;
  name: string;
};

export default function ProductGroupsPage() {
  const [data, setData] = useState<ProductGroup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadData() {
    const res = await getProductGroups();
    setData(res);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveData() {
    try {
      if (editingId) {
        await updateProductGroup(editingId, form);
        toast.success("Product Group berhasil diperbarui!");
      } else {
        await createProductGroup(form);
        toast.success("Product Group berhasil ditambahkan!");
      }
      loadData();
      setShowModal(false);
      setEditingId(null);
      setForm({ name: "" });
    } catch {
      toast.error("Gagal menyimpan data Product Group");
    }
  }

  async function removeData(id: number) {
    try {
      await deleteProductGroup(id);
      toast.success("Product Group berhasil dihapus!");
      loadData();
    } catch {
      toast.error("Gagal menghapus Product Group");
    }
  }

  const columns: ColumnDef<ProductGroup>[] = [
    { accessorKey: "id", header: "No" },
    { accessorKey: "name", header: "Name" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingId(row.original.id);
              setForm({ name: row.original.name });
              setShowModal(true);
            }}
            className="border border-emerald-500 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-50"
          >
            Edit
          </button>
          <button
            onClick={() => removeData(row.original.id)}
            className="border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Manage Product Groups</h1>
      <div className="mb-3 flex justify-between">
        <input
          placeholder="Search..."
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ name: "" });
            setShowModal(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Add New
        </button>
      </div>

      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-emerald-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border-b p-3 text-left text-emerald-700 font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">
              {editingId ? "Edit Product Group" : "Add Product Group"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveData}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
