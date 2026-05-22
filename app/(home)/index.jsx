import { useAuth, useUser } from "@clerk/expo";
import { useCallback, useEffect, useState } from "react";
import { Kasutaja } from "../../model/KasutajaModel";
import { Suuline } from "../../model/SuulineModel";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/indexStyles";

export default function Index() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [suulised, setSuulised] = useState([]);
  const [kasutajad, setKasutajad] = useState([]);

  // Suuline vorm
  const [nimi, setNimi] = useState("");
  const [material, setMaterial] = useState("");
  const [suurus, setSuurus] = useState("");
  const [hind, setHind] = useState("");
  const [kogus, setKogus] = useState("1");
  const [kirjeldus, setKirjeldus] = useState("");
  const [tuup, setTuup] = useState(null);
  const [viga, setViga] = useState(null);

  // Kasutaja vorm
  const [kasutajaEmail, setKasutajaEmail] = useState("");
  const [kasutajaNimi, setKasutajaNimi] = useState("");
  const [kasutajaTelefon, setKasutajaTelefon] = useState("");

  const laadiAndmed = useCallback(async () => {
    try {
      setSuulised(await Suuline.findAll());
      setKasutajad(await Kasutaja.findAll());
      setViga(null);
    } catch {
      setViga("Andmete laadimine ebaõnnestus.");
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      laadiAndmed();
    }
  }, [laadiAndmed]);

  if (Platform.OS === "web") {
    return (
      <View style={styles.webHoiatus}>
        <Text style={styles.webHoiatusIkoon}>📱</Text>
        <Text style={styles.webHoiatusPealkiri}>
          Andmebaas pole veebis saadaval
        </Text>
        <Text style={styles.webHoiatusTekst}>
          SQLite töötab ainult mobiilseadmetes.{"\n"}
          Käivita rakendus Android või iOS platvormil.
        </Text>
        <Text style={styles.webHoiatusKood}>npx expo start --android</Text>
      </View>
    );
  }

  async function lisaUusSuuline() {
    if (!nimi.trim()) {
      Alert.alert("Viga", "Palun sisesta suulise nimi.");
      return;
    }
    const hindArv = hind ? parseFloat(hind) : null;
    if (hind && isNaN(hindArv)) {
      Alert.alert("Viga", "Hind peab olema number.");
      return;
    }
    try {
      await Suuline.create({
        nimi: nimi.trim(),
        material: material.trim() || null,
        suurus: suurus.trim() || null,
        hind_paev: hindArv,
        kogus_laos: kogus ? parseInt(kogus, 10) : 1,
        kirjeldus: kirjeldus.trim() || null,
        staatus: "Saadaval",
        tuup: tuup,
      });
      setNimi("");
      setMaterial("");
      setSuurus("");
      setHind("");
      setKogus("1");
      setKirjeldus("");
      setTuup(null);
      await laadiAndmed();
    } catch {
      Alert.alert("Viga", "Suulise lisamine ebaõnnestus.");
    }
  }

  async function lisaUusKasutaja() {
    if (!kasutajaEmail.trim()) {
      Alert.alert("Viga", "Palun sisesta e-mail.");
      return;
    }
    try {
      await Kasutaja.create({
        google_id: null,
        email: kasutajaEmail.trim(),
        nimi: kasutajaNimi.trim() || null,
        telefon: kasutajaTelefon.trim() || null,
        roll: "kasutaja",
      });
      setKasutajaEmail("");
      setKasutajaNimi("");
      setKasutajaTelefon("");
      await laadiAndmed();
    } catch {
      Alert.alert("Viga", "Kasutaja lisamine ebaõnnestus.");
    }
  }

  function kustutaSuuline(id) {
    Alert.alert("Kustuta suuline", "Kas oled kindel?", [
      { text: "Tühista", style: "cancel" },
      {
        text: "Kustuta",
        style: "destructive",
        onPress: async () => {
          await Suuline.destroy(id);
          await laadiAndmed();
        },
      },
    ]);
  }

  function kustutaKasutaja(id) {
    Alert.alert("Kustuta kasutaja", "Kas oled kindel?", [
      { text: "Tühista", style: "cancel" },
      {
        text: "Kustuta",
        style: "destructive",
        onPress: async () => {
          await Kasutaja.destroy(id);
          await laadiAndmed();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pealkiri}>Andmebaasi test</Text>
        <View style={styles.headerRight}>
          {user?.primaryEmailAddress && (
            <Text style={styles.kasutajaEmailTekst}>
              {user.primaryEmailAddress.emailAddress}
            </Text>
          )}
          <TouchableOpacity style={styles.logoutNupp} onPress={() => signOut()}>
            <Text style={styles.logoutNuppTekst}>Logi välja</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viga && (
        <View style={styles.veaTeade}>
          <Text style={styles.veaTekst}>{viga}</Text>
        </View>
      )}

      {/* Suulise lisamine */}
      <View style={styles.kaart}>
        <Text style={styles.sektsiooniPealkiri}>Lisa suuline</Text>
        <TextInput
          style={styles.sisend}
          placeholder="Nimi *"
          value={nimi}
          onChangeText={setNimi}
        />
        <TextInput
          style={styles.sisend}
          placeholder="Materjal (nt. roostevaba teras)"
          value={material}
          onChangeText={setMaterial}
        />
        <TextInput
          style={styles.sisend}
          placeholder="Suurus (nt. 125mm)"
          value={suurus}
          onChangeText={setSuurus}
        />
        <TextInput
          style={styles.sisend}
          placeholder="Hind päevas (€)"
          value={hind}
          onChangeText={setHind}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.sisend}
          placeholder="Kogus laos"
          value={kogus}
          onChangeText={setKogus}
          keyboardType="number-pad"
        />
        <Text style={styles.valikSilt}>Tüüp</Text>
        <View style={styles.valikRida}>
          {[null, "kaheosaline", "kolmeosaline", "sirge"].map((v) => (
            <TouchableOpacity
              key={String(v)}
              style={[styles.valikNupp, tuup === v && styles.valikNuppAktiivne]}
              onPress={() => setTuup(v)}
            >
              <Text
                style={[
                  styles.valikNuppTekst,
                  tuup === v && styles.valikNuppTekstAktiivne,
                ]}
              >
                {v ?? "—"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.sisend, styles.sisendMultiline]}
          placeholder="Kirjeldus"
          value={kirjeldus}
          onChangeText={setKirjeldus}
          multiline
        />
        <TouchableOpacity style={styles.nupp} onPress={lisaUusSuuline}>
          <Text style={styles.nuppTekst}>Lisa andmebaasi</Text>
        </TouchableOpacity>
      </View>

      {/* Suulised loend */}
      <View style={styles.kaart}>
        <Text style={styles.sektsiooniPealkiri}>
          Suulised andmebaasis ({suulised.length})
        </Text>
        {suulised.length === 0 ? (
          <Text style={styles.tühi}>Ühtegi suulist pole lisatud.</Text>
        ) : (
          suulised.map((s) => (
            <View key={s.id} style={styles.kaardirida}>
              <View style={styles.kaardirida_päis}>
                <Text style={styles.ridaNimi}>
                  #{s.id} — {s.nimi}
                </Text>
                <TouchableOpacity
                  style={styles.kustutaNupp}
                  onPress={() => kustutaSuuline(s.id)}
                >
                  <Text style={styles.kustutaTekst}>Kustuta</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.väljadGrid}>
                <Väli silt="Materjal" väärtus={s.material} />
                <Väli silt="Suurus" väärtus={s.suurus} />
                <Väli
                  silt="Hind/päev"
                  väärtus={s.hind_paev ? `${s.hind_paev} €` : null}
                />
                <Väli silt="Kogus laos" väärtus={String(s.kogus_laos)} />
                <Väli silt="Tüüp" väärtus={s.tuup} />
                <View style={styles.väljaTäis}>
                  <Text style={styles.väljaSilt}>Staatus</Text>
                  <Text
                    style={
                      s.staatus === "Saadaval"
                        ? styles.saadaval
                        : styles.renditud
                    }
                  >
                    {s.staatus}
                  </Text>
                </View>
                {s.kirjeldus ? (
                  <View style={styles.väljaTäis}>
                    <Text style={styles.väljaSilt}>Kirjeldus</Text>
                    <Text style={styles.väljaVäärtus}>{s.kirjeldus}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Kasutaja lisamine */}
      <View style={styles.kaart}>
        <Text style={styles.sektsiooniPealkiri}>Lisa kasutaja</Text>
        <TextInput
          style={styles.sisend}
          placeholder="E-mail *"
          value={kasutajaEmail}
          onChangeText={setKasutajaEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.sisend}
          placeholder="Nimi"
          value={kasutajaNimi}
          onChangeText={setKasutajaNimi}
        />
        <TextInput
          style={styles.sisend}
          placeholder="Telefon"
          value={kasutajaTelefon}
          onChangeText={setKasutajaTelefon}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.nupp} onPress={lisaUusKasutaja}>
          <Text style={styles.nuppTekst}>Lisa andmebaasi</Text>
        </TouchableOpacity>
      </View>

      {/* Kasutajate loend */}
      <View style={[styles.kaart, styles.viimaneKaart]}>
        <Text style={styles.sektsiooniPealkiri}>
          Kasutajad andmebaasis ({kasutajad.length})
        </Text>
        {kasutajad.length === 0 ? (
          <Text style={styles.tühi}>Ühtegi kasutajat pole lisatud.</Text>
        ) : (
          kasutajad.map((k) => (
            <View key={k.id} style={styles.kaardirida}>
              <View style={styles.kaardirida_päis}>
                <Text style={styles.ridaNimi}>
                  #{k.id} — {k.email}
                </Text>
                <TouchableOpacity
                  style={styles.kustutaNupp}
                  onPress={() => kustutaKasutaja(k.id)}
                >
                  <Text style={styles.kustutaTekst}>Kustuta</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.väljadGrid}>
                <Väli silt="Nimi" väärtus={k.nimi} />
                <Väli silt="Telefon" väärtus={k.telefon} />
                <Väli silt="Google ID" väärtus={k.google_id} />
                <View style={styles.väljaPool}>
                  <Text style={styles.väljaSilt}>Roll</Text>
                  <Text style={styles.roll}>{k.roll}</Text>
                </View>
                <Väli silt="Loodud" väärtus={k.created_at} />
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function Väli({ silt, väärtus }) {
  return (
    <View style={styles.väljaPool}>
      <Text style={styles.väljaSilt}>{silt}</Text>
      <Text style={styles.väljaVäärtus}>{väärtus ?? "—"}</Text>
    </View>
  );
}
