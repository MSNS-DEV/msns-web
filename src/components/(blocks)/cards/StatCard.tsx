"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Users, GraduationCap, DollarSign, School } from 'lucide-react'

const stats = [
  {
    title: "Total Students",
    value: "2,350",
    icon: Users,
    description: "↗️ 320 from last month",
    color: "text-blue-600",
  },
  {
    title: "Active Classes",
    value: "45",
    icon: GraduationCap,
    description: "↗️ 3 new classes",
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "₨ 235,000",
    icon: DollarSign,
    description: "↗️ 15% from last month",
    color: "text-yellow-600",
  },
  {
    title: "Departments",
    value: "12",
    icon: School,
    description: "→ No change",
    color: "text-purple-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

