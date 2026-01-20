import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface Candidate {
    id: number;
    name: string;
    email: string;
    status: string;
    externalId?: number;
}

const SuccessTable: React.FC = () => {
    const { data: candidates, isLoading, error } = useQuery<Candidate[]>({
        queryKey: ['successCandidates'],
        queryFn: async () => {
            const response = await api.get('/candidates/success');
            return response.data;
        },
    });

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error loading data</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Successful Candidates</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">ID</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">External ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates?.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{candidate.id}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{candidate.name}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{candidate.email}</td>
                                <td className="py-2 px-4 border-b text-sm text-green-600 font-semibold">{candidate.status}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{candidate.externalId || '-'}</td>
                            </tr>
                        ))}
                        {candidates?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">No successful candidates found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuccessTable;
