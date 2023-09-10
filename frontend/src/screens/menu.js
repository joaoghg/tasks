import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {DrawerItem, DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {Gravatar} from "react-native-gravatar";
import AsyncStorage from '@react-native-async-storage/async-storage'
import estiloPadrao from "../estiloPadrao";
import axios from "axios";
import Icon from '@expo/vector-icons/FontAwesome'

export default props => {

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');

    useEffect(() => {
        const getEmail = async () => {
            try {
                const data = await AsyncStorage.getItem('userData');
                const userData = JSON.parse(data);
                setEmail(userData.email);
                setNome(userData.name);
            } catch (error) {
                console.error(error);
            }
        };

        getEmail();
    }, []);

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')
    }

    return (
        <DrawerContentScrollView>
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Gravatar style={styles.avatar}
                    options={{
                        email: email,
                        secure: true
                    }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{nome}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name={'sign-out'} size={30} color={'#800'} />
                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        color: '#000',
        fontFamily: estiloPadrao.fontFamily,
        fontSize: 30,
        paddingTop: 30,
        padding: 10,

    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#222'
    },
    userInfo: {
        marginLeft: 10,
    },
    name: {
        fontFamily: estiloPadrao.fontFamily,
        fontSize: 20,
        marginBottom: 5,
        color: estiloPadrao.colors.mainText
    },
    email: {
        fontFamily: estiloPadrao.fontFamily,
        fontSize: 15,
        color: estiloPadrao.colors.subText,
        marginBottom: 5
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10
    }
})
