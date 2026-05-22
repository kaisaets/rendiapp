import { getDb } from "./database";

export class Ladu {
  static async findAll() {
    return await getDb().getAllAsync(
      "SELECT * FROM ladu ORDER BY viimati_uuendatud DESC",
    );
  }

  static async findBySuuline(suulineId) {
    return await getDb().getFirstAsync(
      "SELECT * FROM ladu WHERE suuline_id = ?",
      [suulineId],
    );
  }

  static async upsert(suulineId, kogus_laos) {
    await getDb().runAsync(
      `INSERT INTO ladu (suuline_id, kogus_laos, viimati_uuendatud)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(suuline_id) DO UPDATE SET
         kogus_laos = excluded.kogus_laos,
         viimati_uuendatud = CURRENT_TIMESTAMP`,
      [suulineId, kogus_laos],
    );
  }

  static async vahenda(suulineId, kogus) {
    await getDb().runAsync(
      `UPDATE ladu SET kogus_laos = kogus_laos - ?, viimati_uuendatud = CURRENT_TIMESTAMP
       WHERE suuline_id = ? AND kogus_laos >= ?`,
      [kogus, suulineId, kogus],
    );
  }

  static async suurenda(suulineId, kogus) {
    await getDb().runAsync(
      `UPDATE ladu SET kogus_laos = kogus_laos + ?, viimati_uuendatud = CURRENT_TIMESTAMP
       WHERE suuline_id = ?`,
      [kogus, suulineId],
    );
  }
}
