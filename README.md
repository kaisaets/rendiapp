# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Käivitamine Dockeriga

Lihtsaim viis projekti käivitamiseks ilma Node.js lokaalselt installimata.

1. Klooni repo

   ```bash
   git clone <repo-url>
   cd rendiapp
   ```

2. Loo Dockeri keskkonnamuutujad

   Kopeeri näidisfail:

   ```bash
   cp .env.docker.example .env
   ```

3. Ehita ja käivita konteinerid

   ```bash
   docker compose up --build
   ```

   Edaspidistel käivitamistel piisab:

   ```bash
   docker compose up
   ```

4. Skanni terminalis kuvatav QR-kood **Expo Go** äpiga (telefon peab olema samas WiFi-võrgus)

MySQL tuleb nüüd samuti kaasa sama käsuga.

- MySQL host Docker võrgus: mysql
- MySQL port: 3306
- DB nimi/kasutaja/parool: loetakse .env failist

Konteineri peatamiseks:

```bash
docker compose down
```

Andmebaasi andmete nullimiseks:

```bash
docker compose down -v
```

---
