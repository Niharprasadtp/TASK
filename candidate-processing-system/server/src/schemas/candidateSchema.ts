import { z } from 'zod';

export const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
});

export type CandidateInput = z.infer<typeof candidateSchema>;
