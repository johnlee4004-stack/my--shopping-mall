const fs = require('fs');
const path = require('path');

// Prisma CLI only reads .env, but Next.js projects use .env.local.
// Manually load .env.local so db:push works without a separate .env file.
try {
  const envPath = path.join(__dirname, '.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // .env.local not found — fall through to existing process.env
}

const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
