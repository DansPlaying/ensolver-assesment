import { pool } from './db';

export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

const NOTE_SELECT = `
  SELECT n.id, n.title, n.content, n."isArchived", n."createdAt", n."updatedAt",
    COALESCE(
      json_agg(json_build_object('id', c.id, 'name', c.name))
      FILTER (WHERE c.id IS NOT NULL),
      '[]'
    ) AS categories
  FROM note n
  LEFT JOIN note_categories_category ncc ON ncc."noteId" = n.id
  LEFT JOIN category c ON c.id = ncc."categoryId"
`;

// Notes
export async function getNotes(userId: number, categoryId?: number): Promise<Note[]> {
  let query = NOTE_SELECT + `WHERE n."userId" = $1 AND n."isArchived" = false`;
  const params: number[] = [userId];

  if (categoryId) {
    query += ` AND n.id IN (SELECT "noteId" FROM note_categories_category WHERE "categoryId" = $2)`;
    params.push(categoryId);
  }

  const result = await pool.query(query + ` GROUP BY n.id ORDER BY n."updatedAt" DESC`, params);
  return result.rows;
}

export async function getArchivedNotes(userId: number): Promise<Note[]> {
  const result = await pool.query(
    NOTE_SELECT + `WHERE n."userId" = $1 AND n."isArchived" = true GROUP BY n.id ORDER BY n."updatedAt" DESC`,
    [userId]
  );
  return result.rows;
}

export async function getNoteById(id: number, userId: number): Promise<Note | null> {
  const result = await pool.query(
    NOTE_SELECT + `WHERE n.id = $1 AND n."userId" = $2 GROUP BY n.id`,
    [id, userId]
  );
  return result.rows[0] ?? null;
}

export async function createNote(
  title: string,
  content: string,
  categoryIds: number[],
  userId: number
): Promise<Note> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO note (title, content, "isArchived", "userId") VALUES ($1, $2, false, $3) RETURNING id`,
      [title, content, userId]
    );
    const noteId = rows[0].id;

    if (categoryIds.length > 0) {
      const values = categoryIds.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
      await client.query(
        `INSERT INTO note_categories_category ("noteId", "categoryId") VALUES ${values}`,
        categoryIds.flatMap((catId) => [noteId, catId])
      );
    }

    await client.query('COMMIT');
    return (await getNoteById(noteId, userId))!;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateNote(
  id: number,
  userId: number,
  title?: string,
  content?: string,
  categoryIds?: number[]
): Promise<Note | null> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const sets = ['"updatedAt" = NOW()'];
    const params: unknown[] = [];
    let idx = 1;

    if (title !== undefined) { sets.push(`title = $${idx++}`); params.push(title); }
    if (content !== undefined) { sets.push(`content = $${idx++}`); params.push(content); }

    params.push(id, userId);
    await client.query(
      `UPDATE note SET ${sets.join(', ')} WHERE id = $${idx++} AND "userId" = $${idx++}`,
      params
    );

    if (categoryIds !== undefined) {
      await client.query(`DELETE FROM note_categories_category WHERE "noteId" = $1`, [id]);
      if (categoryIds.length > 0) {
        const values = categoryIds.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
        await client.query(
          `INSERT INTO note_categories_category ("noteId", "categoryId") VALUES ${values}`,
          categoryIds.flatMap((catId) => [id, catId])
        );
      }
    }

    await client.query('COMMIT');
    return getNoteById(id, userId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteNote(id: number, userId: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM note WHERE id = $1 AND "userId" = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function archiveNote(id: number, userId: number): Promise<Note | null> {
  await pool.query(
    `UPDATE note SET "isArchived" = true, "updatedAt" = NOW() WHERE id = $1 AND "userId" = $2`,
    [id, userId]
  );
  return getNoteById(id, userId);
}

export async function unarchiveNote(id: number, userId: number): Promise<Note | null> {
  await pool.query(
    `UPDATE note SET "isArchived" = false, "updatedAt" = NOW() WHERE id = $1 AND "userId" = $2`,
    [id, userId]
  );
  return getNoteById(id, userId);
}

export async function addCategoryToNote(
  noteId: number,
  categoryId: number,
  userId: number
): Promise<Note | null> {
  const check = await pool.query(`SELECT id FROM note WHERE id = $1 AND "userId" = $2`, [noteId, userId]);
  if (!check.rows[0]) return null;

  await pool.query(
    `INSERT INTO note_categories_category ("noteId", "categoryId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [noteId, categoryId]
  );
  return getNoteById(noteId, userId);
}

export async function removeCategoryFromNote(
  noteId: number,
  categoryId: number,
  userId: number
): Promise<Note | null> {
  const check = await pool.query(`SELECT id FROM note WHERE id = $1 AND "userId" = $2`, [noteId, userId]);
  if (!check.rows[0]) return null;

  await pool.query(
    `DELETE FROM note_categories_category WHERE "noteId" = $1 AND "categoryId" = $2`,
    [noteId, categoryId]
  );
  return getNoteById(noteId, userId);
}

// Categories
export async function getCategories(userId: number): Promise<Category[]> {
  const result = await pool.query(
    `SELECT id, name FROM category WHERE "userId" = $1 ORDER BY name ASC`,
    [userId]
  );
  return result.rows;
}

export async function createCategory(name: string, userId: number): Promise<Category> {
  const result = await pool.query(
    `INSERT INTO category (name, "userId") VALUES ($1, $2) RETURNING id, name`,
    [name, userId]
  );
  return result.rows[0];
}

export async function deleteCategory(
  id: number,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  const usage = await pool.query(
    `SELECT COUNT(*) FROM note_categories_category WHERE "categoryId" = $1`,
    [id]
  );
  if (parseInt(usage.rows[0].count) > 0) {
    return { success: false, error: 'Cannot delete category that is assigned to notes' };
  }
  await pool.query(`DELETE FROM category WHERE id = $1 AND "userId" = $2`, [id, userId]);
  return { success: true };
}

// Users
export async function getUserByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  return result.rows[0] ?? null;
}

export async function createUser(email: string, hashedPassword: string) {
  const result = await pool.query(
    `INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING id, email`,
    [email, hashedPassword]
  );
  return result.rows[0];
}

export async function getUserByResetToken(token: string) {
  const result = await pool.query(
    `SELECT * FROM "user" WHERE "resetToken" = $1 AND "resetTokenExpiry" > NOW()`,
    [token]
  );
  return result.rows[0] ?? null;
}

export async function setResetToken(userId: number, token: string) {
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await pool.query(
    `UPDATE "user" SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3`,
    [token, expiry, userId]
  );
}

export async function resetUserPassword(userId: number, hashedPassword: string) {
  await pool.query(
    `UPDATE "user" SET password = $1, "resetToken" = NULL, "resetTokenExpiry" = NULL WHERE id = $2`,
    [hashedPassword, userId]
  );
}

export async function pingDatabase() {
  await pool.query('SELECT 1');
}
