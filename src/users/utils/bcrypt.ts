const bcrypt = require('bcryptjs');
export async function encodePassword(password: string): Promise<string> {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hash(password, SALT);
}

export function comparePasswords(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}
