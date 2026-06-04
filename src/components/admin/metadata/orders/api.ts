import { createRentimine } from "@/src/features/rentimised/api";
import type { CreateRentimineInput } from "@/src/lib/api/types";

export async function createMetadataOrder(input: CreateRentimineInput) {
  return createRentimine(input);
}
