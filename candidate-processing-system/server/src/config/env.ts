import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

if (!EXTERNAL_API_URL) {
    throw new Error("EXTERNAL_API_URL is not defined in environment variables");
}

export const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
