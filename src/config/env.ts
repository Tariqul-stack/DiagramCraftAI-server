import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string({ required_error: 'MONGODB_URI is required' }),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }),
  GROQ_API_KEY: z.string({ required_error: 'GROQ_API_KEY is required' }),
  GOOGLE_CLIENT_ID: z.string({ required_error: 'GOOGLE_CLIENT_ID is required' }),
  GOOGLE_CLIENT_SECRET: z.string({ required_error: 'GOOGLE_CLIENT_SECRET is required' }),
  CLIENT_URL: z.string({ required_error: 'CLIENT_URL is required' }),
  BETTER_AUTH_SECRET: z.string({ required_error: 'BETTER_AUTH_SECRET is required' }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`❌ Invalid environment variables:\n${missing}`);
}

export const env = parsed.data;
