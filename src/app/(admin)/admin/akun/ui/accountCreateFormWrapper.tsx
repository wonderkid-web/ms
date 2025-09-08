"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import AccountCreateForm from "./accountCreateForm";
import { createAction } from "../action/akun";
import { UserPlus } from "lucide-react";

export default function AccountCreateFormDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleCreate = async (formData: FormData) => {
        const res = await createAction(formData);
        router.refresh();
        if (res?.ok) {
            closeModal();
        }
        return res;
    };

    return (
        <div className="flex">
            <Button
                variant="outline"
                className="border-green-500 mb-3 text-green-700 hover:bg-green-50 flex gap-2 ml-auto"
                onClick={openModal}
            >
                <UserPlus />
                Add Customer
            </Button>

            <Dialog open={open} onClose={closeModal} className="relative z-50">
                {/* Backdrop */}
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/40 data-closed:opacity-0 transition-opacity duration-200"
                />

                {/* Centering wrapper */}
                <div className="fixed inset-0 grid place-items-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-5 shadow-xl data-closed:scale-95 data-closed:opacity-0 transition duration-200 ease-out"
                    >
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-lg font-semibold text-emerald-900">
                                Create New Account
                            </DialogTitle>
                            <button
                                onClick={closeModal}
                                className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                                aria-label="Tutup"
                                title="Tutup"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4">
                            {/* Form sudah disesuaikan dengan schema Account */}
                            <AccountCreateForm action={handleCreate} closeModal={closeModal} />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}