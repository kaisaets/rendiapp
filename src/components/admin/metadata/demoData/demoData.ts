// Demoandmete loomise utiliit
import { createKasutaja } from "@/src/features/kasutajad/api";
import { createRentimine } from "@/src/features/rentimised/api";
import { createSuuline } from "@/src/features/suulised/api";
import type {
    CreateKasutajaInput,
    CreateRentimineInput,
    CreateSuulineInput,
} from "@/src/lib/api/types";

export async function createDemoData() {
  // 1. Loo kliendid
  const clients = [
    { nimi: "Mari Maasikas", email: "mari@example.com", telefon: "5551111" },
    { nimi: "Jüri Õunapuu", email: "jyri@example.com", telefon: "5552222" },
    { nimi: "Kati Kask", email: "kati@example.com", telefon: "5553333" },
    { nimi: "Peeter Põld", email: "peeter@example.com", telefon: "5554444" },
  ];
  const clientIds: number[] = [];
  for (const c of clients) {
    const res = await createKasutaja(c as CreateKasutajaInput);
    clientIds.push(res.id);
  }

  // 2. Loo tooted
  const products = [
    {
      nimi: "Titanium bit",
      material: "Titanium",
      suurus: 12,
      hind_paev: 2,
      staatus: "Saadaval",
      tuup1: "kaheosaline",
    },
    {
      nimi: "Sweet iron snaffle",
      material: "Sweet iron",
      suurus: 13.5,
      hind_paev: 2.5,
      staatus: "Renditud",
      tuup1: "sirge",
    },
    {
      nimi: "Rubber pelham",
      material: "Rubber",
      suurus: 14,
      hind_paev: 3,
      staatus: "Saadaval",
      tuup1: "kolmeosaline",
    },
    {
      nimi: "Leather gag",
      material: "Leather",
      suurus: 13,
      hind_paev: 2,
      staatus: "Saadaval",
      tuup1: "lukustuv",
    },
    {
      nimi: "Stainless steel D ring",
      material: "Stainless steel",
      suurus: 12.5,
      hind_paev: 2,
      staatus: "Renditud",
      tuup1: "kaheosaline",
    },
    {
      nimi: "Sweet gold full cheek",
      material: "Sweet gold",
      suurus: 13,
      hind_paev: 2.5,
      staatus: "Saadaval",
      tuup1: "muu",
    },
    {
      nimi: "Kimblehook",
      material: "Stainless steel",
      suurus: 14,
      hind_paev: 3,
      staatus: "Saadaval",
      tuup1: "kaheosaline",
    },
  ];
  const productIds: number[] = [];
  for (const p of products) {
    const res = await createSuuline(p as CreateSuulineInput);
    productIds.push(res.id);
  }

  // 3. Loo tellimused
  const orders: CreateRentimineInput[] = [
    // Lõpetatud
    {
      kasutaja_id: clientIds[0],
      suuline_id: productIds[0],
      algus_kuupaev: "2024-01-01",
      lopp_kuupaev: "2024-01-10",
      staatus: "Lopetatud",
      total_price: 20,
      paid: true,
    },
    // Tagastatud
    {
      kasutaja_id: clientIds[1],
      suuline_id: productIds[1],
      algus_kuupaev: "2024-02-01",
      lopp_kuupaev: "2024-02-05",
      staatus: "Tagastatud",
      total_price: 12.5,
      paid: true,
    },
    // Maksmata
    {
      kasutaja_id: clientIds[2],
      suuline_id: productIds[2],
      algus_kuupaev: "2024-03-01",
      lopp_kuupaev: "2024-03-10",
      staatus: "Aktiivne",
      total_price: 27,
      paid: false,
    },
    // Maksmisel
    {
      kasutaja_id: clientIds[3],
      suuline_id: productIds[3],
      algus_kuupaev: "2024-04-01",
      lopp_kuupaev: null,
      staatus: "Aktiivne",
      total_price: 10,
      paid: null,
    },
    // Veel erinevaid
    {
      kasutaja_id: clientIds[0],
      suuline_id: productIds[4],
      algus_kuupaev: "2024-05-01",
      lopp_kuupaev: null,
      staatus: "Aktiivne",
      total_price: 15,
      paid: false,
    },
    {
      kasutaja_id: clientIds[1],
      suuline_id: productIds[5],
      algus_kuupaev: "2024-05-10",
      lopp_kuupaev: null,
      staatus: "Aktiivne",
      total_price: 20,
      paid: true,
    },
    {
      kasutaja_id: clientIds[2],
      suuline_id: productIds[6],
      algus_kuupaev: "2024-05-15",
      lopp_kuupaev: null,
      staatus: "Aktiivne",
      total_price: 18,
      paid: null,
    },
  ];
  for (const o of orders) {
    await createRentimine(o);
  }
}
