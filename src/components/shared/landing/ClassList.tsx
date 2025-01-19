"use client";

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import Link from "next/link";
import { ClassCreationDialog } from "../forms/class/ClassCreation";
import { ClassDeletionDialog } from "~/app/_components/forms/class/ClassDeletion";
import { Search, RefreshCw } from 'lucide-react';
import { Checkbox } from "~/components/ui/checkbox";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";

const categoryOrder = ["Montessori", "Primary", "Middle", "SSC_I", "SSC_II"];
const categoryColors: Record<string, string> = {
  Montessori: "text-red-800",
  Primary: "text-pink-800",
  Middle: "text-green-800",
  SSC_I: "text-yellow-800",
  SSC_II: "text-purple-800",
};
const sectionColors: Record<string, string> = {
  ROSE: "bg-pink-100 text-pink-800",
  TULIP: "bg-yellow-100 text-yellow-800",
};

type ClassProps = {
  classId: string;
  grade: string;
  section: string;
  category: string;
  fee: number;
};

type ComponentProps = {
  sessionId: string;
};

export const ClassList = ({ sessionId }: ComponentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ClassProps[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());

  const classesData = api.class.getClasses.useQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await classesData.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useMemo(() => {
    if (classesData.data) {
      setData(classesData.data as ClassProps[]);
    }
  }, [classesData.data]);

  const groupedData = useMemo(() => {
    const grouped: Record<string, ClassProps[]> = {};
    data.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category]?.push(item);
    });
    return grouped;
  }, [data]);

  const handleClassSelect = (classId: string) => {
    const newSelectedClasses = new Set(selectedClasses);
    if (selectedClasses.has(classId)) {
      newSelectedClasses.delete(classId);
    } else {
      newSelectedClasses.add(classId);
    }
    setSelectedClasses(newSelectedClasses);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "grade",
        header: "Grade",
        cell: ({ row }) => <div>{row.getValue("grade")}</div>,
      },
      {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => <div>{row.getValue("section")}</div>,
      },
      {
        accessorKey: "fee",
        header: "Fee",
        cell: ({ row }) => <div>{row.getValue<number>("fee").toFixed(2)}</div>,
      },
    ],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search grade..."
              value={(table.getColumn("section")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const column = table.getColumn("section");
                if (column) {
                  column.setFilterValue(event.target.value);
                }
              }}
              className="pl-10 border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ClassCreationDialog />
            <FeeAssignmentDialog />
            <Button
              variant="outline"
              className={`bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ${
                isRefreshing ? 'animate-pulse' : ''
              }`}
              onClick={handleRefresh}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ClassDeletionDialog
              classIds={Array.from(selectedClasses)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue={categoryOrder[0]} className="w-full">
        <TabsList className="mb-4 flex space-x-2">
          {categoryOrder.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className={`px-4 py-2 font-medium ${categoryColors[category]}`}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categoryOrder.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {(groupedData[category] ?? []).map((row) => (
                <div
                  key={row.classId}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        checked={selectedClasses.has(row.classId)}
                        onCheckedChange={() => handleClassSelect(row.classId)}
                        className="h-4 w-4"
                      />
                      <h3 className="text-lg font-bold text-gray-800">{row.grade}</h3>
                    </div>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      sectionColors[row.section] ?? 'bg-blue-100 text-blue-800'}
                    `}>
                      {row.section}
                    </span>
                    <p className="mt-3 text-xs font-medium text-gray-600">
                      Fee: <span className="text-red-600">{row.fee.toFixed(2)}/-PKR</span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                      asChild
                    >
                      <Link href={`/academics/classwiseDetail?classId=${row.classId}&sessionId=${sessionId}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full bg-gradient-to-r from-blue-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                      asChild
                    >
                      <Link href={`/academics/sessionalDetails/fee?classId=${row.classId}&sessionId=${sessionId}`}>
                        Fee Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
