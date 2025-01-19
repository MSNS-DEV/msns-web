"use client";

import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import Link from "next/link";
import { StudentAllotmentDialog } from "../forms/class/StudentAlotment";
import { FeeAllotmentDialog } from "../forms/fee/FeeAllot";

type ClassStudentProps = {
  student: {
    studentId: string;
    registrationNumber: string;
    studentMobile: string;
    fatherMobile: string;
    guardianName?: string | null; // Can be string, null, or undefined
    studentName: string;
    fatherName: string;
    // Add other properties as needed...
  };
  class: {
    grade: string;
    fee: number;
    classId: number;
    // Add other properties as needed...
  };
  session: {
    sessionName: string;
    sessionId: string;
    // Add other properties as needed...
  };
};

const columns: ColumnDef<ClassStudentProps>[] = [
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
    accessorKey: "scid",
    header: "Id",
    cell: ({ row }) => <div>{row.getValue("scid")}</div>,
  },
  {
    accessorKey: "student.studentName",
    header: "Student Name",
    cell: ({ row }) => <div>{row.getValue("student.studentName")}</div>,
  },
  {
    accessorKey: "student.fatherName",
    header: "Father Name",
    cell: ({ row }) => <div>{row.getValue("student.fatherName")}</div>,
  },
  {
    accessorKey: "class.grade",
    header: "Class",
    cell: ({ row }) => <div>{row.getValue("class.grade")}</div>,
  },
  {
    accessorKey: "session.sessionName",
    header: "Session",
    cell: ({ row }) => <div>{row.getValue("session.sessionName")}</div>,
  },
  {
    accessorKey: "class.fee",
    header: "Fee",
    cell: ({ row }) => <div>${row.getValue<number>("class.fee").toFixed(2)}</div>,
  },
];

export const ClassAlotmentTable = ({ classId }: { classId: string, sessionId: string }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ClassStudentProps[]>([]);

  const students = api.alotment.getStudentsInClass.useQuery({ classId });

  useEffect(() => {
    if (students.data) {
      const transformedData = students.data.map((item) => ({
        ...item,
        student: {
          ...item.student,
          guardianName: item.student.guardianName ?? "",
        },
      }));
      setData(transformedData as unknown as ClassStudentProps[]);
    }
  }, [students.data]);

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
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.toggleAllRowsSelected()}
            variant="outline"
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            {table.getIsAllRowsSelected() ? "Deselect All" : "Select All"}
          </Button>
          {/* <Input
            placeholder="Search Student"
            value={
              (table.getColumn("student.studentName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("student.studentName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-blue-500"
          /> */}
        </div>
        <div className="flex items-center gap-2">
          <StudentAllotmentDialog classId={classId}/>
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => students.refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col justify-between rounded-md border bg-gradient-to-r from-blue-200 to-purple-200 p-4 shadow-md transition-shadow hover:shadow-lg"
              data-state={row.getIsSelected() && "selected"}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {row.original.student.studentName}
                  </h3>
                </div>
                <span className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                  {row.original.class.grade}
                </span>
              </div>
              <p className="text-sm text-gray-600">Father: {row.original.student.fatherName}</p>
              <p className="text-sm text-gray-600">Session: {row.original.session.sessionName}</p>
              <p className="text-sm text-gray-600">Fee: ${row.original.class.fee.toFixed(2)}</p>
              <div className="mt-2 flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                  asChild
                >
                  <Link href={`/userReg/student/view${row.original.student.studentId}`}>View Student</Link>
                </Button>
                <FeeAllotmentDialog studentClassId={classId} feeId={classId} onAllotmentSuccess={function (): void {
                  throw new Error("Function not implemented.");
                } } />
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-4 text-center">No students allotted to this class.</div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-indigo-500 text-white hover:bg-indigo-600"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-indigo-500 text-white hover:bg-indigo-600"
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
