import { getDb } from "./database";

export class Rentimine {
  static async findAll() {
    return await getDb().getAllAsync(
      "SELECT * FROM rentimised ORDER BY algus_kuupaev DESC",
    );
  }

  static async findById(id) {
    return await getDb().getFirstAsync(
      "SELECT * FROM rentimised WHERE id = ?",
      [id],
    );
  }

  static async findByKasutaja(kasutajaId) {
    return await getDb().getAllAsync(
      "SELECT * FROM rentimised WHERE kasutaja_id = ? ORDER BY algus_kuupaev DESC",
      [kasutajaId],
    );
  }

  static async findAktiivsed(kasutajaId) {
    return await getDb().getAllAsync(
      "SELECT * FROM rentimised WHERE kasutaja_id = ? AND staatus = 'aktiivne' ORDER BY algus_kuupaev DESC",
      [kasutajaId],
    );
  }

  static async create(data) {
    const result = await getDb().runAsync(
      `INSERT INTO rentimised (kasutaja_id, suuline_id, algus_kuupaev, lopp_kuupaev, staatus, kogus)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.kasutaja_id,
        data.suuline_id,
        data.algus_kuupaev,
        data.lopp_kuupaev ?? null,
        data.staatus ?? "aktiivne",
        data.kogus ?? 1,
      ],
    );
    return result.lastInsertRowId;
  }

  static async tagasta(id, lopp_kuupaev) {
    await getDb().runAsync(
      "UPDATE rentimised SET staatus = 'tagastatud', lopp_kuupaev = ? WHERE id = ?",
      [lopp_kuupaev, id],
    );
  }

  static async destroy(id) {
    await getDb().runAsync("DELETE FROM rentimised WHERE id = ?", [id]);
  }
}
