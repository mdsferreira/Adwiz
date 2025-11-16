// lib/hash.ts
import bcrypt from 'bcrypt';
export const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);
