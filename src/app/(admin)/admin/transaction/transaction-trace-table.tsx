"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const TransactionTraceTable = () => {
  const [search, setSearch] = useState("");

  const data = [
    {
      traceID: 1388,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "KARYA PRATAMA NIAGA JAYA, PT.",
      pks: "KARYA PRATAMA NIAGA JAYA",
      periode: "01/01/2024 s/d 31/12/2024",
      deklarator: "HERMAN KURNIAWAN (OFFICE MANAGER)",
      tglDeklarasi: "29/04/2025",
    },
    {
      traceID: 1355,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "INTAN SEJATI ANDALAN, PT.",
      pks: "INTAN SEJATI ANDALAN",
      periode: "01/01/2024 s/d 31/12/2024",
      deklarator: "PEBRIANTI AGUSTY",
      tglDeklarasi: "30/05/2025",
    },
    {
      traceID: 653,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "INTAN SEJATI ANDALAN, PT.",
      pks: "INTAN SEJATI ANDALAN",
      periode: "01/01/2023 s/d 31/12/2023",
      deklarator: "FAUJIAH HANUM",
      tglDeklarasi: "15/05/2025",
    },
    {
      traceID: 652,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "MUTIARA UNGGUL LESTARI, PT",
      pks: "MUTIARA UNGGUL LESTARI",
      periode: "01/01/2023 s/d 31/12/2023",
      deklarator: "LISMA IRIANI",
      tglDeklarasi: "16/05/2025",
    },
    {
      traceID: 651,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "BERLIAN INTI MEKAR, PT",
      pks: "BERLIAN INTI MEKAR-PALEMBANG",
      periode: "01/01/2023 s/d 31/12/2023",
      deklarator: "EDY HARTONO (OFFICE MANAGER)",
      tglDeklarasi: "12/06/2024",
    },
    {
      traceID: 650,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "BERLIAN INTI MEKAR, PT",
      pks: "BERLIAN INTI MEKAR-RENGAT",
      periode: "01/01/2023 s/d 31/12/2023",
      deklarator: "ANNISA DWI REZKY",
      tglDeklarasi: "18/10/2024",
    },
    {
      traceID: 649,
      produk: "CPO & PK",
      group: "MAHKOTA",
      perusahaan: "BERLIAN INTI MEKAR, PT",
      pks: "BERLIAN INTI MEKAR-SIAK",
      periode: "01/01/2023 s/d 31/12/2023",
      deklarator: "NURJANNAH HASIBUAN (OFFICER)",
      tglDeklarasi: "16/05/2025",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.produk.toLowerCase().includes(search.toLowerCase()) ||
      item.group.toLowerCase().includes(search.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      item.pks.toLowerCase().includes(search.toLowerCase()) ||
      item.deklarator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Trace</h2>
      <Input
        type="text"
        placeholder="Cari..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-80"
      />
      <Table className="text-xs!">
        <TableHeader>
          <TableRow className="bg-emerald-500">
            <TableHead className="text-center text-white">TraceID</TableHead>
            <TableHead className="text-center text-white">Produk</TableHead>
            <TableHead className="text-center text-white">Group Perusahaan</TableHead>
            <TableHead className="text-center text-white">Perusahaan</TableHead>
            <TableHead className="text-center text-white">Pabrik (PKS)</TableHead>
            <TableHead className="text-center text-white">Periode</TableHead>
            <TableHead className="text-center text-white">Deklarator</TableHead>
            <TableHead className="text-center text-white">Tanggal Deklarasi</TableHead>
            <TableHead className="text-center text-white">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <TableRow key={row.traceID} className={index % 2 !== 0 ? "bg-gray-100" : ""}>
                <TableCell>{row.traceID}</TableCell>
                <TableCell>{row.produk}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.perusahaan}</TableCell>
                <TableCell>{row.pks}</TableCell>
                <TableCell>{row.periode}</TableCell>
                <TableCell>{row.deklarator}</TableCell>
                <TableCell>{row.tglDeklarasi}</TableCell>
                <TableCell>
                  <a href="#" className="text-blue-500 hover:underline">Ubah</a> | <a href="#" className="text-red-500 hover:underline">Hapus</a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTraceTable;
