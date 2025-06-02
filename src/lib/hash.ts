// src/lib/hash.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


// import bcrypt from 'bcryptjs';

// export interface HashPassword {
//     (password: string): Promise<string>;
// }

// export interface VerifyPassword {
//     (plain: string, hash: string): Promise<boolean>;
// }

// export const hashPassword: HashPassword = async (password) => await bcrypt.hash(password, 10);
// export const verifyPassword: VerifyPassword = async (plain: string, hash: string): Promise<boolean> => await bcrypt.compare(plain, hash);
