import cron from 'node-cron';
import axios from 'axios';
import { EXTERNAL_API_URL } from '../config/env';
import { getPendingOrFailedCandidates, updateCandidateStatus, updateCandidatesStatus } from './candidateService';
import { formatDateToDDMMYYYY } from '../utils/helpers';

// REMOVED: import { Status } from '@prisma/client';

// FIX: Manually define the status to avoid the import error
const STATUS = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
} as const;

export const processCandidates = async () => {
    console.log('Running Candidate Processing Worker...');

    try {
        const candidates = await getPendingOrFailedCandidates(10);

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
            const response = await axios.post(EXTERNAL_API_URL as string, payload);

            console.log(`API Response Status: ${response.status}`);

            const results = Array.isArray(response.data) ? response.data : [response.data];

            for (const result of results) {
                const resultId = result.id || result.externalId;

                if (result.status === 'SUCCESS' && resultId) {
                    // FIX: Use STATUS.SUCCESS (string) instead of Enum
                    await updateCandidateStatus(Number(resultId), STATUS.SUCCESS, Number(resultId));
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

            // FIX: Use STATUS.FAILED (string) instead of Enum
            await updateCandidatesStatus(candidates.map((c: any) => c.id), STATUS.FAILED);
        }

    } catch (error) {
        console.error('Internal Worker Error:', error);
    }
};

export const startCronJob = () => {
    cron.schedule('0 */2 * * *', processCandidates);
};