import type {
    AddProductFormValues,
    MaterialValue,
    RingTypeValue,
    StaatusValue,
    TuupValue,
} from "./types";

export const MATERJAL_OPTIONS: MaterialValue[] = [
  "Sweet iron",
  "Titanium",
  "Sweet gold",
  "Rubber",
  "Leather",
  "Stainless steel",
];

export const TUUP_OPTIONS: TuupValue[] = [
  "kaheosaline",
  "kolmeosaline",
  "sirge",
  "lukustuv",
  "muu",
];

export const RONGAS_OPTIONS: RingTypeValue[] = [
  "loose ring",
  "fixed ring",
  "full cheek",
  "baucher",
  "D ring",
  "gag",
  "Pelham",
];

export const SAADAVUS_OPTIONS: StaatusValue[] = ["Saadaval", "Renditud"];

export const INITIAL_FORM_VALUES: AddProductFormValues = {
  nimi: "",
  suurus: "",
  paksus: "",
  materjal: "",
  tuup: "",
  rongas: "",
  kirjeldus: "",
  rendihind: "",
  muugihind: "",
  saadavus: "",
};
