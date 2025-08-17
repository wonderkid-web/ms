// app/admin/declaration/page.tsx
import { getDeclarationOptions } from "@/services/declarationOptionServices";
import DeclarationForm from "./DeclarationForm";

export default async function DeclarationPage() {
  const options = await getDeclarationOptions();
  return (
    <div className="p-6">
      <DeclarationForm
        produkOptions={options.produk}
        groupOptions={options.group}
        supplierOptions={options.supplier}
        pabrikOptions={options.pabrik}
      />
    </div>
  );
}
