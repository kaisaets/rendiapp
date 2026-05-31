import { isActiveRentimine } from "@/src/features/rentimised/status";
import { getKasutajaDetail } from "./api";

export async function getActiveRentalCount(
  kasutajaId: number,
): Promise<number> {
  const detail = await getKasutajaDetail(kasutajaId);
  const rentimised = detail.rentimised || [];
  return rentimised.filter(isActiveRentimine).length;
}
