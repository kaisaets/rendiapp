export type Product = {
  id: string;
  title: string;
  kirjeldus: string;
  lisainfo?: string;
  lisainfo2?: string;
  sobivusTitle?: string;
  sobivusItems?: string[];
  detailListStyle?: "bullet" | "plain";
  infoLines?: string[];
  rating: number;
  image: number;
};

export const featureSteps = ["Vali", "Proovi", "Otsusta"];

export const products: Product[] = [
  {
    id: "1",
    title: "HUGO fixed rõngaga",
    kirjeldus: "Täisvarustus, pehme surve, turvaline kinnitus",
    sobivusTitle: "Sobivus:",
    sobivusItems: [
      "Ebaühtlane kontakt",
      "Pinges tavalise pulksuulisega",
      "Soovib suulist närida",
      "Proovib keelt üle suulise ajada",
    ],
    detailListStyle: "bullet",
    infoLines: ["Lisainfo:", "Suurus: 12.5cm", "Hind: 35 €/nädal"],
    rating: 5,
    image: require("@/assets/images/HugoF_angle-nobg.png"),
  },
  {
    id: "2",
    title: "HUGO fixed rõngaga",
    kirjeldus: "Täisvarustus, pehme surve, turvaline kinnitus",
    sobivusTitle: "Sobivus:",
    sobivusItems: [
      "Ebaühtlane kontakt",
      "Pinges tavalise pulksuulisega",
      "Soovib suulist närida",
      "Proovib keelt üle suulise ajada",
    ],
    detailListStyle: "bullet",
    infoLines: ["Lisainfo:", "Suurus: 12.5cm", "Hind: 35 €/nädal"],
    rating: 4.5,
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  },
  {
    id: "3",
    title: "HUGO fixed rõngaga",
    kirjeldus: "Täisvarustus, pehme surve, turvaline kinnitus",
    sobivusTitle: "Sobivus:",
    sobivusItems: [
      "Ebaühtlane kontakt",
      "Pinges tavalise pulksuulisega",
      "Soovib suulist närida",
      "Proovib keelt üle suulise ajada",
    ],
    detailListStyle: "bullet",
    infoLines: ["Lisainfo:", "Suurus: 12.5cm", "Hind: 35 €/nädal"],
    rating: 4.8,
    image: require("@/assets/images/HugoF_angle-nobg.png"),
  },
];
