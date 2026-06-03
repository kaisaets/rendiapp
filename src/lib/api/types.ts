export interface Kasutaja {
  id: number;
  google_id?: string | null;
  clerk_id?: string | null;
  email: string;
  nimi?: string | null;
  telefon?: string | null;
  roll: "admin" | "kasutaja";
  created_at?: string;
  updated_at?: string;
}

export interface CreateKasutajaInput {
  email: string;
  nimi?: string | null;
  telefon?: string | null;
}

export interface KasutajaRentimine {
  id: number;
  kasutaja_id: number;
  suuline_id: number;
  algus_kuupaev: string;
  lopp_kuupaev?: string | null;
  staatus?: string | null;
  total_price?: string | number | null;
  paid?: boolean | null;
  suuline?: Suuline | null;
}

export interface KasutajaDetail extends Kasutaja {
  rentimised?: KasutajaRentimine[];
}

export interface Rentimine {
  id: number;
  kasutaja_id: number;
  suuline_id: number;
  algus_kuupaev: string;
  lopp_kuupaev?: string | null;
  staatus?: string | null;
  total_price?: string | number | null;
  paid?: boolean | null;
  kasutaja?: Kasutaja | null;
  suuline?: Suuline | null;
}

export interface CreateRentimineInput {
  kasutaja_id: number;
  suuline_id: number;
  algus_kuupaev: string;
  lopp_kuupaev?: string | null;
  staatus?: string | null;
  total_price?: number | null;
  paid?: boolean | null;
}

export interface Suuline {
  id: number;
  nimi: string;
  material?:
    | "Sweet iron"
    | "Titanium"
    | "Sweet gold"
    | "Rubber"
    | "Leather"
    | "Stainless steel"
    | null;
  suurus?: number | null;
  hind_paev?: string | number | null;
  kirjeldus?: string | null;
  staatus?: "Saadaval" | "Renditud";
  tuup1?: "kaheosaline" | "kolmeosaline" | "sirge" | "lukustuv" | "muu" | null;
  ring_type?:
    | "baby fulmer"
    | "loose ring"
    | "fixed ring"
    | "full cheek"
    | "baucher"
    | "D ring"
    | "beval"
    | "gag"
    | "islandic shank"
    | "Kimblehook"
    | "Pelham"
    | "2.5 rings"
    | null;
  thickness?: number | null;
  buyout_price?: number | null;
  image_path?: string | null;
  image_filename?: string | null;
}

export interface CreateSuulineInput {
  nimi: string;
  material?: Suuline["material"];
  suurus?: number | null;
  hind_paev?: number | null;
  kirjeldus?: string | null;
  staatus?: Suuline["staatus"];
  tuup1?: Suuline["tuup1"];
  ring_type?: Suuline["ring_type"];
  thickness?: number | null;
  buyout_price?: number | null;
  image_path?: string | null;
  image_filename?: string | null;
  image_base64?: string;
  image_mime_type?: string;
  image_original_name?: string;
}
