
import { getDeclarations } from "@/services/declarationServices";
import { getSuppliers } from "@/services/supplierServices";
import { getFactories } from "@/services/factoryService";
import { getProductGroups } from "@/services/productGroupService";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
    const declarations = (await getDeclarations()).map(d => ({
        ...d,
        details: d.details.map(detail => ({
            ...detail,
            areaHa: detail.areaHa ? Number(detail.areaHa) : null,
            persentaseSuplai: detail.persentaseSuplai ? Number(detail.persentaseSuplai) : null,
        }))
    }));
    const suppliers = await getSuppliers();
    const factories = await getFactories();
    const products = await getProductGroups();

    const data = {
        declarations,
        suppliers,
        factories,
        products
    };

    return <DashboardClient data={data} />;
}
