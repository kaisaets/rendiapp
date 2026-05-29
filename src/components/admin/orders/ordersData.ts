import { ImageSourcePropType } from "react-native";

export type OrderStatus =
  | "Kliendile postitatud"
  | "Jaanud X paeva"
  | "Tellimus lopetatud";

export type Order = {
  id: string;
  title: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  status: OrderStatus;
  returnDate: string;
  total: string;
  image: ImageSourcePropType;
};

export const ORDERS: Order[] = [
  {
    id: "1",
    title: "Hugo Loose ring 12.5",
    customer: "Heli Kopter",
    email: "heli.kopter@voco.ee",
    phone: "+372 123 456 78",
    address: "Tartu Kaubamaja Omniva",
    status: "Kliendile postitatud",
    returnDate: "30.02.2026",
    total: "123.45 €",
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  },
  {
    id: "2",
    title: "Hugo Loose ring 11.5",
    customer: "Mati Maasikas",
    email: "mati.maasikas@voco.ee",
    phone: "+372 555 0101",
    address: "Tallinna Sikupilli Omniva",
    status: "Jaanud X paeva",
    returnDate: "05.03.2026",
    total: "98.00 €",
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  },
  {
    id: "3",
    title: "Hugo Fixed ring 12.5",
    customer: "Mari Maasikas",
    email: "mari.maasikas@voco.ee",
    phone: "+372 555 4343",
    address: "Viljandi Centrum Omniva",
    status: "Jaanud X paeva",
    returnDate: "09.03.2026",
    total: "111.90 €",
    image: require("@/assets/images/HugoF_angle-nobg.png"),
  },
  {
    id: "4",
    title: "Hugo Loose ring 12.5",
    customer: "Mari Maasikas",
    email: "mari.maasikas@voco.ee",
    phone: "+372 555 4343",
    address: "Tartu Lounakeskus Omniva",
    status: "Tellimus lopetatud",
    returnDate: "14.03.2026",
    total: "76.50 €",
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  },
];

export function getOrderById(id?: string) {
  return ORDERS.find((order) => order.id === id);
}
