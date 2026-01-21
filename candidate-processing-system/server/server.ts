import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
// FIX 1: Removed ', Candidate' from here
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import cron from 'node-cron';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Zod Schema ---
const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
});

// --- Helper: Convert YYYY-MM-DD to DD/MM/YYYY ---
const formatDateToDDMMYYYY = (dateStr: string | null): string | null => {
    if (!dateStr) return null;
    try {
        if (dateStr.includes('/') && dateStr.split('/')[2].length === 4) return dateStr;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
};

// --- API Routes ---
app.post('/api/candidates', async (req, res) => {
    try {
        const data = candidateSchema.parse(req.body);

        const candidate = await prisma.candidate.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                link: data.link || null,
                dob: data.dob || null,
                status: 'PENDING',
            },
        });

        res.status(201).json(candidate);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Error creating candidate:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.get('/api/candidates/success', async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany({
            where: { status: 'SUCCESS' },
            orderBy: { createdAt: 'desc' },
        });
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching success candidates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Worker (Cron Job) ---
const processCandidates = async () => {
    console.log('Running Candidate Processing Worker...');

    try {
        const candidates = await prisma.candidate.findMany({
            where: { status: { in: ['PENDING', 'FAILED'] } },
            take: 10,
            orderBy: { createdAt: 'asc' }
        });

        if (candidates.length === 0) {
            console.log('No candidates to process.');
            return;
        }

        console.log(`Processing batch of ${candidates.length} candidates...`);

        const payload = candidates.map((candidate: any) => ({
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            phoneNumber: candidate.phoneNumber,
            link: candidate.link,
            dob: formatDateToDDMMYYYY(candidate.dob),
        }));

        try {
            const externalApiUrl = process.env.EXTERNAL_API_URL;
            if (!externalApiUrl) {
                throw new Error("EXTERNAL_API_URL is not defined in environment variables");
            }
            const response = await axios.post(externalApiUrl, payload);

            console.log(`API Response Status: ${response.status}`);

            const results = Array.isArray(response.data) ? response.data : [response.data];

            for (const result of results) {
                const resultId = result.id || result.externalId;

                if (result.status === 'SUCCESS' && resultId) {
                    await prisma.candidate.update({
                        where: { id: Number(resultId) },
                        data: {
                            status: 'SUCCESS',
                            externalId: Number(resultId)
                        }
                    });
                    console.log(`Candidate ${resultId} marked as SUCCESS.`);
                } else {
                    console.warn(`Candidate ${resultId} failed or pending. Status: ${result.status}`);
                }
            }

        } catch (apiError: any) {
            console.error('Batch API Request Failed.');

            if (apiError.response) {
                console.error('Server Error Details:', JSON.stringify(apiError.response.data, null, 2));
            } else {
                console.error('Error Message:', apiError.message);
            }

            await prisma.candidate.updateMany({
                where: { id: { in: candidates.map((c: any) => c.id) } },
                data: { status: 'FAILED' }
            });
        }

    } catch (error) {
        console.error('Internal Worker Error:', error);
    }
};

// --- Scheduler ---
cron.schedule('0 */2 * * *', processCandidates);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { app, processCandidates };