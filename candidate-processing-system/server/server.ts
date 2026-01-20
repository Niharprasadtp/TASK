import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Zod Schema for Candidate
const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
});

// API Routes
app.post('/api/candidates', async (req, res) => {
    try {
        const data = candidateSchema.parse(req.body);

        // Check if email already exists? Requirement doesn't say, but good practice.
        // For now, adhering strictly to "Ingestion... Saves to DB with status PENDING"

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

// Worker (Cron Job)
const processCandidates = async () => {
    console.log('Running Candidate Processing Worker...');

    try {
        // Fetch oldest 10 records with status PENDING or FAILED
        const candidates = await prisma.candidate.findMany({
            where: {
                status: {
                    in: ['PENDING', 'FAILED']
                }
            },
            take: 10,
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (candidates.length === 0) {
            console.log('No candidates to process.');
            return;
        }

        console.log(`Processing ${candidates.length} candidates...`);

        // Process each candidate
        for (const candidate of candidates) {
            try {
                // Send to external API
                // Payload structure isn't defined in prompt, assuming strict mapping of candidate fields.
                // "validates it -> Saves to DB"
                // "sends them to this external API"

                const payload = {
                    name: candidate.name,
                    email: candidate.email,
                    phoneNumber: candidate.phoneNumber,
                    link: candidate.link,
                    dob: candidate.dob,
                    // external API likely wants these.
                };

                const response = await axios.post('https://dev.micro.mgsigma.net/batch/process', payload);

                if (response.status === 200 || response.status === 201) { // Assuming 200/201 is success
                    // Wait, constraint says "If External API returns SUCCESS". 
                    // Usually this means 2xx or specific body field. 
                    // Prompt: "If External API returns SUCCESS: Update DB status to SUCCESS and save the externalId."
                    // I'll assume response body has status or just HTTP success.
                    // Given "externalId", the response likely contains it.

                    // Let's assume response.data contains { status: 'SUCCESS', externalId: 123 } or similar.
                    // Since I don't know the external API spec, I'll log response and try to find externalId.
                    // Fallback: if 200 OK, mark SUCCESS.

                    // Logic update based on prompt: "save the externalId" implies it is returned.

                    const externalId = response.data.externalId || response.data.id || null;

                    await prisma.candidate.update({
                        where: { id: candidate.id },
                        data: {
                            status: 'SUCCESS',
                            externalId: externalId ? parseInt(externalId) : undefined
                        }
                    });
                    console.log(`Candidate ${candidate.id} processed successfully. External ID: ${externalId}`);

                } else {
                    throw new Error(`API returned status ${response.status}`);
                }

            } catch (err: any) {
                console.error(`Failed to process candidate ${candidate.id}:`, err.message);

                await prisma.candidate.update({
                    where: { id: candidate.id },
                    data: { status: 'FAILED' }
                });
            }
        }

    } catch (error) {
        console.error('Error in worker:', error);
    }
};

// Schedule Cron Job: Every 2 hours
// "0 */2 * * *"
cron.schedule('0 */2 * * *', processCandidates);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Export for verification if needed
export { app, processCandidates };
