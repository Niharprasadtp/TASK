import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (result.error) {
    console.log('Error loading .env:', result.error);
}

console.log('CWD:', process.cwd());
console.log('DATABASE_URL:', process.env.DATABASE_URL);
