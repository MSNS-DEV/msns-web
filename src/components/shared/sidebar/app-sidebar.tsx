"use client"

import * as React from "react"
import { Bot, School, Settings2, SquareTerminal, User } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { cn } from "~/lib/utils"

const data = {
  teams: [
    {
      id: "1",
      name: "Admin",
      logo: School,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Academics",
      url: "/academics",
      icon: Bot,
      items: [
        { title: "Session", url: "/academics/sessionalDetails" },
        { title: "Classes", url: "/academics/classwiseDetail" },
        { title: "Students", url: "/userReg/student/view" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Security", url: "/settings/security" },
        { title: "Notifications", url: "/settings/notifications" },
      ],
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
      items: [
        { title: "Profile", url: "/account" },
        { title: "Settings", url: "/account" },
      ],
    },
  ],
}

export function AppSidebar({ className }: { className?: string }) {
  const { isMobile } = useSidebar()

  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"} 
      className={cn("flex h-screen top-16", className)}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

