import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Trees, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 text-sm">
                <ShieldCheck className="h-4 w-4" />
                {"Portal Traceability Kelapa Sawit"}
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {"Transparansi Rantai Pasok"}
                <span className="block text-emerald-600">{"Dari Kebun ke Produk"}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {
                  "Lacak asal-usul dan pergerakan produk kelapa sawit Anda. Kelola supplier, batch produk, dan jejak proses dengan mudah serta aman."
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/auth/login">
                    {"Masuk"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/register">{"Daftar Akun"}</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4 text-emerald-600" />
                  {"RSPO-ready"}
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  {"Pelacakan batch end-to-end"}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-white shadow-sm">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Ilustrasi dashboard traceability"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
