import React from "react";
import TransactionTraceTable from "./transaction-trace-table";

export default function TransactionPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Transaction Dashboard</h1>
      <p>Welcome to the transaction page. Content will go here.</p>
      <TransactionTraceTable />
    </>
  );
}
