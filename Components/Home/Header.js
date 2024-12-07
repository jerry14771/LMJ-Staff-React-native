import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Modal, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const logo = require("../../assets/logo2.png");
    const switchlogo = require("../../assets/switch.png");
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const confirmLogout = () => {
        setModalVisible(false);
        handleLogout();
    };

    return (
        <View>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <View style={styles.header}>
                <Text> </Text>
                <Image source={logo} style={styles.logo} />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={switchlogo} style={styles.switchLogo} />
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.buttonRow}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Logout" onPress={confirmLogout} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "black",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    logo: {
        height: 60,
        width: 60,
    },
    switchLogo: {
        height: 35,
        width: 35,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
});

export default Header;
