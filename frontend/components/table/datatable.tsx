"use client"

import React, { useMemo, useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { Search, ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { usePathname, useRouter } from "next/navigation"

interface DataTableProps<TData> {
    data: TData[]
    columns?: ColumnDef<TData, any>[] // Optional
}

export function DataTable<TData extends object>({ data, columns: userColumns }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const router = useRouter()
    const pathname = usePathname()

    const columns = useMemo<ColumnDef<TData, any>[]>(() => {
        if (userColumns) return userColumns
        if (!data.length) return []

        const sample = data[0]
        const autoColumns = Object.keys(sample).map((key) => ({
            accessorKey: key,
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-left px-0 text-sky-700 hover:text-sky-500 transition-colors"
                >
                    {key}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) => {
                const value = row.getValue(key)
                if (value === null || value === undefined) return "-"
                if (Array.isArray(value)) return value.join(", ")
                return String(value)
            },
        }))

        const selectColumn: ColumnDef<TData, any> = {
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
        }

        return [selectColumn, ...autoColumns]
    }, [data, userColumns])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
            globalFilter,
            columnFilters,
        },
        enableRowSelection: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-sky-500" />
                </div>
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="block w-full p-2 pl-10 text-sm rounded-md border border-sky-300 placeholder-sky-400 text-sky-900 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Search all columns..."
                />
            </div>

            <div className="rounded-md border border-sky-200 bg-white text-sky-900 shadow">
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className={`transition-colors hover:bg-sky-100 cursor-pointer ${row.getIsSelected() ? "bg-sky-100/70" : ""
                                        }`}
                                    // @ts-expect-error row.original.id exists
                                    onClick={() => router.push(`${pathname}/${row.original.id}`)}
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
                                <TableCell colSpan={columns.length} className="text-center text-sky-600">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between px-4 py-3 border-t border-sky-200 bg-sky-50 text-sm">
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="text-sky-700 hover:text-sky-500"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="text-sky-700 hover:text-sky-500"
                        >
                            Next
                        </Button>
                    </div>
                    <div>
                        Page{" "}
                        <strong className="text-sky-700">
                            {table.getState().pagination.pageIndex + 1}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-sky-700">{table.getPageCount()}</strong>
                    </div>
                    <select
                        className="bg-white border border-sky-300 rounded-md p-1 text-sky-900 focus:ring-2 focus:ring-sky-400"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
