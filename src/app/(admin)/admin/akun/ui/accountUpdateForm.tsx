// src/app/(admin)/admin/account/ui/accountUpdateForm.tsx
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
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { Account } from "@prisma/client";

export default function AccountUpdateForm({
  action,
  closeModal,
  account,
}: {
  action: (formData: FormData) => Promise<{ ok: boolean; message: string }>;
  closeModal: () => void;
  account: Account;
}) {
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState(account.password);
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState(account.fullName);
  const [company, setCompany] = useState(account.company);
  const [position, setPosition] = useState(account.position);
  const [phoneNumber, setPhoneNumber] = useState(account.phoneNumber);
  const [address, setAddress] = useState(account.address);
  const [role, setRole] = useState(account.role);
  const [status, setStatus] = useState(account.status);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // regex: harus mulai 08, total 10-13 digit (maks 13)
  const phoneRegex = /^08\d{8,11}$/;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (password && password.length < 7) {
      setMessage("Password must be at least 7 characters.");
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      setMessage("Phone number must start with '08' and be a maximum of 13 digits (numbers only).");
      return;
    }

    const formData = new FormData();
    formData.append("email", email.trim().toLowerCase());
    if (password) {
      formData.append("password", password);
    }
    formData.append("fullName", fullName);
    formData.append("company", company);
    formData.append("position", position);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("status", status);

    try {
      setLoading(true)
      const result = await action(formData);

      setMessage(result.message);
      showSuccessToast("Account updated successfully.");

      setLoading(false)
      router.refresh()
      if (result.ok) {
        closeModal();
      }
    } catch (error) {
      showErrorToast("Could not connect to the server. Try again.")
    }
  };

  // Hanya angka, potong ke 13 digit
  const handlePhoneChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(digits);
  };

  type RoleType = "VIEWER" | "ADMIN"
  type StatusType = "INVITED" | "ACTIVE" | "SUSPENDED"

  return (
    <div className="max-h-[75vh] overflow-y-auto pr-1">
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

        {/* Full Name */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
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

        {/* Phone Number */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Phone Number</label>
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
              title="Must start with 08, total 10-13 digits."
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Must start with 08, maximum 13 digits.</p>
        </div>

        {/* Address */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Address</label>
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
              minLength={7}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-10 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              placeholder="Leave blank to keep current password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label={showPwd ? "Hide password" : "Show password"}
              title={showPwd ? "Hide" : "Show"}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password. Minimal 7 characters.</p>
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
                onChange={(e) => setRole(e.target.value as RoleType)}
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
                onChange={(e) => setStatus(e.target.value as StatusType)}
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
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className={`${loading ? "bg-emerald-400" : "bg-emerald-500"} text-white hover:bg-emerald-600`}>
            {loading && <div className="h-5 w-5 border-3 border-t-transparent border-b-transparent border-emerald-300 rounded-full animate-spin" />}
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
