import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Home/Home';
import Profile from '../Home/Profile';

const RootNav = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNav