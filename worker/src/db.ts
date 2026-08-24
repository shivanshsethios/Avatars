/**
 * D1 Database schema and queries
 */

export interface AvatarRecord {
  user_id: string;
  seed: string;
  style: string;
  original_key?: string;
  avatar_version: number;
  visibility: string;
  created_at: string;
  updated_at: string;
}

/**
 * Initialize D1 schema
 */
export async function initializeSchema(db: D1Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS avatars (
      user_id TEXT PRIMARY KEY,
      seed TEXT NOT NULL,
      style TEXT NOT NULL DEFAULT 'identicon',
      original_key TEXT,
      avatar_version INTEGER NOT NULL DEFAULT 1,
      visibility TEXT NOT NULL DEFAULT 'public',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_avatars_visibility ON avatars(visibility);
    CREATE INDEX IF NOT EXISTS idx_avatars_updated_at ON avatars(updated_at);
  `);
}

/**
 * Fetch avatar metadata
 */
export async function getAvatarMetadata(
  db: D1Database,
  userId: string
): Promise<AvatarRecord | null> {
  const result = await db
    .prepare("SELECT * FROM avatars WHERE user_id = ?")
    .bind(userId)
    .first<AvatarRecord>();

  return result || null;
}

/**
 * Create or update avatar metadata
 */
export async function upsertAvatarMetadata(
  db: D1Database,
  record: AvatarRecord
): Promise<void> {
  const now = new Date().toISOString();

  await db
    .prepare(
      `
    INSERT INTO avatars (user_id, seed, style, original_key, avatar_version, visibility, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      seed = excluded.seed,
      style = excluded.style,
      original_key = excluded.original_key,
      avatar_version = excluded.avatar_version,
      visibility = excluded.visibility,
      updated_at = excluded.updated_at
  `
    )
    .bind(
      record.user_id,
      record.seed,
      record.style,
      record.original_key || null,
      record.avatar_version,
      record.visibility,
      record.created_at || now,
      now
    )
    .run();
}
