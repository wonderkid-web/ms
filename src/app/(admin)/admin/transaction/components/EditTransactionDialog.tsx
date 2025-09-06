"use client"

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { DeclarationRow, OptionType } from "./types";
import { getProductGroups } from "@/services/productGroupService";
import { getGroups } from "@/services/groupServices";
import { getSuppliers } from "@/services/supplierServices";
import { getFactories } from "@/services/factoryService";
import { DeclarationDetail, getDeclarationDetails } from "@/services/declarationServices";
import DeclarationForm from "../../declaration/DeclarationForm";

interface EditTransactionDialogProps {
    transaction: DeclarationRow;
}

export default function EditTransactionDialog({ transaction }: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false);
    const [productOptions, setProductOptions] = useState<OptionType[]>([]);
    const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);
    const [factoryOptions, setFactoryOptions] = useState<OptionType[]>([]);
    const [declarationDetails, setDeclarationDetails] = useState<DeclarationDetail[] | null>(null);

    const mapToOptions = (rows: { id: number; name: string }[]) =>
        rows.map((r) => ({ value: String(r.id), label: r.name }));

    const loadOptions = async () => {
        try {
            const [products, groups, suppliers, factories] = await Promise.all([
                getProductGroups(),
                getGroups(),
                getSuppliers(),
                getFactories(),
            ]);
            setProductOptions(mapToOptions(products));
            setGroupOptions(mapToOptions(groups));
            setSupplierOptions(mapToOptions(suppliers));
            setFactoryOptions(mapToOptions(factories));
        } catch (error) {
            console.error("Failed to load options", error);
        }
    };

    const loadDetails = async () => {
        try {
            const details = await getDeclarationDetails(transaction.id);
            setDeclarationDetails(details);
        } catch (error) {
            console.error("Failed to load declaration details", error);
        }
    }

    const handleOpen = () => {
        setOpen(true);
        loadOptions();
        loadDetails();
    }

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center gap-1.5 border border-emerald-500 text-emerald-700 px-3 py-1 rounded bg-transaparent hover:bg-emerald-100"
            >
                <Edit2 className="h-4 w-4" />
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="max-w-7xl space-y-4 bg-white p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out data-[closed]:scale-95 data-[closed]:opacity-0 max-h-[90vh] overflow-y-auto"
                    >
                        <DialogTitle className="text-lg font-bold fixed top-0">Edit Transaction ⏳</DialogTitle>
                        {productOptions.length > 0 && factoryOptions.length > 0 && declarationDetails && (
                            <DeclarationForm
                                produkOptions={productOptions}
                                groupOptions={groupOptions}
                                supplierOptions={supplierOptions}
                                pabrikOptions={factoryOptions}
                                // @ts-ignore
                                declaration={transaction}
                                details={declarationDetails}
                            />
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}