'use client';

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Building, Package, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function DashboardClient({ data }: { data: any }) {
    const { declarations, suppliers, factories, products } = data;
    const [globalDate, setGlobalDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    const [transactionsDate, setTransactionsDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    const [supplierDate, setSupplierDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    const filteredDeclarations = useMemo(() => {
        if (globalDate?.from && globalDate?.to) {
            return declarations.filter((d: any) => {
                const declarationDate = new Date(d.tanggalPengisian);
                return declarationDate >= globalDate.from! && declarationDate <= globalDate.to!;
            });
        }
        return declarations;
    }, [declarations, globalDate]);

    const filteredTransactions = useMemo(() => {
        if (transactionsDate?.from && transactionsDate?.to) {
            return filteredDeclarations.filter((d: any) => {
                const declarationDate = new Date(d.tanggalPengisian);
                return declarationDate >= transactionsDate.from! && declarationDate <= transactionsDate.to!;
            });
        }
        return filteredDeclarations;
    }, [filteredDeclarations, transactionsDate]);

    const filteredSuppliers = useMemo(() => {
        if (supplierDate?.from && supplierDate?.to) {
            return filteredDeclarations.filter((d: any) => {
                const declarationDate = new Date(d.tanggalPengisian);
                return declarationDate >= supplierDate.from! && declarationDate <= supplierDate.to!;
            });
        }
        return filteredDeclarations;
    }, [filteredDeclarations, supplierDate]);

    const transactionData = filteredTransactions.reduce((acc: any, d: any) => {
        const month = new Date(d.tanggalPengisian).toLocaleString('default', { month: 'short' });
        const year = new Date(d.tanggalPengisian).getFullYear();
        const key = `${month} ${year}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(transactionData).map(key => ({
        name: key,
        transactions: transactionData[key]
    }));

    const supplierTypeData = filteredSuppliers
        .filter((d: any) => d.details && d.details.length > 0)
        .flatMap((d: any) => d.details)
        .reduce((acc: any, d: any) => {
            if (d) {
                acc[d.jenisSupplier] = (acc[d.jenisSupplier] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

    const pieChartData = Object.keys(supplierTypeData).map(key => ({
        name: key,
        value: supplierTypeData[key]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const recentTransactions = filteredDeclarations.slice(0, 5);

    return (
        <div className="p-5">
            <div className="flex justify-between md:items-center mb-2 flex-col md:flex-row">
                <h1 className="text-2xl font-semibold text-emerald-800">Dashboard</h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className=" justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {globalDate?.from ? (
                                globalDate.to ? (
                                    <>{format(globalDate.from, "LLL dd, y")} - {format(globalDate.to, "LLL dd, y")}</>
                                ) : (
                                    format(globalDate.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={globalDate?.from}
                            selected={globalDate}
                            onSelect={setGlobalDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Separator className="mb-3" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredDeclarations.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{suppliers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Factories</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{factories.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex justify-between md:items-center mb-2 flex-col md:flex-row w-full">
                            <CardTitle className="text-sm font-medium">Transactions per Month</CardTitle>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className=" justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {transactionsDate?.from ? (
                                            transactionsDate.to ? (
                                                <>{format(transactionsDate.from, "LLL dd, y")} - {format(transactionsDate.to, "LLL dd, y")}</>
                                            ) : (
                                                format(transactionsDate.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={transactionsDate?.from}
                                        selected={transactionsDate}
                                        onSelect={setTransactionsDate}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="transactions" fill="#00bc7d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex justify-between md:items-center mb-2 flex-col md:flex-row w-full">
                            <CardTitle className="text-sm font-medium">Supplier Type Distribution</CardTitle>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className=" justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {supplierDate?.from ? (
                                            supplierDate.to ? (
                                                <>{format(supplierDate.from, "LLL dd, y")} - {format(supplierDate.to, "LLL dd, y")}</>
                                            ) : (
                                                format(supplierDate.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className=" w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={supplierDate?.from}
                                        selected={supplierDate}
                                        onSelect={setSupplierDate}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left font-semibold text-emerald-800">
                                <th className="p-2">ID</th>
                                <th className="p-2">Product</th>
                                <th className="p-2">Group</th>
                                <th className="p-2">Supplier</th>
                                <th className="p-2">Factory</th>
                                <th className="p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((t: any) => (
                                <tr key={t.id} className="border-b">
                                    <td className="p-2">{t.id}</td>
                                    <td className="p-2">{t.produk.name}</td>
                                    <td className="p-2">{t.group.name}</td>
                                    <td className="p-2">{t.supplier?.name}</td>
                                    <td className="p-2">{t.factory.name}</td>
                                    <td className="p-2">{new Date(t.tanggalPengisian).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}