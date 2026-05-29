export type ClientStatus =
  | "Aktiivne"
  | "Ootel"
  | "Tagastatud"
  | "Lopetatud"
  | "Puudub";

export type Client = {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: ClientStatus;
  statusInfo: string;
  activeRentals: ClientRental[];
  completedRentals: ClientRental[];
};

export type ClientRental = {
  id: string;
  title: string;
  subtitle: string;
  image: number;
};

export const CLIENTS: Client[] = [
  {
    id: "1",
    name: "Heli Kopter",
    phone: "555 555 555",
    address: "Helimaa 12, Tartu, 55555, Eesti",
    status: "Aktiivne",
    statusInfo: "Makse lopp\n30.06.2026",
    activeRentals: [
      {
        id: "1-a",
        title: "HUGO liikuv o-rongaga",
        subtitle: "Jaanud X paeva",
        image: require("@/assets/images/HugoL_angle-nobg.png"),
      },
    ],
    completedRentals: [
      {
        id: "1-c",
        title: "HUGO liikuv o-rongaga",
        subtitle: "Jaanud X paeva",
        image: require("@/assets/images/HugoF_angle-nobg.png"),
      },
    ],
  },
  {
    id: "2",
    name: "Mari Maasikas",
    phone: "5656 5656 5656",
    address: "Maasikamoa 12-2, Tallinn, 12345, Eesti",
    status: "Ootel",
    statusInfo: "Tellimus 10.06.2026",
    activeRentals: [
      {
        id: "2-a",
        title: "HUGO fixed rongaga",
        subtitle: "Jaanud X paeva",
        image: require("@/assets/images/HugoF_angle-nobg.png"),
      },
    ],
    completedRentals: [],
  },
  {
    id: "3",
    name: "Mati Mustikas",
    phone: "1234 123 1234",
    address: "Mustika 13, Otepaa, 54321, Eesti",
    status: "Tagastatud",
    statusInfo: "Viimane tagastus\n20.05.2026",
    activeRentals: [],
    completedRentals: [
      {
        id: "3-c",
        title: "HUGO liikuv o-rongaga",
        subtitle: "Tagastatud",
        image: require("@/assets/images/HugoL_angle-nobg.png"),
      },
    ],
  },
  {
    id: "4",
    name: "Polke Kiir",
    phone: "1234 6543 1234",
    address: "Pakase tee 12-6, Paide, 12345, Eesti",
    status: "Lopetatud",
    statusInfo: "Viimane tellimus\n20.05.2026",
    activeRentals: [],
    completedRentals: [
      {
        id: "4-c",
        title: "HUGO fixed rongaga",
        subtitle: "Lopetatud",
        image: require("@/assets/images/HugoF_angle-nobg.png"),
      },
    ],
  },
  {
    id: "5",
    name: "Selge Paev",
    phone: "5678 6789 5678",
    address: "Selge 7B, Alatskivi, 76542, Eesti",
    status: "Puudub",
    statusInfo: "",
    activeRentals: [],
    completedRentals: [],
  },
];

export function getClientById(id?: string) {
  return CLIENTS.find((client) => client.id === id);
}
