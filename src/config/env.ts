import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_APP_NAME: z.string().min(1),

  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),

  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME,

  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,

  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

export type Env = z.infer<typeof envSchema>;
