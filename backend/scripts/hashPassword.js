// Run once locally to generate a bcrypt hash for your admin password.
// Usage: node scripts/hashPassword.js "your-real-password"
// Copy the printed hash into backend/.env as ADMIN_PASSWORD_HASH.
// Never put the plaintext password itself in .env.
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hashPassword.js "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to backend/.env:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);