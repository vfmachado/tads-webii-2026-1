import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, hash] = storedPassword.split(':');

  if (!salt || !hash) {
    return false;
  }

  const hashBuffer = Buffer.from(hash, 'hex');
  const passwordBuffer = scryptSync(password, salt, KEY_LENGTH);

  if (hashBuffer.length !== passwordBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, passwordBuffer);
}
