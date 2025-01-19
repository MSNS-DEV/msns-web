"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { type FeeCategory, type ClassCategory } from "@prisma/client";
import { FeeAllotmentDialog } from "../forms/fee/FeeAllot";

type ClassFeeProps = {
  sfcId: string;
  studentClassId: string;
  feeId: string;
  discount: number;
  discountbypercent: number;
  discountDescription: string;
  createdAt: Date;
  updatedAt: Date;
  fee: {
    feeId: string;
    level: string;
    type: FeeCategory;
    tuitionFee: number;
    examFund: number;
    computerLabFund: number | null;
    studentIdCardFee: number;
    infoAndCallsFee: number;
    createdAt: Date;
    updatedAt: Date;
  };
  studentClass: {
    scId: string;
    student: {
      studentId: string;
      registrationNumber: string;
      studentName: string;
      studentMobile: string;
      fatherMobile: string;
      gender: string;
      dateOfBirth: string;
      fatherName: string;
      studentCNIC: string;
      fatherCNIC: string;
      fatherProfession: string;
      address: string;
      city: string;
      country: string;
      isAssign: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };
    class: {
      classId: string;
      grade: string;
      section: string;
      category: ClassCategory;
      fee: number;
    };
  };
};

type ClassFeeTableProps = {
  classId: string;
  sessionId: string;
};

const columns: ColumnDef<ClassFeeProps>[] = [
  {
    accessorKey: "studentClass.student.registrationNumber",
    header: "Student ID",
  },
  {
    accessorKey: "studentClass.student.studentName",
    header: "Student Name",
  },
  {
    accessorKey: "studentClass.class.grade",
    header: "Class",
  },
  {
    accessorKey: "studentClass.fee.tuitionFee",
    header: "Monthly Fee",
    cell: ({ row }) => `Rs. ${row.original.fee.tuitionFee.toLocaleString()}`,
  },
  {
    id: "annualFee",
    header: "Annual Fee",
    cell: ({ row }) => {
      const fee = row.original.fee;
      const annualFee = fee.examFund + (fee.computerLabFund ?? 0) + fee.studentIdCardFee + fee.infoAndCallsFee;
      return `Rs. ${annualFee.toLocaleString()}`;
    },
  },
  {
    id: "totalFee",
    header: "Total Fee",
    cell: ({ row }) => {
      const fee = row.original.fee;
      const totalFee = fee.tuitionFee + fee.examFund + (fee.computerLabFund ?? 0) + fee.studentIdCardFee + fee.infoAndCallsFee;
      return `Rs. ${totalFee.toLocaleString()}`;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => <div>Rs. {row.getValue<number>("discount").toLocaleString()}</div>,
  },
  {
    accessorKey: "discountbypercent",
    header: "Discount %",
    cell: ({ row }) => <div>{row.getValue<number>("discountbypercent").toFixed(2)}%</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <FeeAllotmentDialog
        sfcId={row.original.sfcId}
        studentClassId={row.original.studentClassId}
        feeId={row.original.feeId}
        initialDiscount={row.original.discount}
        initialDiscountPercent={row.original.discountbypercent}
        initialDiscountDescription={row.original.discountDescription}
        onAllotmentSuccess={refetchClassFees}
      />
    ),
  },
];

export function ClassFeeTable({ classId, sessionId }: ClassFeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  

  const { data: classFees, refetch: refetchClassFees } = api.fee.getFeesByClassAndSession.useQuery(
    { classId, sessionId },
    {
      select: (data) =>
        data.map((item) => ({
          ...item,
          studentClass: {
            ...item.studentClass,
            student: {
              ...item.studentClass.student,
              dateOfBirth: item.studentClass.student.dateOfBirth || "",
              fatherName: item.studentClass.student.fatherName || "",
              studentCNIC: item.studentClass.student.studentCNIC || "",
              fatherCNIC: item.studentClass.student.fatherCNIC || "",
              fatherProfession: item.studentClass.student.fatherProfession || "",
              address: "",
              city: "",
              country: "",
            },
          },
          discountbypercent: 0, // Add the missing property
        })),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const table = useReactTable<ClassFeeProps>({
    data: classFees ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const totalFeeForClass = classFees?.reduce((total, classFee) => {
    const fee = classFee.fee;
    return total + fee.tuitionFee + fee.examFund + (fee.computerLabFund ?? 0) + fee.studentIdCardFee + fee.infoAndCallsFee;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search fees..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => void refetchClassFees()}
          variant="outline"
        >
          Refresh
        </Button>
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
                  No fees assigned to students in this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalFeeForClass !== undefined && (
        <div className="text-right font-semibold">
          Total Fee for Class: Rs. {totalFeeForClass.toLocaleString()}
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}

function refetchClassFees(): void {
  throw new Error("Function not implemented.");
}

