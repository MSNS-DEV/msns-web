"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Checkbox } from "~/components/ui/checkbox"
import { api } from "~/trpc/react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { StudentAllotmentDialog } from "../forms/class/StudentAlotment"
import { StudentDeletionDialog } from "../forms/student/StudentDeletion"
import { FeeManagementDialog } from "../dialogs/FeeManagementDialog"

type StudentAllotmentProps = {
  registrationNumber: string
  studentId: string
  studentName: string
  fatherName: string
  grade: string
  sessionName: string
  sessionId: string
}

export function StudentAllotmentTable({ classId, sessionId }: { classId: string, sessionId: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<StudentAllotmentProps[]>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const studentsInClass = api.alotment.getStudentsByClassAndSession.useQuery({ classId, sessionId })
  const removeStudent = api.alotment.deleteFromClass.useMutation({
    onSuccess: async () => {
      await studentsInClass.refetch()
      setRowSelection({})
    },
  })

  useEffect(() => {
    if (studentsInClass.data) {
      const transformedData: StudentAllotmentProps[] = studentsInClass.data.map((item) => ({
        registrationNumber: item.student.registrationNumber,
        studentId: item.student.studentId,
        studentName: item.student.studentName,
        fatherName: item.student.fatherName,
        grade: item.class.grade,
        sessionName: item.session.sessionName,
        sessionId: item.session.sessionId,
      }))
      setData(transformedData)
    }
  }, [studentsInClass.data])

  const columns: ColumnDef<StudentAllotmentProps>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
    },
    {
      accessorKey: "registrationNumber",
      header: "Reg #",
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Student Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      accessorKey: "fatherName",
      header: "Father Name",
    },
    {
      accessorKey: "grade",
      header: "Class",
    },
    {
      accessorKey: "sessionName",
      header: "Session",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <FeeManagementDialog />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              removeStudent.mutate({
                studentId: row.original.studentId,
                classId: classId,
              });
            }}
            disabled={removeStudent.isPending}
          >
            {removeStudent.isPending ? "Removing..." : "Remove"}
          </Button>
        </div>
      ),
    },  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const selectedStudentIds = table.getSelectedRowModel().rows.map(row => row.original.studentId)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        <StudentAllotmentDialog classId={classId} />
          <Input
            placeholder="Search students..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <StudentDeletionDialog studentIds={selectedStudentIds} />
        </div>
      </div>
      <div className="rounded-md border">
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
                          header.getContext()
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
                        cell.getContext()
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
                  No students allotted to this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500">
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

