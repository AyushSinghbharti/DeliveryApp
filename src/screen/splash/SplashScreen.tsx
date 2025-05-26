import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const logos = [
    require('../../../assets/logo1.png'),
    require('../../../assets/logo2.png'),
    require('../../../assets/logo3.png'),
];

export default function SplashScreen() {
    const navigation = useNavigation();
    const [logoIndex, setLogoIndex] = useState(0);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * logos.length);
        setLogoIndex(randomIndex);

        // Navigate after 2 seconds
        const timer = setTimeout(() => {
            navigation.navigate('Auth' as never);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={logos[logoIndex]} style={styles.logo} resizeMode="contain" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 180,
    },
});