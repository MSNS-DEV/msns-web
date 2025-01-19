"use client"

import { CalendarIcon as CalendarCog, type LucideIcon, NotebookPenIcon, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"

type IconType = LucideIcon

interface Services {
  title: string
  description: string
  icon: IconType
  href: string
  iconColor: string
  bgColor: string
}

const services: Services[] = [
  {
    title: "Session Management",
    description: "Manage academic sessions, terms, and schedules",
    icon: CalendarCog,
    href: "/academics/sessionalDetails",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    title: "User Management",
    description: "Manage students, teachers, and staff accounts",
    icon: NotebookPenIcon,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/userReg",
  },
  {
    title: "Fee Management",
    description: "Track and manage student fees and payments",
    icon: Wallet,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    href: "/revenue",
  },
]

export default function AdminCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = service.icon
        return (
          <Link href={service.href} key={service.title}>
            <Card className={`${service.bgColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
              <CardHeader>
                <Icon className={`h-8 w-8 ${service.iconColor}`} />
                <CardTitle className="mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

