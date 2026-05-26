# RendiApp

Mobiilirakendus hobuste suuliste rentimiseks/proovimiseks. Projekt on tehtud Expo + React Native + Expo Routeriga.

## Tehnoloogiad

- Expo SDK 54
- React Native 0.81
- TypeScript
- Expo Router (failipõhine navigeerimine)

## Eeldused

Enne käivitamist veendu, et masinas on:

- Node.js
- npm
- Expo Go rakendus telefonis

Soovi korral:

- Android Studio emulaatori jaoks
- Xcode (macOS) iOS simulaatori jaoks

## Kuidas tööle panna

1. Paigalda sõltuvused:

```bash
npm install
```

2. Käivita arendusserver:

```bash
npm run start
```

3. Ava rakendus:

- Terminalis vajuta a Androidi jaoks
- Terminalis vajuta i iOS simulaatori jaoks (ainult macOS)
- Terminalis vajuta w veebi jaoks
- Või skänni QR-kood Expo Go äpiga

## Kasulikud skriptid

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Projekti struktuur (lühidalt)

- app: route-id ja ekraanid
- app/index.tsx: avaleht
- app/pages/[id].tsx: toote dummy detail-leht
- src/components/home: avalehe komponendid (HeroBanner, ProductCard jne)
- src/components/home/homeData.ts: demo andmed

## Praegune kasutusvoog

1. Avalehel kuvatakse toodete kaardid.
2. Uuri lähemalt nupp viib detail-lehele.
3. Detail-lehel on nupp tagasi avalehele.
