import { Request, Response } from 'express';
import { z } from 'zod';
import { candidateSchema } from '../schemas/candidateSchema';
import { createCandidate, getCandidates } from '../services/candidateService';

export const addCandidate = async (req: Request, res: Response) => {
    try {
        const data = candidateSchema.parse(req.body);
        const candidate = await createCandidate(data);
        res.status(201).json(candidate);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Error creating candidate:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const result = await getCandidates(page, limit, status, search);
        res.json(result);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
