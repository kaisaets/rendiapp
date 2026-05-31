import type { Rentimine } from "@/src/lib/api/types";

const RETURNED_STATUS_PATTERN = /tagastatud|returned/i;

function hasEndedByDate(rentimine: Rentimine, now = new Date()) {
  if (!rentimine.lopp_kuupaev) {
    return false;
  }

  const endDate = new Date(rentimine.lopp_kuupaev);
  return !Number.isNaN(endDate.getTime()) && endDate.getTime() < now.getTime();
}

export function isReturnedRentimine(rentimine: Rentimine) {
  const statusText = String(rentimine.staatus ?? "").trim();
  return RETURNED_STATUS_PATTERN.test(statusText);
}

export function isCompletedRentimine(rentimine: Rentimine, now = new Date()) {
  return isReturnedRentimine(rentimine) || hasEndedByDate(rentimine, now);
}

export function isActiveRentimine(rentimine: Rentimine, now = new Date()) {
  return !isCompletedRentimine(rentimine, now);
}

export function isPendingPaymentRentimine(
  rentimine: Rentimine,
  now = new Date(),
) {
  return isActiveRentimine(rentimine, now) && rentimine.paid !== true;
}

export function getRentimineStatusLabel(
  rentimine: Rentimine,
  now = new Date(),
) {
  if (isReturnedRentimine(rentimine)) {
    return "Tagastatud";
  }

  if (isCompletedRentimine(rentimine, now)) {
    return "Lõpetatud";
  }

  return "Aktiivne";
}
