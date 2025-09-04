// src/app/(admin)/admin/account/ui/accountCreateForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  User,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountCreateForm({
  action,
  closeModal,
}: {
  action: (formData: FormData) => Promise<{ ok: boolean; message: string }>;
  closeModal: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [status, setStatus] = useState("ACTIVE");
  const [message, setMessage] = useState("");
  const router = useRouter()

  // regex: harus mulai 08, total 10-13 digit (maks 13)
  const phoneRegex = /^08\d{8,11}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (password.length < 7) {
      setMessage("Password minimal 7 karakter.");
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      setMessage("Nomor HP harus diawali '08' dan maksimal 13 digit (hanya angka).");
      return;
    }

    const formData = new FormData();
    formData.append("email", email.trim().toLowerCase());
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
    router.refresh()
    if (result.ok) {
      closeModal();
    }
  };

  // Hanya angka, potong ke 13 digit
  const handlePhoneChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(digits);
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">
            {message}
          </div>
        )}

        {/* Company */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Company</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Building2 size={18} />
            </span>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="PT Sawit Teknologia"
            />
          </div>
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Nama Lengkap</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Salsa Fadilla Syam"
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Position</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Briefcase size={18} />
            </span>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              autoComplete="organization-title"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Estate Manager"
            />
          </div>
        </div>

        {/* Nomor HP */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Nomor HP</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={18} />
            </span>
            <input
              type="tel"
              required
              inputMode="numeric"
              pattern="^08\d{8,11}$"
              maxLength={13}
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              title="Harus diawali 08, total 10–13 digit."
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Wajib diawali 08, maksimal 13 digit.</p>
        </div>

        {/* Alamat */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Alamat</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
              <MapPin size={18} />
            </span>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Jl. Kebun No. 10, Riau"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="user@contoh.com"
            />
          </div>
        </div>

        {/* Password + toggle eye */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              required
              minLength={7}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-10 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Min. 7 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
              title={showPwd ? "Sembunyikan" : "Tampilkan"}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimal 7 karakter.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Role</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Shield size={18} />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ADMIN">Administrator</option>
                <option value="MANAGER">Manager</option>
                <option value="STAFF">Staff</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <BadgeCheck size={18} />
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ACTIVE">Active</option>
                <option value="INVITED">Invited</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            onClick={closeModal}
            className="border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button type="submit" className="bg-emerald-500 text-white hover:bg-emerald-600">
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
