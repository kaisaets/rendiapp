export async function deleteAllKasutajad() {
  const kasutajad = await getKasutajad();
  for (const k of kasutajad) {
    await deleteKasutaja(k.id);
  }
}
import { apiRequest } from "@/src/lib/api/http";
import type {
    CreateKasutajaInput,
    Kasutaja,
    KasutajaDetail,
} from "@/src/lib/api/types";

export function getKasutajad() {
  return apiRequest<Kasutaja[]>("/kasutajad");
}

export function createKasutaja(input: CreateKasutajaInput) {
  return apiRequest<Kasutaja>("/kasutajad", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getKasutajaDetail(id: number) {
  return apiRequest<KasutajaDetail>(`/kasutajad/${id}`);
}

export function deleteKasutaja(id: number) {
  return apiRequest<{ success: boolean }>(`/kasutajad/${id}`, {
    method: "DELETE",
  });
}
