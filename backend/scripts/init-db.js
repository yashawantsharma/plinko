require("dotenv").config();

const { Pool } = require("pg");

const createRoundTableSql = `
CREATE TABLE IF NOT EXISTS "Round" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "status" TEXT NOT NULL,
  "nonce" TEXT NOT NULL,
  "commitHex" TEXT NOT NULL,
  "serverSeed" TEXT,
  "clientSeed" TEXT,
  "combinedSeed" TEXT,
  "pegMapHash" TEXT,
  "rows" INTEGER NOT NULL DEFAULT 12,
  "dropColumn" INTEGER,
  "binIndex" INTEGER,
  "payoutMultiplier" DOUBLE PRECISION,
  "payoutCents" INTEGER,
  "betCents" INTEGER,
  "pathJson" JSONB,
  "revealedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "Round_createdAt_idx" ON "Round" ("createdAt" DESC);
`;

const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
  });

  try {
    await pool.query(createRoundTableSql);
    console.log("Round table is ready.");
  } finally {
    await pool.end();
  }
};

initDb().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
