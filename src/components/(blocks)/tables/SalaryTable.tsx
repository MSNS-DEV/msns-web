// src/app/_components/shared/tables/SalaryTable.tsx

'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select"
import { api } from "~/trpc/react"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown
} from "lucide-react"

type SortField = 'employeeName' | 'baseSalary' | 'totalSalary' | 'assignedDate'
type SortOrder = 'asc' | 'desc'

type SalaryData = {
  id: string
  employeeId: string
  baseSalary: number
  increment: number
  totalSalary: number
  assignedDate: Date
  sessionId: string
  employee: {
    employeeName: string
  }
  session: {
    sessionName: string
  }
}

export function SalaryTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('assignedDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const { data, isLoading, error } = api.salary.getSalaries.useQuery({
    page,
    pageSize,
    searchTerm,
    sortField,
    sortOrder
  })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="20">20 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => handleSort('employeeName')}>
                Employee Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('baseSalary')}>
                Base Salary
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Increment</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('totalSalary')}>
                Total Salary
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('assignedDate')}>
                Assigned Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Session</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.salaries.map((salary: SalaryData) => (
            <TableRow key={salary.id}>
              <TableCell className="font-medium">{salary.employee.employeeName}</TableCell>
              <TableCell>{salary.baseSalary.toLocaleString()} PKR</TableCell>
              <TableCell>{salary.increment.toLocaleString()} PKR</TableCell>
              <TableCell>{salary.totalSalary.toLocaleString()} PKR</TableCell>
              <TableCell>{new Date(salary.assignedDate).toLocaleDateString()}</TableCell>
              <TableCell>{salary.session.sessionName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, data?.totalCount ?? 0)} of {data?.totalCount ?? 0} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-500">
            Page {page} of {Math.ceil((data?.totalCount ?? 0) / pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil((data?.totalCount ?? 0) / pageSize)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.ceil((data?.totalCount ?? 0) / pageSize))}
            disabled={page === Math.ceil((data?.totalCount ?? 0) / pageSize)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}