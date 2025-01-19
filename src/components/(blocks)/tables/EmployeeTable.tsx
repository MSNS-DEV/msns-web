'use client'

import { useMemo, useState } from "react"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { api } from "~/trpc/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { type ColumnDef, type SortingState, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table"
import { EmployeeDeletionDialog } from "../forms/employee/EmployeeDeletion"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

type EmployeeProps = {
  employeeId: string
  employeeName: string
  fatherName: string
  gender: "Male" | "Female"
  dob: Date
  cnic: string
  maritalStatus: "Married" | "Unmarried" | "Widow" | "Divorced"
  doj: Date
  designation: "Principal" | "Admin" | "Head" | "Clerk" | "Teacher" | "Worker"
  residentialAddress: string
  mobileNo: string
  additionalContact: string | null
  education: string
}

const columns: ColumnDef<EmployeeProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employeeName",
    header: "Employee Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("employeeName")}</div>,
  },
  {
    accessorKey: "fatherName",
    header: "Father Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("fatherName")}</div>,
  },
  {
    accessorKey: "cnic",
    header: "CNIC",
    cell: ({ row }) => <div>{row.getValue("cnic")}</div>,
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => <div>{row.getValue<Date>("dob").toLocaleDateString()}</div>,
  },
  {
    accessorKey: "doj",
    header: "Date of Joining",
    cell: ({ row }) => <div>{row.getValue<Date>("doj").toLocaleDateString()}</div>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "education",
    header: "Education",
    cell: ({ row }) => <div>{row.getValue("education")}</div>,
  },
  {
    accessorKey: "mobileNo",
    header: "Mobile No",
    cell: ({ row }) => <div>{row.getValue("mobileNo")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/faculty/edit/${row.original.employeeId}`}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const EmployeeTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<EmployeeProps[]>([])

  const employeesData = api.employee.getEmployees.useQuery()

  useMemo(() => {
    if (employeesData.data) {
      const formattedData: EmployeeProps[] = employeesData.data.map(employee => ({
        ...employee,
        dob: new Date(employee.dob),
        doj: new Date(employee.doj),
        gender: employee.gender === "MALE" ? "Male" : "Female",
        maritalStatus: employee.maritalStatus.charAt(0).toUpperCase() + employee.maritalStatus.slice(1).toLowerCase() as EmployeeProps['maritalStatus'],
        designation: employee.designation.charAt(0).toUpperCase() + employee.designation.slice(1).toLowerCase() as EmployeeProps['designation']
      }))
      setData(formattedData)
    }
  }, [employeesData.data])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between m-2">
        <Input
          placeholder="Search name"
          value={(table.getColumn("employeeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("employeeName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-3">
          <Button variant={'outline'} type="button" onClick={() => employeesData.refetch()}>
            Refresh
          </Button>
          <EmployeeDeletionDialog employeeIds={table.getSelectedRowModel().rows.map(
            (row) => row.original.employeeId
          )} />
          <Button type="button" asChild>
            <Link href={'userReg/faculty/create'}>Create</Link>
          </Button>
        </div>
      </div>
      <div className="m-2 border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end m-6 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}