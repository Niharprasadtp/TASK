import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import api from '../lib/api';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

// --- Types ---
interface Candidate {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    link?: string;
    dob?: string;
    status: string;
    externalId?: number;
    createdAt: string;
}

interface CandidatesResponse {
    data: Candidate[];
    total: number;
    page: number;
    totalPages: number;
}

// --- Column Definitions ---
const columnHelper = createColumnHelper<Candidate>();

const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('phoneNumber', {
        header: 'Phone',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue();
            let colorString = 'text-gray-600 bg-gray-100';

            if (status === 'SUCCESS') colorString = 'text-green-700 bg-green-50 ring-green-600/20';
            else if (status === 'PENDING') colorString = 'text-yellow-700 bg-yellow-50 ring-yellow-600/20';
            else if (status === 'FAILED') colorString = 'text-red-700 bg-red-50 ring-red-600/10';

            return (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorString}`}>
                    {status}
                </span>
            )
        },
    }),
    columnHelper.accessor('externalId', {
        header: 'Ext. ID',
        cell: info => info.getValue() || '-',
    }),
];

const Dashboard: React.FC = () => {
    // --- State ---
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when filters change
    React.useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    // --- Data Fetching ---
    const { data, isLoading, isError } = useQuery<CandidatesResponse>({
        queryKey: ['candidates', page, statusFilter, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                status: statusFilter,
                search: debouncedSearch,
            });
            const response = await api.get(`/candidates?${params.toString()}`);
            return response.data;
        },
        placeholderData: (previousData) => previousData, // Keep previous data while loading new
    });

    // --- Table Instance ---
    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: data?.totalPages || 0,
    });

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage and view candidate processing status.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500">
                                            Loading data...
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-10 text-center text-red-500">
                                            Error loading candidates.
                                        </td>
                                    </tr>
                                ) : data?.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500">
                                            No candidates found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(page * 10, data?.total || 0)}</span> of{' '}
                                    <span className="font-medium">{data?.total || 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(old => Math.max(old - 1, 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        Page {page} of {data?.totalPages || 1}
                                    </span>
                                    <button
                                        onClick={() => setPage(old => (data?.totalPages && old < data.totalPages ? old + 1 : old))}
                                        disabled={page === (data?.totalPages || 1)}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
