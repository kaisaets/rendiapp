import { Platform } from "react-native";
import { openDatabaseSync } from "expo-sqlite";

let db = null;

export function getDb() {
  if (!db && Platform.OS !== "web") {
    db = openDatabaseSync("rendiapp.db");
  }
  return db;
}

export async function initDatabase() {
  const db = getDb();
  if (!db) return;
  await db.execAsync("PRAGMA journal_mode = WAL;");
  await db.execAsync("PRAGMA foreign_keys = ON;");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS kasutajad (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id VARCHAR(100) UNIQUE,
      email VARCHAR(100) UNIQUE NOT NULL,
      nimi VARCHAR(100),
      telefon VARCHAR(20),
      roll TEXT NOT NULL DEFAULT 'kasutaja' CHECK(roll IN ('admin', 'kasutaja')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS suulised (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi VARCHAR(100) NOT NULL,
      material VARCHAR(50),
      suurus VARCHAR(20),
      hind_paev DECIMAL(6,2),
      kogus_laos INTEGER DEFAULT 0,
      kirjeldus TEXT,
      staatus TEXT NOT NULL DEFAULT 'Saadaval' CHECK(staatus IN ('Saadaval', 'Renditud')),
      tuup TEXT CHECK(tuup IN ('kaheosaline', 'kolmeosaline', 'sirge'))
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS rentimised (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kasutaja_id INTEGER NOT NULL,
      suuline_id INTEGER NOT NULL,
      algus_kuupaev DATE NOT NULL,
      lopp_kuupaev DATE,
      staatus VARCHAR(30) NOT NULL DEFAULT 'aktiivne',
      kogus INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (kasutaja_id) REFERENCES kasutajad(id),
      FOREIGN KEY (suuline_id) REFERENCES suulised(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS maksed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rentimine_id INTEGER NOT NULL,
      summa DECIMAL(10,2) NOT NULL,
      makse_kuupaev DATE,
      makse_viis TEXT,
      staatus TEXT NOT NULL DEFAULT 'ootel',
      tehingu_id TEXT,
      FOREIGN KEY (rentimine_id) REFERENCES rentimised(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ladu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suuline_id INTEGER NOT NULL UNIQUE,
      kogus_laos INTEGER NOT NULL DEFAULT 0,
      viimati_uuendatud DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (suuline_id) REFERENCES suulised(id)
    );
  `);
}

