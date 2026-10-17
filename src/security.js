const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Hash a plain text password using native scrypt with a random salt.
 * Output format: <salt_hex>:<hash_hex>
 */
function hashPassword(password) {
  if (!password) throw new Error('Password cannot be empty');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored hash (or legacy plaintext).
 * Uses constant-time comparison (timingSafeEqual) to prevent timing attacks.
 */
function verifyPassword(password, stored) {
  if (!password || !stored) return false;

  // Hashed format: <salt>:<hash>
  if (stored.includes(':')) {
    const parts = stored.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
    
    const bufA = Buffer.from(originalHash, 'hex');
    const bufB = Buffer.from(verifyHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  // Legacy plaintext fallback (backward compatibility with initial seeds)
  return password === stored;
}

/**
 * Generate a cryptographically secure random session token.
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new authenticated session in SQLite.
 * Returns the session token string.
 */
function createSession(db, userId, validityDays = 30) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);

  db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(token, userId, expiresAt);

  return token;
}

/**
 * Retrieve user by checking valid session token from database.
 */
function getUserByToken(db, token) {
  if (!token) return null;
  try {
    const row = db.prepare(`
      SELECT u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND datetime('now', 'localtime') < s.expires_at
    `).get(token);

    return row || null;
  } catch (err) {
    console.error('Error verifying session token:', err);
    return null;
  }
}

/**
 * Destroy a session on logout.
 */
function destroySession(db, token) {
  if (!token) return;
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  } catch (err) {
    console.error('Error destroying session:', err);
  }
}

/**
 * Create a point-in-time snapshot backup of steamcraft.db.
 * Maintains the last 7 daily backups.
 */
function backupDatabase(sourceDbPath, backupDir) {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFileName = `steamcraft_backup_${timestamp}.db`;
    const targetPath = path.join(backupDir, backupFileName);

    fs.copyFileSync(sourceDbPath, targetPath);

    // Prune older backups, keeping only the latest 7
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('steamcraft_backup_') && f.endsWith('.db'))
      .map(f => ({
        name: f,
        fullPath: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 7) {
      const toRemove = files.slice(7);
      for (const file of toRemove) {
        fs.unlinkSync(file.fullPath);
      }
    }

    const stat = fs.statSync(targetPath);
    return {
      success: true,
      filename: backupFileName,
      path: targetPath,
      sizeBytes: stat.size,
      sizeKb: Math.round(stat.size / 1024),
      createdAt: new Date().toISOString(),
      totalBackupsRetained: Math.min(files.length, 7)
    };
  } catch (err) {
    console.error('Database backup failed:', err);
    throw err;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  createSession,
  getUserByToken,
  destroySession,
  backupDatabase
};
