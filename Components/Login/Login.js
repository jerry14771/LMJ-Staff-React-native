import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useNavigation, useRoute } from '@react-navigation/native';
import config from '../../config';

function Login() {
    const [loading, setLoading] = useState(false); // Loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const logo = require('../../assets/logo.png');
    const showIcon = require('../../assets/eye.png');
    const hideIcon = require('../../assets/hidden.png');
    const navigation = useNavigation();
    const [invalidCredential, setInvalidCredential] = useState(false);

    const verifyLogin = async () => {

        try {
            setLoading(true);
            const response = await fetch(config.BASE_URL+'login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setInvalidCredential(false);
                await AsyncStorage.setItem('email', email);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                setInvalidCredential(true);
                const data = await response.json();
            }
        } catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <ImageBackground source={{ uri: 'https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}} style={styles.backgroundImage} >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={{ color:"white", alignSelf:"center", fontSize:25, fontWeight:"700"}}>Karigar Portal</Text>

                    <Image
                        source={logo} 
                        style={styles.logo}
                    />

                    <View style={styles.glassEffectContainer}>
                        {/* <Text style={styles.title}>Login</Text> */}

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#888"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                keyboardType="default"
                                key={showPassword ? 'password-shown' : 'password-hidden'} // Add key to force re-render
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Image source={showPassword ? showIcon : hideIcon} style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                        </View>

                        {

                            invalidCredential && <View style={{ width: '100%' }}><Text style={{ color: "white", fontWeight:"600", fontSize:16 }}>Something went wrong !</Text></View>
                        }

                        <TouchableOpacity style={styles.loginButton} onPress={verifyLogin}>
                            <Text style={styles.loginText}>Log In</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}

            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor:"rgba(0,0,0,0.5)",
        borderRadius:10
    },
    glassEffectContainer: {
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 20,
        backgroundColor: 'rgba(256, 256, 256, 0.1)', // Light yellow glass effect
        borderColor: 'transparent',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    input: {
        flex: 1,
        padding: 10,
        color: 'black',
    },
    loginButton: {
        backgroundColor: '#a17632',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    loginText: {
        color: '#f7f5bc',
        fontWeight: 'bold',
        fontSize: 22,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1000,
    },
});

export default Login;
