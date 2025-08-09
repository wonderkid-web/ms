"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, EyeOff, Globe, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    // startTransition(async () => {
    //   const res = await signIn("credentials", { email, password, redirect: false })
    //   if (res?.error) {
    //     setError("Email atau password salah.")
    //     return
    //   }
    // })
    router.push("/admin/transaction")
  }

  const justRegistered = params.get("registered") === "1"

  return (
    <div className="min-h-[calc(100vh-0px)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: Illustration + Headline */}
        <div className="relative hidden overflow-hidden bg-gradient-to-b from-violet-50 to-white lg:block">
          <div className="absolute inset-0">
            <Image
              src="/logo.png"
              alt="Ilustrasi peta dunia dengan penanda lokasi"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>
          <div className="relative z-10 flex h-full flex-col">
            <header className="px-10 pt-8">
              <div className="inline-flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-violet-600" aria-hidden="true" />
                <span className="text-xl font-semibold tracking-tight text-violet-700">{"Traceability"}</span>
              </div>
            </header>
            <div className="mt-auto px-10 pb-16">
              <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-violet-800">
                {"Powering a new era of supply chain risk assessment"}
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Language selector */}
            <div className="mb-10 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Globe className="h-4 w-4" />
                    {"English (US)"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>{"English (US)"}</DropdownMenuItem>
                  <DropdownMenuItem>{"Bahasa Indonesia"}</DropdownMenuItem>
                  <DropdownMenuItem>{"English (UK)"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-violet-800">{"Log in"}</h1>
                <p className="text-sm text-muted-foreground">
                  {"Have you not registered? "}
                  <Link href="/auth/register" className="text-violet-700 underline underline-offset-4">
                    {"Contact us"}
                  </Link>
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {justRegistered && (
                    <Alert className="mb-4">
                      <AlertTitle>{"Pendaftaran berhasil"}</AlertTitle>
                      <AlertDescription>{"Silakan login dengan email dan password Anda."}</AlertDescription>
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>{"Gagal Masuk"}</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email">{"Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{"Password"}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter the password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-2 w-full bg-violet-600 hover:bg-violet-700"
                      disabled={isPending}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {isPending ? "Memproses..." : "Log In"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center text-sm">
                    <Link href="#" className="text-violet-700 underline underline-offset-4">
                      {"Forgot password?"}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
