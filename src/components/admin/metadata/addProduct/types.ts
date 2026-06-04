import type { CreateSuulineInput } from "@/src/lib/api/types";

export type MaterialValue = NonNullable<CreateSuulineInput["material"]>;
export type TuupValue = NonNullable<CreateSuulineInput["tuup1"]>;
export type RingTypeValue = NonNullable<CreateSuulineInput["ring_type"]>;
export type StaatusValue = NonNullable<CreateSuulineInput["staatus"]>;

export type AddProductFormValues = {
  nimi: string;
  suurus: string;
  paksus: string;
  materjal: MaterialValue | "";
  tuup: TuupValue | "";
  rongas: RingTypeValue | "";
  kirjeldus: string;
  rendihind: string;
  muugihind: string;
  saadavus: StaatusValue | "";
};

export type AddProductImagePayload = {
  uri?: string;
  base64?: string;
  mimeType?: string;
  originalName?: string;
};
