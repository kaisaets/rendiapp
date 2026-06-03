import { deleteAllKasutajad } from "@/src/features/kasutajad/api";
import { deleteAllRentimised } from "@/src/features/rentimised/api";
import { deleteAllSuulised } from "@/src/features/suulised/api";

export async function deleteAllData() {
  await deleteAllRentimised();
  await deleteAllSuulised();
  await deleteAllKasutajad();
}
