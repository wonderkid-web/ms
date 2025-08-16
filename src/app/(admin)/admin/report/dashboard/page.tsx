'use client';

import Link from 'next/link';
import { Hammer, Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-lg">
          {/* header strip */}
          <div className="h-1 w-full bg-emerald-600" />

          <div className="p-8 text-center space-y-5">
            {/* Icon cluster */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
              <Hammer className="h-8 w-8 animate-pulse" aria-hidden="true" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
              Halaman Sedang Dibangun
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Fitur ini belum siap digunakan. Tim kami sedang menyiapkan semuanya agar
              mulus dan cepat. Terima kasih sudah sabar menunggu 🙌
            </p>

            {/* Status badges */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
                <Wrench className="h-3.5 w-3.5" />
                In Progress
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Under Construction
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/admin/transaction" className="w-full sm:w-auto">
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                  Kembali ke Transaction
                </Button>
              </Link>
              <Link href="/admin/declaration" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                  Ke Declaration
                </Button>
              </Link>
            </div>
          </div>

          {/* subtle footer */}
          <div className="flex items-center justify-center gap-2 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-900">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Developed By • WonderKid 🐴</span>
          </div>
        </div>
      </div>
    </main>
  );
}
