'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';
import { signIn } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(formData: FormData) {
  const data = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid data' };
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { ok: false, error: 'Email already in use' };

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { name, email, passwordHash, role: 'user' },
  });

  // login automático
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/dashboard',
  });

  return { ok: true };
}
