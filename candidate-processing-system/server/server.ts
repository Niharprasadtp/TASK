import express from 'express';
import cors from 'cors';
import { PORT } from './src/config/env';
import candidateRoutes from './src/routes/candidateRoutes';
import { startCronJob, processCandidates } from './src/services/cronService';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/candidates', candidateRoutes);

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Initial Cron Start
    startCronJob();
    processCandidates(); // Run once on startup
});

export { app };