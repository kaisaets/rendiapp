import { getDb } from "./database";

export class Suuline {
  static async findAll() {
    return await getDb().getAllAsync("SELECT * FROM suulised ORDER BY nimi");
  }

  static async findById(id) {
    return await getDb().getFirstAsync(
      "SELECT * FROM suulised WHERE id = ?",
      [id],
    );
  }

  static async findSaadaval() {
    return await getDb().getAllAsync(
      "SELECT * FROM suulised WHERE staatus = 'Saadaval' AND kogus_laos > 0 ORDER BY nimi",
    );
  }

  static async create(data) {
    const result = await getDb().runAsync(
      `INSERT INTO suulised (nimi, material, suurus, hind_paev, kogus_laos, kirjeldus, staatus, tuup)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nimi,
        data.material ?? null,
        data.suurus ?? null,
        data.hind_paev ?? null,
        data.kogus_laos ?? 1,
        data.kirjeldus ?? null,
        data.staatus ?? "Saadaval",
        data.tuup ?? null,
      ],
    );
    return result.lastInsertRowId;
  }

  static async update(id, data) {
    await getDb().runAsync(
      `UPDATE suulised SET
        nimi = COALESCE(?, nimi),
        material = COALESCE(?, material),
        suurus = COALESCE(?, suurus),
        hind_paev = COALESCE(?, hind_paev),
        kogus_laos = COALESCE(?, kogus_laos),
        kirjeldus = COALESCE(?, kirjeldus),
        staatus = COALESCE(?, staatus),
        tuup = COALESCE(?, tuup)
       WHERE id = ?`,
      [
        data.nimi ?? null,
        data.material ?? null,
        data.suurus ?? null,
        data.hind_paev ?? null,
        data.kogus_laos ?? null,
        data.kirjeldus ?? null,
        data.staatus ?? null,
        data.tuup ?? null,
        id,
      ],
    );
  }

  static async destroy(id) {
    await getDb().runAsync("DELETE FROM suulised WHERE id = ?", [id]);
  }
}
