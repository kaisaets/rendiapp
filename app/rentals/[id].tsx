import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

const { width } = Dimensions.get('window');

export default function MyBits() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Captures the rental_id from the clicked card
    const [rentalItem, setRentalItem] = useState<any>(null);

    useEffect(() => {
        if (id === "99") {
            setRentalItem({
                rental_id: 99,
                name: "Kolmeosaline suuline",
                local_image: require("@/assets/images/HugoL_angle-nobg.png"),
                status: "müüdud", // Maps to 'müüdud' (Välja ostetud) or 'tagastatud'
                address: "Maakond, vald, linn, tänav, number",
                card_mask: "**** **** **** 1234"
            });
        } else {
            setRentalItem({
                rental_id: 101,
                name: "HUGO liikuva rõngaga",
                local_image: require("@/assets/images/HugoL_angle-nobg.png"),
                status: "rendis",
                days_left: 8
            });
        }
    }, [id]);

    if (!rentalItem) return null;
    const isCompleted = rentalItem.status === "müüdud" || rentalItem.status === "tagastatud";

    const handleBuyout = () => alert("Toode välja ostetud!");
    const handleReturn = () => router.push("/rentals/return");
    const handleDownloadReceipt = () => alert("Kviitungi allalaadimine käivitatud...");

    return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}
                bounces={false}
            >
                <View style={styles.goldHeader}>
                    <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{isCompleted ? "SUULINE" : "MINU RENDID"}</Text>
                    <View style={styles.headerSpacer} />
                </View>
                <View style={styles.content}>
                    <View style={styles.goldBorderImageCard}>
                        <Image
                            source={rentalItem.local_image}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.mainTitle}>{rentalItem.name}</Text>
                    {isCompleted && (
                    <Text style={styles.completedStatusBadge}>
                        {rentalItem.status === "müüdud" ? "Välja ostetud" : "Tagastatud"}
                    </Text>
                )}
                {!isCompleted ? (
                        <>
                            <View style={styles.statusCard}>
                                <Text style={styles.statusTitleText}>Prooviperiood käib</Text>
                                <Text style={styles.daysCounterText}>{`Jäänud ${rentalItem.days_left} päeva`}</Text>
                            </View>

                            <View style={styles.buttonStack}>
                                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={handleBuyout}>
                                    <Text style={styles.buttonText}>Sobib - osta välja!</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={handleReturn}>
                                    <Text style={styles.buttonText}>Ei sobi - tagasta!</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                        <View style={styles.metaDataBlock}>
                            <Text style={styles.metaDataLabel}>Tarneaadress</Text>
                            <View style={styles.metaDataBox}>
                                <Text style={styles.metaDataBoxValueText}>{rentalItem.address}</Text>
                            </View>
                        </View>

                        <View style={styles.metaDataBlock}>
                            <Text style={styles.metaDataLabel}>Makseviis</Text>
                            <View style={styles.metaDataBoxRow}>
                                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.metaDataBoxValueText}>{rentalItem.card_mask}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.receiptLinkButton} activeOpacity={0.6} onPress={handleDownloadReceipt}>
                            <Text style={styles.receiptLinkText}>Lae alla kviitung</Text>
                        </TouchableOpacity>
                        </>
                    )}                  
                </View>
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    goldHeader: { backgroundColor: '#CC9D36', height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#000000', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
    headerSpacer: { width: 40 },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 },
    goldBorderImageCard: { backgroundColor: '#0A0A0A', borderRadius: 44, borderWidth: 1.5, borderColor: '#CC9D36', width: '100%', height: width * 0.65, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    productImage: { width: '80%', height: '80%' },
    mainTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    completedStatusBadge: { color: '#4CD964', fontSize: 16, fontWeight: '600', alignSelf: 'flex-start', marginTop: 12, marginBottom: 24 },
    metaDataBlock: { width: '100%', marginBottom: 20 },
    metaDataLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '400', marginBottom: 10, alignSelf: 'flex-start' },
    metaDataBox: { backgroundColor: '#0A0A0A', borderRadius: 12, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', paddingVertical: 16, paddingHorizontal: 16 },
    metaDataBoxRow: { backgroundColor: '#0A0A0A', borderRadius: 12, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
    metaDataBoxValueText: { color: '#CCCCCC', fontSize: 14, fontWeight: '400' },
    receiptLinkButton: { marginTop: 40, padding: 10, width: '100%', alignItems: 'center' },
    receiptLinkText: { color: '#8E8E93', fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
    statusCard: { backgroundColor: '#EAEAEA', borderRadius: 20, width: '100%', paddingVertical: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 40 },
    statusTitleText: { color: '#1C1C1E', fontSize: 18, fontWeight: '600', marginBottom: 8 },
    daysCounterText: { color: '#8E8E93', fontSize: 14, fontWeight: '400' },
    buttonStack: { width: '100%', gap: 14 },
    actionButton: { backgroundColor: '#CC9D36', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', width: '100%' },
    buttonText: { color: '#000000', fontSize: 16, fontWeight: 'bold' }
});