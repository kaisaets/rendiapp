import { getDb } from "./database";

export class Makse {
  static async findAll() {
    return await getDb().getAllAsync(
      "SELECT * FROM maksed ORDER BY makse_kuupaev DESC",
    );
  }

  static async findById(id) {
    return await getDb().getFirstAsync("SELECT * FROM maksed WHERE id = ?", [id]);
  }

  static async findByRentimine(rentimineId) {
    return await getDb().getAllAsync(
      "SELECT * FROM maksed WHERE rentimine_id = ? ORDER BY makse_kuupaev DESC",
      [rentimineId],
    );
  }

  static async create(data) {
    const result = await getDb().runAsync(
      `INSERT INTO maksed (rentimine_id, summa, makse_kuupaev, makse_viis, staatus, tehingu_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.rentimine_id,
        data.summa,
        data.makse_kuupaev ?? null,
        data.makse_viis ?? null,
        data.staatus ?? "ootel",
        data.tehingu_id ?? null,
      ],
    );
    return result.lastInsertRowId;
  }

  static async updateStaatus(id, staatus, tehingu_id) {
    await getDb().runAsync(
      `UPDATE maksed SET
        staatus = ?,
        tehingu_id = COALESCE(?, tehingu_id),
        makse_kuupaev = COALESCE(makse_kuupaev, CURRENT_DATE)
       WHERE id = ?`,
      [staatus, tehingu_id ?? null, id],
    );
  }
}
