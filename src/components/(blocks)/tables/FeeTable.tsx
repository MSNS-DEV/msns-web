"use client";

import { useState, useMemo } from "react";
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
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnSort,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { RefreshCw } from 'lucide-react';
import { FeeCreationDialog } from "../forms/fee/FeeCreation";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";
import { FeeDeletionDialog } from "../forms/fee/FeeDeletion";

type FeeProps = {
  feeId: string;
  level: string;
  admissionFee: number;
  tuitionFee: number;
  examFund: number;
  computerLabFund: number | null;
  studentIdCardFee: number;
  infoAndCallsFee: number;
  createdAt: Date;
  type: string;
};

const columns: ColumnDef<FeeProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "admissionFee",
    header: "Admission Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    id: "tuitionFee",
    header: "Monthly Fee",
    cell: ({ row }) => {
      const monthlyFee = row.original.tuitionFee;
      return `Rs. ${monthlyFee.toLocaleString()}`;
    },  },
  {
    accessorKey: "examFund",
    header: "Exam Fund",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "computerLabFund",
    header: "Computer Lab Fund",
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `Rs. ${value.toLocaleString()}` : "N/A";
    },
  },
  {
    accessorKey: "studentIdCardFee",
    header: "ID Card Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "infoAndCallsFee",
    header: "Info & Calls Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    id: "annualFee",
    header: "Annual Fee",
    cell: ({ row }) => {
      const annualFee = row.original.admissionFee +
        row.original.examFund +
        (row.original.computerLabFund ?? 0) +
        row.original.studentIdCardFee +
        row.original.infoAndCallsFee;
      return `Rs. ${annualFee.toLocaleString()}`;
    },
  },
  {
    id: "totalFee",
    header: "Total Fee",
    cell: ({ row }) => {
      const annualFee = row.original.admissionFee +
        row.original.examFund +
        (row.original.computerLabFund ?? 0) +
        row.original.studentIdCardFee +
        row.original.infoAndCallsFee;
      const totalFee = row.original.tuitionFee + annualFee;
      return `Rs. ${totalFee.toLocaleString()}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => format(getValue() as Date, "dd-MM-yyyy HH:mm:ss"),
  },
];

export function FeeTable() {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: fees, refetch } = api.fee.getAllFees.useQuery();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeleteSuccess = () => {
    void refetch();
    setRowSelection({});
  };

  const table = useReactTable({
    data: fees ?? [],
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
  });

  const selectedFeeIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.feeId);

  const totalFeesByClass = useMemo(() => {
    if (!fees) return {};
    return fees.reduce((acc, fee) => {
      const totalFee = fee.tuitionFee +
        fee.admissionFee +
        fee.examFund +
        (fee.computerLabFund ?? 0) +
        fee.studentIdCardFee +
        fee.infoAndCallsFee;
      acc[fee.level] = (acc[fee.level] ?? 0) + totalFee;
      return acc;
    }, {} as Record<string, number>);
  }, [fees]);

  return (
    <div className="space-y-4 p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-semibold mb-2">Total Fees by Class</h3>
        <Input
          placeholder="Search fees..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className={`bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ${
              isRefreshing ? "animate-pulse" : ""
            }`}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <FeeCreationDialog />
          <FeeAssignmentDialog />
          <FeeDeletionDialog
            feeIds={selectedFeeIds}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
          {Object.entries(totalFeesByClass).map(([level, totalFee]) => (
            <div key={level} className="bg-gray-100 p-4 rounded-md">
              <h6 className="font-normal text-xs">{level}</h6>
              <p className="text-sm">Rs. {totalFee.toLocaleString()}</p>
            </div>
          ))}
      </div>


      <div className="rounded-md border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="bg-gray-50 w-full">
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
                    className="hover:bg-gray-100 transition-colors"
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
                    No fees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
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

