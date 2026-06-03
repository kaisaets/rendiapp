import { createKasutaja } from "@/src/features/kasutajad/api";
import type { CreateKasutajaInput } from "@/src/lib/api/types";

export async function createMetadataClient(input: CreateKasutajaInput) {
  return createKasutaja(input);
}
