'use server';

import { signIn } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(formData: FormData) {
  const data = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid credentials' };
  }

  const { email, password } = parsed.data;

  await signIn('credentials', {
    email,
    password,
    redirectTo: '/dashboard',
  });

  return { ok: true };
}
