import React, { Component } from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class AuthOrApp extends Component{

    componentDidMount = async () => {
        let userData = null
        try{
            const data = await AsyncStorage.getItem('userData')
            userData = JSON.parse(data)
        }catch(erro){
            console.log(erro)
        }

        if(userData && userData.token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
            await AsyncStorage.setItem('userData', JSON.stringify(userData))
            this.props.navigation.navigate('Home')
        }else{
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator  size={"large"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#000'
    }
})
