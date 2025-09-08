'use client'

import { useState, useMemo } from "react";
import { Account } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toWaLink } from "@/helper";
import Link from "next/link";
import { LockKeyholeIcon, Trash, UnlockKeyholeIcon, User, User2, UserSquare, FilePen } from "lucide-react";
import AccountCreateFormDialog from "./accountCreateFormWrapper";
import { deleteAccount, suspendAccount } from "@/services/accountServices";
import toast from "react-hot-toast";
import { ConfirmDeleteToast } from "@/components/toast";
import { UserProfile } from "@clerk/nextjs";
import AccountUpdateFormDialog from "./accountUpdateFormWrapper";

interface AccountTableWrapperProps {
    initialRows: Account[];
}

export default function AccountTableWrapper({ initialRows }: AccountTableWrapperProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const filteredRows = useMemo(() => {
        return initialRows.filter((row) =>
            row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialRows, searchTerm]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredRows.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredRows, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const handleDelete = (id: number) => {
        toast.custom((t) => (
            <ConfirmDeleteToast
                t={t}
                onConfirm={() => deleteAccount(id, { alsoDeleteClerk: true })}
            />
        ), { duration: Infinity });
    };

    const handleSuspend = async (id: number) => {
        await suspendAccount(id);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-emerald-900 flex gap-2 text-2xl">
                    <UserSquare className="h-8 w-8" /> Table Account
                </h2>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search Account..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm min-w-12"
                    />
                    <AccountCreateFormDialog />
                </div>
            </div>
            <div className="overflow-x-auto rounded-md border">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-emerald-50">
                        <tr className="text-emerald-900">
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">No.</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Company</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Name</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Position</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Phone</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Email</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Address</th>
                            <th className="border-b p-2 text-center font-semibold whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows?.length ? (
                            paginatedRows.map((r, i) => (
                                <tr key={r.id} className="hover:bg-emerald-50/40 align-middle">
                                    <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{i + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.company}</td>
                                    <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.fullName}</td>
                                    <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.position}</td>
                                    <td className="border-b p-2 whitespace-nowrap">
                                        <Link
                                            href={toWaLink(r.phoneNumber, `Halo ${r.fullName}, saya dari ${r.company}.`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline decoration-dotted underline-offset-4"
                                            title="Chat via WhatsApp"
                                        >
                                            {r.phoneNumber}
                                        </Link>
                                    </td>
                                    <td className="border-b p-2 whitespace-nowrap max-w-[240px] truncate flex relative top-3 gap-2 items-center">{r.email}</td>

                                    <td className="border-b p-2 whitespace-nowrap max-w-[260px] truncate" >{r.address}</td>
                                    <td className="border-b p-2">
                                        <div className="flex flex-nowrap items-center gap-1 transition">
                                            <AccountUpdateFormDialog account={r} />
                                            {r.status !== 'ACTIVE' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-emerald-500 px-2 text-emerald-700 hover:bg-emerald-50"
                                                >
                                                    <LockKeyholeIcon />
                                                </Button>
                                            )}
                                            {r.status === 'ACTIVE' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-amber-500 px-2 text-amber-700 hover:bg-amber-50"
                                                    onClick={() => handleSuspend(r.id)}
                                                >
                                                    <UnlockKeyholeIcon />
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-red-500 px-2 text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(r.id)}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4 text-center text-muted-foreground" colSpan={10}>
                                    No accounts yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm mt-2">Total Accounts: {initialRows.length}</p>

                <div className="flex justify-end items-center mt-4 space-x-2 ">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Pages {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}