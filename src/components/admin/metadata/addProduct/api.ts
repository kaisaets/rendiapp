import { createSuuline } from "@/src/features/suulised/api";
import type { CreateSuulineInput } from "@/src/lib/api/types";

export async function createMetadataProduct(input: CreateSuulineInput) {
  return createSuuline(input);
}
