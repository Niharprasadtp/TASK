import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';

const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

const CandidateForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
    });

    const onSubmit = async (data: CandidateFormData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            await api.post('/candidates', data);
            setMessage('Candidate submitted successfully!');
            reset();
        } catch (error) {
            console.error(error);
            setMessage('Failed to submit candidate.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Candidate Entry</h2>
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        {...register('name')}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        {...register('email')}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        {...register('phoneNumber')}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Link (Optional)</label>
                    <input
                        {...register('link')}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.link ? 'border-red-500' : ''}`}
                    />
                    {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth (Optional)</label>
                    <input
                        type="date"
                        {...register('dob')}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.dob ? 'border-red-500' : ''}`}
                    />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    ) : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CandidateForm;
