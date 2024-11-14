// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import {
//     type ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import React, { useEffect, useState, useCallback } from 'react';

// export type CustomColumnDef<T> = ColumnDef<T> & {
//     accessorKey?: keyof T;
// };

// interface DataTableProps<T> {
//     columns: CustomColumnDef<T>[];
//     fetchData: (
//         page: number,
//         pageSize: number,
//         filters: Record<string, string>
//     ) => Promise<{
//         data: T[];
//         total: number;
//     }>;
// }

// export function DataTable<T>({ columns, fetchData }: DataTableProps<T>) {
//     const [data, setData] = useState<T[]>([]);
//     const [totalRows, setTotalRows] = useState(0);
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [filters, setFilters] = useState<Record<string, string>>({});
//     const [selectedColumn, setSelectedColumn] = useState<string>('');
//     const [filterValue, setFilterValue] = useState<string>('');

//     const table = useReactTable({
//         data,
//         columns,
//         pageCount: Math.ceil(totalRows / pageSize),
//         state: {
//             pagination: { pageIndex: page - 1, pageSize },
//         },
//         getCoreRowModel: getCoreRowModel(),
//         manualPagination: true,
//     });

//     const handleFetchData = useCallback(async () => {
//         const { data, total } = await fetchData(page, pageSize, filters);
//         setData(data);
//         setTotalRows(total);
//     }, [fetchData, page, pageSize, filters]);

//     useEffect(() => {
//         handleFetchData();
//     }, [handleFetchData]);

//     const handleFilterChange = () => {
//         if (selectedColumn && filterValue) {
//             setFilters((prev) => ({
//                 ...prev,
//                 [selectedColumn]: filterValue,
//             }));
//         }
//     };

//     const handleClearFilters = () => {
//         setFilters({});
//         setSelectedColumn('');
//         setFilterValue('');
//     };

//     return (
//         <div>
//             <div className="flex items-center gap-4 mb-4">
//                 <Select onValueChange={setSelectedColumn} value={selectedColumn}>
//                     <SelectTrigger className="w-48">
//                         <SelectValue placeholder="Select column" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {columns.map((column) => (
//                             <SelectItem key={column.accessorKey as string} value={column.accessorKey as string}>
//                                 {column.header as string}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//                 <Input
//                     placeholder="Enter filter value"
//                     value={filterValue}
//                     onChange={(e) => setFilterValue(e.target.value)}
//                 />
//                 <Button onClick={handleFilterChange}>Apply Filter</Button>
//                 <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
//             </div>
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <tr key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => (
//                                 <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody>
//                     {table.getRowModel().rows.map((row) => (
//                         <tr key={row.id}>
//                             {row.getVisibleCells().map((cell) => (
//                                 <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export type CustomColumnDef<T> = {
    accessorKey?: keyof T;
    header: string;
    cell?: (info: { getValue: () => unknown }) => React.ReactNode;
};

interface DataTableProps<T> {
    columns: CustomColumnDef<T>[];
    fetchData: (
        page: number,
        pageSize: number,
        filters: Record<string, string>,
    ) => Promise<{
        data: T[];
        total: number;
    }>;
}

interface Filter {
    column: string;
    value: string;
}

export function DataTable<T>({ columns, fetchData }: DataTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Filter[]>([]);

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalRows / pageSize),
        state: {
            pagination: { pageIndex: page - 1, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    // Fetch data when filters, page, or pageSize change
    const handleFetchData = useCallback(async () => {
        const filterObject = filters.reduce(
            (acc, filter) => {
                acc[filter.column] = filter.value;
                return acc;
            },
            {} as Record<string, string>,
        );

        const { data, total } = await fetchData(page, pageSize, filterObject);
        setData(data);
        setTotalRows(total);
    }, [fetchData, page, pageSize, filters]);

    useEffect(() => {
        handleFetchData();
    }, [handleFetchData]);

    // Handle adding a new filter
    const handleAddFilter = () => {
        setFilters((prevFilters) => [...prevFilters, { column: "", value: "" }]);
    };

    // Handle changing a filter's column or value
    const handleFilterChange = (
        index: number,
        key: "column" | "value",
        value: string,
    ) => {
        const updatedFilters = [...filters];
        updatedFilters[index][key] = value;
        setFilters(updatedFilters);
    };

    // Handle removing a filter
    const handleRemoveFilter = (index: number) => {
        const updatedFilters = filters.filter((_, i) => i !== index);
        setFilters(updatedFilters);
    };

    // Get list of columns that are already selected
    const selectedColumns = filters.map((filter) => filter.column);

    return (
        <div className="m-4">
            {/* Dynamic Filters Section */}


            <div className="border border-border rounded-md">
                <div className="border-b">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="m-2">Filters</Button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="start" className="w-auto">
                            <div className="mb-6">
                                {filters.map((filter, index) => (
                                    <div key={filter.column} className="flex items-center gap-4 mb-4">
                                        {/* Column Select */}
                                        <Select
                                            value={filter.column}
                                            onValueChange={(value) =>
                                                handleFilterChange(index, "column", value)
                                            }
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Select column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {columns
                                                    .filter(
                                                        (col) =>
                                                            !selectedColumns.includes(col.accessorKey as string) ||
                                                            col.accessorKey === filter.column,
                                                    )
                                                    .map((col) => (
                                                        <SelectItem
                                                            key={col.accessorKey as string}
                                                            value={col.accessorKey as string}
                                                        >
                                                            {col.header}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Filter Value Input */}
                                        <Input
                                            placeholder="Enter filter values (comma-separated)"
                                            value={filter.value}
                                            onChange={(e) =>
                                                handleFilterChange(index, "value", e.target.value)
                                            }
                                        />

                                        {/* Remove Filter Button */}
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleRemoveFilter(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={handleAddFilter}>Add Filter</Button>
                            </div>
                            <div className="flex justify-end">
                                <Button>Apply</Button>

                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <Table className="min-w-full divide-y divide-gray-200 border-b">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between items-center mx-2">
                    <div>
                        <span>
                            Page {page} of {Math.ceil(totalRows / pageSize)}
                        </span>
                    </div>
                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        aria-disabled={page === 1}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((prev) => prev + 1)}
                                        aria-disabled={page >= Math.ceil(totalRows / pageSize)}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
}
