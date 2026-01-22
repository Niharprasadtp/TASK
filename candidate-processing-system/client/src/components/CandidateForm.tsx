import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import 'react-phone-number-input/style.css'; // Import default styles
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

// --- Zod Schema ---
const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().refine((val) => val && isValidPhoneNumber(val), {
        message: 'Invalid phone number',
    }),
    link: z.string().url('Must be a valid URL (https://...)').optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
});




type CandidateFormData = z.infer<typeof candidateSchema>;

const CandidateForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
    });

    const onSubmit = async (data: CandidateFormData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            await api.post('/candidates', data);
            setMessage({ type: 'success', text: 'Candidate submitted successfully!' });
            reset();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to submit candidate.' });
        } finally {
            setIsLoading(false);
        }
    };






    // --- Reusable "Google Style" Input Component ---
    const FloatingLabelInput = ({ label, error, registration, type = "text" }: any) => (
        <div className="relative z-0 w-full mb-6 group">
            <input
                type={type}
                placeholder=" "
                {...registration}
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${error
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-blue-600'
                    }`}
            />
            {/* FIX: Changed -z-10 to z-10 and added pointer-events-none */}
            <label className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] pointer-events-none peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${error ? 'text-red-600' : 'text-gray-500 peer-focus:text-blue-600'
                }`}>
                {label}
            </label>
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Candidate Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter the candidate details below to process their application.
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-lg text-sm font-medium flex items-center ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message?.text}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    <FloatingLabelInput
                        label="Full Name"
                        registration={register('name')}
                        error={errors.name}
                    />

                    <FloatingLabelInput
                        label="Email Address"
                        type="email"
                        registration={register('email')}
                        error={errors.email}
                    />

                    {/* Phone Input with Country Code */}
                    <div className="relative z-0 w-full mb-6 group">
                        <label className={`block text-xs font-medium mb-1 transition-colors ${errors.phoneNumber ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            Phone Number
                        </label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    {...field}
                                    placeholder="Enter phone number"
                                    defaultCountry="IN" // Default to India
                                    international
                                    className={`google-phone-input flex py-2 px-0 w-full text-sm bg-transparent border-0 border-b-2 focus:ring-0 transition-colors ${errors.phoneNumber
                                        ? 'border-red-500'
                                        : 'border-gray-300 focus-within:border-blue-600'
                                        }`}
                                />
                            )}
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.phoneNumber?.message}</p>
                        )}
                    </div>

                    <FloatingLabelInput
                        label="Profile URL (Optional)"
                        type="url"
                        registration={register('link')}
                        error={errors.link}
                    />

                    {/* Date Input */}
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            type="date"
                            {...register('dob')}
                            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors ${errors.dob ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                                }`}
                        />
                        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Date of Birth (Optional)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CandidateForm;