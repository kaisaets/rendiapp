import { useAuth, useUser } from "@clerk/expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/indexStyles";

export default function Index() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "-";
  const kasutajanimi = user?.fullName || user?.username || "-";
  const kasutajaId = user?.id ?? "-";
  const googleKonto = user?.externalAccounts?.find(
    (account) => account.provider === "oauth_google",
  );
  const googleId = googleKonto?.providerUserId ?? "-";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pealkiri}>Authentication</Text>
        <View style={styles.headerRight}>
          <Text style={styles.kasutajaEmailTekst}>{email}</Text>
          <TouchableOpacity style={styles.logoutNupp} onPress={() => signOut()}>
            <Text style={styles.logoutNuppTekst}>Logi välja</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.kaart, styles.viimaneKaart]}>
        <Text style={styles.sektsiooniPealkiri}>Sisselogitud kasutaja</Text>
        <View style={styles.väljadGrid}>
          <View style={styles.väljaPool}>
            <Text style={styles.väljaSilt}>Nimi</Text>
            <Text style={styles.väljaVäärtus}>{kasutajanimi}</Text>
          </View>
          <View style={styles.väljaPool}>
            <Text style={styles.väljaSilt}>E-mail</Text>
            <Text style={styles.väljaVäärtus}>{email}</Text>
          </View>
          <View style={styles.väljaTäis}>
            <Text style={styles.väljaSilt}>Clerk ID</Text>
            <Text style={styles.väljaVäärtus}>{kasutajaId}</Text>
          </View>
          <View style={styles.väljaTäis}>
            <Text style={styles.väljaSilt}>Google ID</Text>
            <Text style={styles.väljaVäärtus}>{googleId}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
