"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employeeServices";
import toast from "react-hot-toast";

type User = {
  id: number;
  fullName: string;
  email: string;
  whatsapp: string;
  corporate: string;
  isActive: boolean;
};

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<User, "id">>({
    fullName: "",
    email: "",
    whatsapp: "",
    corporate: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadData() {
    const users = await getEmployees();
    setData(users);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveEmployee() {
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        toast.success("Data karyawan berhasil diperbarui!");
      } else {
        await createEmployee(form);
        toast.success("Data karyawan berhasil ditambahkan!");
      }
      loadData();
      setShowModal(false);
      setEditingId(null);
      setForm({
        fullName: "",
        email: "",
        whatsapp: "",
        corporate: "",
        isActive: true,
      });
    } catch (err) {
      toast.error("Gagal menyimpan data karyawan");
    }
  }

  async function removeUser(id: number) {
    await deleteEmployee(id);
    loadData();
  }

  const columns: ColumnDef<User>[] = [
    { accessorKey: "id", header: "No" },
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "whatsapp",
      header: "WhatsApp",
      cell: ({ getValue }) => {
        const phone = getValue<string>();
        const msg = encodeURIComponent("Halo, saya ingin menghubungi Anda.");
        return (
          <a
            href={`https://wa.me/${phone}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            {phone}
          </a>
        );
      },
    },
    { accessorKey: "corporate", header: "Corporate" },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ getValue }) => {
        const isActive = getValue<boolean>();
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingId(row.original.id);
              setForm({
                fullName: row.original.fullName,
                email: row.original.email,
                whatsapp: row.original.whatsapp,
                corporate: row.original.corporate,
                isActive: row.original.isActive,
              });
              setShowModal(true);
            }}
            className="border border-emerald-500 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-50"
          >
            Edit
          </button>
          <button
            onClick={() => removeUser(row.original.id)}
            className="border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Manage Employees</h1>
      <div className="mb-3 flex justify-between">
        <input
          placeholder="Search employees..."
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              fullName: "",
              email: "",
              whatsapp: "",
              corporate: "",
              isActive: true,
            });
            setShowModal(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Add New Employee
        </button>
      </div>

      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-emerald-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b p-3 text-left text-emerald-700 font-semibold"
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
              {editingId ? "Edit User" : "Add User"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="border rounded p-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="WhatsApp Number (628xxx)"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Corporate"
                value={form.corporate}
                onChange={(e) =>
                  setForm({ ...form, corporate: e.target.value })
                }
                className="border rounded p-2 w-full"
              />
              <select
                value={form.isActive ? "yes" : "no"}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.value === "yes" })
                }
                className="border rounded p-2 w-full"
              >
                <option value="yes">Active</option>
                <option value="no">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEmployee}
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
