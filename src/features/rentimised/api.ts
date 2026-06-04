import { apiRequest } from "@/src/lib/api/http";
import type { CreateRentimineInput, Rentimine } from "@/src/lib/api/types";

export async function deleteAllRentimised() {
  const rentimised = await getRentimised();
  for (const r of rentimised) {
    await apiRequest<{ success: boolean }>(`/rentimised/${r.id}`, {
      method: "DELETE",
    });
  }
}

export function getRentimised() {
  return apiRequest<Rentimine[]>("/rentimised");
}

export function getRentimisedByKasutajaId(kasutajaId: number | string) {
  const query = new URLSearchParams({
    kasutaja_id: String(kasutajaId),
  }).toString();

  return apiRequest<Rentimine[]>(`/rentimised?${query}`);
}

export function getRentimineById(id: number | string) {
  return apiRequest<Rentimine>(`/rentimised/${id}`);
}

export function createRentimine(input: CreateRentimineInput) {
  return apiRequest<Rentimine>("/rentimised", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
