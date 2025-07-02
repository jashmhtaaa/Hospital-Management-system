import "bcryptjs";
import bcrypt

const SALT_ROUNDS = 10;

export const _hashPassword = async (password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
export const _comparePassword = async (password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);

}
}