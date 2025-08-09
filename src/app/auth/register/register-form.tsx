"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserPlus } from "lucide-react"

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.message ?? "Registrasi gagal.")
        return
      }
      router.push("/auth/login?registered=1")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{"Daftar Akun"}</CardTitle>
        <CardDescription>{"Buat akun untuk mengakses portal traceability."}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{"Gagal"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">{"Nama"}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{"Email"}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{"Password"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isPending ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
