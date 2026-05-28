import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from '@/src/components/Navbar';

///mock data
// SELECT * FROM rentals INNER JOIN bits ON ... WHERE user_id = current_user
const mockUserRentalsFromDB = [
    {
        rental_id: 101,
        name: "HUGO liikuva rõngaga",
        local_image: require("@/assets/images/HugoL_angle-nobg.png"),
        status: "rendis",
        end_date: "2026-06-05",
        days_left: 8
    },
    {
        rental_id: 99,
        name: "HUGO liikuva rõngaga",
        local_image: require("@/assets/images/HugoL_angle-nobg.png"),
        status: "tagastatud",
        end_date: "2026-04-12",
        days_left: 0
    }
];

export default function MyRentals() {

    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState("rentals");

    //filtering rentals
    const activeRentals = mockUserRentalsFromDB.filter(
        item => item.status === 'rendis' || item.status === 'töötlemisel' || item.status === 'kullerfirma käes'
    );
    const completedRentals = mockUserRentalsFromDB.filter(
        item => item.status === 'tagastatud' || item.status === 'müüdud'
    );

    const RentalCard = ({ item }: { item: typeof mockUserRentalsFromDB[0] }) => (
        <TouchableOpacity style={styles.rentalCard} activeOpacity={0.8}>
            <View style={styles.cardImageContainer}>
                {/* Updated source prop to seamlessly render your local photo asset */}
                <Image
                    source={item.local_image}
                    style={styles.cardImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.cardInfoContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.daysText}>
                    {item.status === 'rendis' ? `Jäänud ${item.days_left} päeva` : 'Rendiaeg lõppenud'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" style={styles.arrowIcon} />
        </TouchableOpacity>
    );
    return (
        <>
            <View style={[styles.container, { paddingTop: insets.top }]}>

                <View style={styles.goldHeader}>
                    <Text style={styles.headerTitle}>MINU RENDID</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionHeader}>Aktiivsed</Text>
                    {activeRentals.length > 0 ? (
                        activeRentals.map(rental => <RentalCard key={rental.rental_id} item={rental} />)
                    ) : (
                        <Text style={styles.emptyText}>Sul pole hetkel ühtegi aktiivset renti.</Text>
                    )}

                    <Text style={styles.sectionHeader}>Lõpetatud</Text>
                    {completedRentals.length > 0 ? (
                        completedRentals.map(rental => <RentalCard key={rental.rental_id} item={rental} />)
                    ) : (
                        <Text style={styles.emptyText}>Ajalugu on tühi.</Text>
                    )}
                </ScrollView>

                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },

    goldHeader: {
        backgroundColor: '#CC9D36',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4
    },
    headerTitle: { color: '#000000', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },

    scrollContainer: { padding: 16, paddingBottom: 100 },
    sectionHeader: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
    emptyText: { color: '#8E8E93', fontSize: 14, fontStyle: 'italic', marginBottom: 16 },

    rentalCard: {
        flexDirection: 'row',
        backgroundColor: '#0A0A0A',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        height: 90,
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden'
    },
    cardImageContainer: {
        width: 100,
        height: '100%',
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#FFFFFF'
    },
    cardImage: { width: '85%', height: '85%' },
    cardInfoContainer: { flex: 1, paddingLeft: 14, justifyContent: 'center' },
    productName: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
    daysText: { color: '#8E8E93', fontSize: 12, marginTop: 12 },
    arrowIcon: { paddingHorizontal: 14 },

    bottomNavWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    navBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#846226',
        width: '100%',
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 5,
    },
    navTab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    activeNavTab: {
        backgroundColor: '#CC9D36',
        opacity: 1
    }
})