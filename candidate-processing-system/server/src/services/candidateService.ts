import prisma from '../config/db';
import { CandidateInput } from '../schemas/candidateSchema';
// REMOVED: import { Status } from '@prisma/client'; 

// Manually define Status to satisfy TypeScript without the import
const STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
} as const;

export const createCandidate = async (data: CandidateInput) => {
    return await prisma.candidate.create({
        data: {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            link: data.link || null,
            dob: data.dob || null,
            status: STATUS.PENDING, // Uses string 'PENDING'
        },
    });
};

export const getCandidates = async (page: number, limit: number, status?: string, search?: string) => {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status && status !== 'ALL') {
        where.status = status; // Simply pass the string
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.candidate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: candidates,
        total,
        page,
        totalPages,
    };
};

export const getPendingOrFailedCandidates = async (limit: number) => {
    return await prisma.candidate.findMany({
        where: { status: { in: [STATUS.PENDING, STATUS.FAILED] } },
        take: limit,
        orderBy: { createdAt: 'asc' }
    });
};

// Changed type to 'any' to avoid strict Enum collision
export const updateCandidateStatus = async (id: number, status: any, externalId?: number) => {
    return await prisma.candidate.update({
        where: { id },
        data: {
            status,
            externalId: externalId ? Number(externalId) : undefined
        }
    });
};

export const updateCandidatesStatus = async (ids: number[], status: any) => {
    return await prisma.candidate.updateMany({
        where: { id: { in: ids } },
        data: { status }
    });
};