"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useSessionList, useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const session = useSessionList();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const res = await signIn.create({ identifier: email, password });
        if (res.status === "complete") {
          await setActive?.({ session: res.createdSessionId });
          const next = params.get("next") || "/admin/transaction";
          router.push(next);
        } else {
          // MFA / verifikasi tambahan (jarang kepakai kalau basic email+password)
          setError("Butuh verifikasi tambahan. Selesaikan langkah di layar.");
        }
      } catch (err: any) {
        const msg =
          err?.errors?.[0]?.message ||
          err?.message ||
          "Email atau password salah.";
        setError(msg);
      }
    });
  }

  const justRegistered = params.get("registered") === "1";

  if (session.sessions?.length) redirect("/admin/transaction");

  return (
    <div className="min-h-[calc(100vh-0px)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="relative hidden overflow-hidden bg-gradient-to-b from-emerald-50 to-white lg:block">
          <div className="absolute inset-0">
            <Image
              src="/logo.png"
              alt="Ilustrasi"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>
          <div className="relative z-10 flex h-full flex-col">
            <header className="px-10 pt-8">
              <div className="inline-flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-md bg-emerald-600"
                  aria-hidden="true"
                />
                <span className="text-xl font-semibold tracking-tight text-emerald-700">
                  Traceability
                </span>
              </div>
            </header>
            <div className="mt-auto px-10 pb-16">
              <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-emerald-800">
                Powering a new era of supply chain risk assessment
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Form */}

        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-800">
                  Log in
                </h1>
                <p className="text-sm text-muted-foreground">
                  Have you not registered?{" "}
                  <Link
                    href="/auth/register"
                    className="text-emerald-700 underline underline-offset-4"
                  >
                    Contact us
                  </Link>
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {justRegistered && (
                    <Alert className="mb-4 border-emerald-200 text-emerald-900">
                      <AlertTitle>Pendaftaran berhasil</AlertTitle>
                      <AlertDescription>
                        Silakan login dengan email dan password Anda.
                      </AlertDescription>
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>Gagal Masuk</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="focus-visible:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter the password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          className="pr-10 focus-visible:ring-emerald-600"
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isPending || !isLoaded}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {isPending ? "Memproses..." : "Log In"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center text-sm">
                    <Link
                      href="/auth/forgot"
                      className="text-emerald-700 underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
