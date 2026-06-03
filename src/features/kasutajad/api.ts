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
    SyncAuthenticatedKasutajaInput,
    UpdateKasutajaProfileInput,
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

export function syncAuthenticatedKasutaja(
  input: SyncAuthenticatedKasutajaInput,
) {
  return apiRequest<Kasutaja>("/kasutajad-sync", {
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

export function getKasutajaMeByClerkId(clerkId: string) {
  return apiRequest<Kasutaja>(
    `/kasutajad/me?clerk_id=${encodeURIComponent(clerkId)}`,
  );
}

export function updateKasutajaMeByClerkId(input: UpdateKasutajaProfileInput) {
  return apiRequest<Kasutaja>("/kasutajad/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
