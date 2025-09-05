
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import AccountUpdateForm from "./accountUpdateForm";
import { updateAction } from "../action/akun";
import { FilePen } from "lucide-react";
import { Account } from "@prisma/client";

export default function AccountUpdateFormDialog({ account }: { account: Account }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleUpdate = async (formData: FormData) => {
        const res = await updateAction(account.id, formData);
        router.refresh();
        if (res?.ok) {
            closeModal();
        }
        return res;
    };

    return (
        <div className="flex">
            <Button
                size={"sm"}
                variant={"outline"}
                className="h-8 border-blue-500 px-2 text-blue-700 hover:bg-blue-50"
                onClick={openModal}
            >
                <FilePen />
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
                                Update Account
                            </DialogTitle>
                            <button
                                onClick={closeModal}
                                className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                                aria-label="Close"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4">
                            <AccountUpdateForm
                                action={handleUpdate}
                                closeModal={closeModal}
                                account={account}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}
