import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('8000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  GROQ_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CLIENT_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`❌ Invalid environment variables:\n${missing}`);
}

export const env = parsed.data;
