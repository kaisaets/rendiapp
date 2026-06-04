# Rendiapp

## 1) Esmane seadistus

Kopeeri MySQL keskkonnamuutujate näidisfail:

Windows PowerShell:

```powershell
Copy-Item .env.docker.example .env
```

Bash:

```bash
cp .env.docker.example .env
```

Muuda vajadusel .env väärtused:

- MYSQL_ROOT_PASSWORD
- MYSQL_DATABASE
- MYSQL_USER
- MYSQL_PASSWORD
- REACT_NATIVE_PACKAGER_HOSTNAME — **sinu arvuti LAN IP** (vajalik telefoni testимiseks)

Leia oma LAN IP:

Windows PowerShell:
```powershell
ipconfig | Select-String "IPv4"
```

Bash/Mac:
```bash
ipconfig getifaddr en0
```

Näide: `REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.42`

> Ilma selle muutujata töötab ainult veebibrauser. Telefoni Expo Go rakendus peab teadma sinu arvuti IP-d, et API päringud serverisse jõuaksid.

## 2) Dockeri ehitus ja käivitus

Esmakordsel käivitusel või peale suuremaid muudatusi:

````bash

```docker compose up -d --build

Edaspidi piisab:

```bash
docker compose up -d
````

Kontrollimiseks:

```bash
docker compose ps
```

Oodatud tulemus:

- mysql staatus on Up (healthy)
- app staatus on Up

Kõik andmed ja uuestikäivitamisel:

````bash

```docker compose down -v --remove-orphans

````

Ainult app käivitamine

```docker compose up -d --build --force-recreate app
```docker compose logs -f app

## 3) Expo QR-koodi vaatamine

Kui jooksutad detached reziimis (up -d), siis QR-kood kuvatakse logides:

```bash
docker compose logs -f app
```

## 4) MySQL CLI kasutamine

Interaktiivne CLI:

```bash
docker compose exec mysql mysql -uroot -p
```

Sisesta root parool .env failist.

## 5) Sequelize migratsioonid

Installi sõltuvused (kui vaja):

```bash
npm install
```

Käivita kõik migratsioonid:

```bash
npm run db:migrate
```

Võta viimane migratsioon tagasi:

```bash
npm run db:migrate:undo
```

Võta kõik migratsioonid tagasi:

```bash
npm run db:migrate:undo:all
```

Käivita konkreetse failini:

```bash
npx sequelize-cli db:migrate --to 20260527131000-create-kasutajad.cjs
```

## 6) Puhta seisundi reset (kui vana build segab)

```bash
docker compose down -v --remove-orphans
docker compose up -d --build
```

See eemaldab ka MySQL andmed.

## 7) Levinud vead

1. docker compose up annab vea

- Kontrolli, et Docker Desktop töötab
- Proovi puhas reset (eelmine punkt)

2. mysql konteiner restartib

- Vaata logi:

```bash
docker compose logs mysql --tail=200
```

- Tavaliselt on puudu MYSQL_ROOT_PASSWORD vms .env failis

3. SHOW TABLES annab Empty set

- Migratsioonid pole veel jooksnud
- Käivita npm run db:migrate
