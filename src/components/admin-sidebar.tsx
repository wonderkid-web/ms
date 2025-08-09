"use client";

import Link from "next/link";
import React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarProvider, 
  SidebarSeparator 
} from "@/components/ui/sidebar";
import { UserIcon, LogOutIcon, LayoutDashboardIcon, FileTextIcon, BarChartIcon } from "lucide-react";

export default function AdminSidebar() {
  return (
    <SidebarProvider>
      <Sidebar className="bg-[#047857] text-white">
        <SidebarHeader className="text-center">
          <div className="text-4xl mb-2"><UserIcon className="mx-auto" size={48} /></div>
          <h2 className="text-xl font-bold">Admin Page</h2>
          <p className="text-sm text-gray-200">Welcome, Admin User</p>
          <button className="mt-2 text-sm text-blue-200 hover:text-blue-50" onClick={() => console.log("Logout")}>Logout</button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/transaction">
                  <LayoutDashboardIcon className="mr-2" /> Transaction
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubButton asChild>
                  <Link href="/trace">
                    <FileTextIcon className="mr-2" /> Trace
                  </Link>
                </SidebarMenuSubButton>
                <SidebarMenuSubButton asChild>
                  <Link href="/declaration">
                    <FileTextIcon className="mr-2" /> Declaration
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarSeparator />

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/report">
                  <BarChartIcon className="mr-2" /> Report
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubButton asChild>
                  <Link href="/report/summary-cpo-pk">
                    <BarChartIcon className="mr-2" /> Summary CPO & PK
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          {/* Optional footer content */}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
