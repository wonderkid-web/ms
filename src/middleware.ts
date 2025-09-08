import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Sesuaikan mapping dashboard per role
const HOME_BY_ROLE: Record<string, string> = {
  ADMIN: "/admin/transaction",
  VIEWER: "/user",
};

// aqua timez

const DEFAULT_HOME = "/user";

const isAdminArea = createRouteMatcher(["/admin(.*)"]);
const isUserArea = createRouteMatcher(["/user(.*)"]);
const isAuthArea = createRouteMatcher(["/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, sessionClaims } = await auth();
  const url = new URL(req.url);


  // Ambil role dari session claims (hasil mirror publicMetadata)
  const role = (sessionClaims as any)?.metadata?.role as string | undefined;
  const roleHome = (role && HOME_BY_ROLE[role]) || DEFAULT_HOME;

  // 1) Kalau user sudah login & masuk ke halaman auth => lempar ke dashboard sesuai role
  if (isAuthArea(req) && isAuthenticated) {
    url.pathname = roleHome;
    return NextResponse.redirect(url);
  }

  // 2) Root "/" — kalau sudah login, lempar ke dashboard sesuai role.
  //    Kalau mau root wajib login, ganti "return NextResponse.next()" jadi "await auth.protect()"
  if (url.pathname === "/") {
    if (isAuthenticated) {
      url.pathname = roleHome;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3) Lindungi area /admin: wajib login & harus role admin
  if (isAdminArea(req)) {
    await auth.protect();
    // pastikan sudah login
    if (role !== "ADMIN") {

      url.pathname = roleHome;      // non-admin dialihkan
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4) Lindungi area /user: wajib login (role apa pun)
  if (isUserArea(req)) {
    await auth.protect();

    if (role !== "VIEWER") {
      url.pathname = roleHome;      // non-admin dialihkan
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 5) Rute lain: lanjutkan
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",                               // root
    "/((?!_next|.*\\..*).*)",          // semua page kecuali asset statis
    "/(api|trpc)(.*)",                 // selalu jalan di API
  ],
};
