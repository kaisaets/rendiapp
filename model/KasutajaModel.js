import { getDb } from "./database";

export class Kasutaja {
  static async findAll() {
    return await getDb().getAllAsync(
      "SELECT * FROM kasutajad ORDER BY created_at DESC",
    );
  }

  static async findById(id) {
    return await getDb().getFirstAsync(
      "SELECT * FROM kasutajad WHERE id = ?",
      [id],
    );
  }

  static async findByEmail(email) {
    return await getDb().getFirstAsync(
      "SELECT * FROM kasutajad WHERE email = ?",
      [email],
    );
  }

  static async findByGoogleId(googleId) {
    return await getDb().getFirstAsync(
      "SELECT * FROM kasutajad WHERE google_id = ?",
      [googleId],
    );
  }

  static async create(data) {
    const result = await getDb().runAsync(
      "INSERT INTO kasutajad (google_id, email, nimi, telefon, roll) VALUES (?, ?, ?, ?, ?)",
      [
        data.google_id ?? null,
        data.email,
        data.nimi ?? null,
        data.telefon ?? null,
        data.roll ?? "kasutaja",
      ],
    );
    return result.lastInsertRowId;
  }

  static async update(id, data) {
    await getDb().runAsync(
      `UPDATE kasutajad SET
        nimi = COALESCE(?, nimi),
        telefon = COALESCE(?, telefon),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [data.nimi ?? null, data.telefon ?? null, id],
    );
  }

  static async destroy(id) {
    await getDb().runAsync("DELETE FROM kasutajad WHERE id = ?", [id]);
  }
}
