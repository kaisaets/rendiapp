import { getRentimineStatusLabel } from "@/src/features/rentimised/status";
import type { Rentimine } from "@/src/lib/api/types";

export interface AdminOrderView {
  id: string;
  clientId: string;
  title: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  startDate: string;
  returnDate: string;
  total: string;
  image: number;
}

function formatDateEt(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("et-EE");
}

function formatEuro(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numeric =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return `${numeric.toFixed(2)} €`;
}

export function mapRentimineToAdminOrder(rentimine: Rentimine): AdminOrderView {
  const productName =
    rentimine.suuline?.nimi?.trim() || `Toode #${rentimine.suuline_id}`;
  const customerName =
    rentimine.kasutaja?.nimi?.trim() ||
    rentimine.kasutaja?.email ||
    `Klient #${rentimine.kasutaja_id}`;

  return {
    id: String(rentimine.id),
    clientId: String(rentimine.kasutaja_id),
    title: productName,
    customer: customerName,
    email: rentimine.kasutaja?.email || "-",
    phone: rentimine.kasutaja?.telefon || "Telefon puudub",
    address: "Aadress puudub",
    status: getRentimineStatusLabel(rentimine),
    startDate: formatDateEt(rentimine.algus_kuupaev),
    returnDate: formatDateEt(rentimine.lopp_kuupaev),
    total: formatEuro(rentimine.total_price),
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  };
}
