"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HandCoins,
  Route as RouteIcon,
  Factory,
  FileText,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  Building,
  Truck,
} from "lucide-react";

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-emerald-600/20 text-white shadow-inner"
          : "text-emerald-50/90 hover:bg-emerald-600/30 hover:text-white",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 opacity-90 group-hover:opacity-100" />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-emerald-600 to-emerald-700 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 backdrop-blur">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Administrator</p>
          <p className="text-xs text-emerald-100/80">Portal Traceability</p>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Profile */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">User Name</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-emerald-50/80 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Link>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Nav */}
      <ScrollArea className="h-[calc(100vh-180px)] px-2 py-3">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
          Transaction
        </p>
        <div className="space-y-1 px-2">
          <NavItem
            href="/admin/transaction"
            icon={HandCoins}
            label="Transaction"
          />
          <NavItem href="/admin/trace" icon={RouteIcon} label="Trace" />
          <NavItem
            href="/admin/declaration"
            icon={Factory}
            label="Declaration"
          />
        </div>

        <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
          Report
        </p>
        <div className="space-y-1 px-2">
          <NavItem
            href="/admin/report/summary-cpo-pk"
            icon={FileText}
            label="Summary CPO & PK"
          />
          {/* contoh item lain */}
          <NavItem
            href="/admin/report/dashboard"
            icon={BarChart3}
            label="Dashboard"
          />
        </div>

        <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
          Master Data
        </p>

        <div className="space-y-1 px-2">
          <NavItem
            href="/admin/master-data/produk"
            icon={Package}
            label="Produk"
          />
          <NavItem href="/admin/master-data/user" icon={Users} label="User" />
          <NavItem
            href="/admin/master-data/factories"
            icon={Building}
            label="Factory"
          />
          <NavItem
            href="/admin/master-data/supplier"
            icon={Truck}
            label="Supplier"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
