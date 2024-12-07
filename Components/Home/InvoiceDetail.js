import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, ScrollView, Linking, Dimensions } from 'react-native';
import React, { useState } from 'react';
import ImageView from 'react-native-image-viewing';
import config from '../../config';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import configimage from '../../configimage';

const SCREEN_WIDTH = Dimensions.get('window').width;

const InvoiceDetail = ({ route }) => {
    const { invoice } = route.params;
    const [visible, setIsVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [designImages, setDesignImages] = useState(JSON.parse(invoice.designImages).map(image => ({ uri: `${configimage.BASE_URL}${image}` })));
    const [receiptImages, setReceiptImages] = useState(JSON.parse(invoice.receiptImages).map(image => ({ uri: `${configimage.BASE_URL}${image}` })));
    const invoiceID = invoice.id;
    const phoneLogo = require('../../assets/phone_call.png');
    const navigation = useNavigation();

    const handleImagePress = (index) => {
        setSelectedImageIndex(index);
        setIsVisible(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const time = `${formattedHours}:${formattedMinutes} ${ampm}`;
        const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        return `${formattedDate.replace(/,/, '')} (${time})`;
    };

    const formatOrderAndDeliveryDate = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        return `${formattedDate.replace(/,/, '')}`;
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{invoice.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                        <Text style={[styles.detail, { fontSize: 18, fontWeight: "bold" }]}>Mobile: </Text>
                        <TouchableOpacity style={{ flexDirection: "row", gap: 10, alignItems: "center" }} onPress={() => Linking.openURL(`tel:${invoice.mobile}`)}>
                            <Text style={{ fontSize: 16, fontWeight: "normal", color: "white" }}>{invoice.mobile}</Text>
                            <Image source={phoneLogo} style={{ height: 22, width: 22 }} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.detail, { fontSize: 18, fontWeight: "bold" }]}>Address: <Text style={{ fontSize: 16, fontWeight: "normal" }}>{invoice.address}</Text></Text>
                    <View style={styles.amountContainer}>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountText}>Total Amount:</Text>
                            <Text style={styles.amountValue}>₹ {parseInt(invoice.totalAmount)}</Text>
                        </View>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountText}>Paid Amount:</Text>
                            <Text style={styles.paidValue}>₹ {parseInt(invoice.amountGiven)}</Text>
                        </View>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountText}>Remaining Amount:</Text>
                            <Text style={styles.remainingValue}>₹ {parseInt(invoice.totalAmount) - parseInt(invoice.amountGiven)}</Text>
                        </View>
                    </View>
                    <Text style={[styles.detail, { fontSize: 18, fontWeight: "bold" }]}>Description: <Text style={{ fontSize: 16, fontWeight: "normal" }}>{invoice.description}</Text></Text>
                    <Text style={[styles.detail, { fontSize: 18, fontWeight: "bold" }]}>Order Date: <Text style={{ fontSize: 16, fontWeight: "normal" }}>{formatOrderAndDeliveryDate(invoice.orderDate)}</Text></Text>
                    <Text style={[styles.detail, { fontSize: 18, fontWeight: "bold" }]}>Delivery Date: <Text style={{ fontSize: 16, fontWeight: "normal" }}>{formatOrderAndDeliveryDate(invoice.deliveryDate)}</Text></Text>

                    <Text style={styles.imageLabel}>Design Images:</Text>
                    {designImages.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(index)} >
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.imageLabel}>Receipt Images:</Text>
                    {receiptImages.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(designImages.length + index)} >
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        </TouchableOpacity>
                    ))}

                    <ImageView images={[...designImages, ...receiptImages]} imageIndex={selectedImageIndex} visible={visible} onRequestClose={() => setIsVisible(false)} />

                    <View style={{ alignItems: "flex-end", padding: 10 }}><Text style={{ color: "white", fontSize: 12 }} >Created on : {formatDate(invoice.createdAt)}</Text></View>

                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
    },
    binLogo: {
        height: 30,
        width: 30,
    },
    detail: {
        fontSize: 16,
        color: '#ffffff',
    },
    amountContainer: {
        borderWidth: 1,
        borderColor: '#d4af37',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#1a1a1a',
        marginBottom: 15,
    },
    amountText: {
        fontSize: 16,
        color: '#ffffff',
    },
    amountValue: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    paidValue: {
        color: '#66fc03',
        fontWeight: 'bold',
    },
    remainingValue: {
        color: '#ff1f40',
        fontWeight: 'bold',
    },
    imageLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#ffffff',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d4af37',
        backgroundColor: '#1a1a1a',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffffff',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    swipeableContainer: {
        // position: 'absolute',
        // bottom: 20,
        width: SCREEN_WIDTH * 0.95,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    statusItem: {
        width: '25%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        backgroundColor: 'white',
    },
    currentStatus: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default InvoiceDetail;
