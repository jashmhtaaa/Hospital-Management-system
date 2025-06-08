}
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async const hashPassword = (password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
export async const comparePassword = (password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
