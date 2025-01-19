"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  type ColumnDef,
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CSVUploadDialog } from "../forms/student/FileInput";
import { StudentDeletionDialog } from "../forms/student/StudentDeletion";

type StudentProps = {
  studentId: string;
  registrationNumber: string;
  admissionNumber: string;
  studentName: string;
  fatherName: string;
  gender: "MALE" | "FEMALE" | "CUSTOM";
  dateOfBirth: string;
  studentCNIC: string;
  fatherCNIC: string;
  fatherMobile: string;
  profilePic: string;
};

// Define table columns
const columns: ColumnDef<StudentProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "registrationNumber",
    header: "Registration #",
    cell: ({ row }) => <span>{row.getValue("registrationNumber")}</span>,
  },
  {
    accessorKey: "admissionNumber",
    header: "Adm #",
    cell: ({ row }) => <span>{row.getValue("admissionNumber")}</span>,
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
    cell: ({ row }) => <span>{row.getValue("studentName")}</span>,
  },
  {
    accessorKey: "fatherName",
    header: "Father Name",
    cell: ({ row }) => <span>{row.getValue("fatherName")}</span>,
  },
  {
    accessorKey: "fatherMobile",
    header: "Father Mobile",
    cell: ({ row }) => <span>{row.getValue("fatherMobile")}</span>
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span>{row.getValue("gender")}</span>,
  },

  {
    accessorKey: "createdAt",
    header: "Admission Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <DotsHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/student/edit/${row.original.studentId}`}>
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const StudentTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data: students, refetch } = api.student.getStudents.useQuery();

  const table = useReactTable({
    data: students ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Search name"
          value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("studentName")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
          <StudentDeletionDialog
            studentIds={table
              .getSelectedRowModel()
              .rows.map((row) => row.original.studentId)
              .filter(Boolean)}
          />
          <CSVUploadDialog />
          <Button asChild>
            <Link href="/userReg/student/create">Create</Link>
          </Button>
        </div>
      </div>
      <div className="p-4 border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <span className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </span>
        <div className="flex gap-2">
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
  );
};
