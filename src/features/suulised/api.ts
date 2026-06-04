export async function deleteAllSuulised() {
  const suulised = await getSuulised();
  for (const s of suulised) {
    await deleteSuuline(s.id);
  }
}
import { apiRequest } from "@/src/lib/api/http";
import type { CreateSuulineInput, Suuline } from "@/src/lib/api/types";

export function getSuulised() {
  return apiRequest<Suuline[]>("/suulised");
}

export function getSuulineById(id: number | string) {
  return apiRequest<Suuline>(`/suulised/${id}`);
}

export function createSuuline(input: CreateSuulineInput) {
  return apiRequest<Suuline>("/suulised", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteSuuline(id: number) {
  return apiRequest<{ success: boolean }>(`/suulised/${id}`, {
    method: "DELETE",
  });
}
