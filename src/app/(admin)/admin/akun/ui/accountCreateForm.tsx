// src/app/(admin)/admin/account/ui/accountCreateForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AccountCreateForm({
  action,
  closeModal,
}: {
  action: (formData: FormData) => Promise<{ ok: boolean; message: string }>;
  closeModal: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [status, setStatus] = useState("ACTIVE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullName", fullName);
    formData.append("company", company);
    formData.append("position", position);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("status", status);

    const result = await action(formData);
    setMessage(result.message);
    if (result.ok) {
      closeModal(); // Close modal on success
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="text-sm text-red-600">{message}</div>}

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Company</label>
        <input
          type="text"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Name (Full Name) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Position</label>
        <input
          type="text"
          required
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Nomor HP */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Nomor HP</label>
        <input
          type="tel"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Alamat</label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="ADMIN">Administrator</option>
          <option value="VIEWER">User</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="ACTIVE">Active</option>
          <option value="INVITED">Invited</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" onClick={closeModal} className="bg-transparent border-black border-[1px] text-gray-700">
          Batal
        </Button>
        <Button type="submit" className="bg-emerald-500 text-white">
          Simpan
        </Button>
      </div>
    </form>

  );
}
