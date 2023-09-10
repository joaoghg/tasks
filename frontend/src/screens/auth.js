import React, { Component } from "react";
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert
} from "react-native";
import estiloPadrao from "../estiloPadrao";
import AuthInput from "../components/AuthInput";
import axios from "axios";
import { server, showError, showSuccess } from '../common'
import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = {
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component{

    state = {
        ...initialState
    }

    signInOrSignUp = () => {
        if(this.state.stageNew) {
            this.signup()
        }
        else{
            this.signin()
        }
    }

    signup = async () => {
        try{
            await axios.post(`${server}/signup`, {
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                confirmPassword: this.state.confirmPassword
            })

            showSuccess('Usuário cadastrado');
            this.setState({...initialState})
        }catch (erro){
            showError(erro);
        }
    }

    signin = async () => {
        try{
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
            this.props.navigation.navigate('Home')
            await AsyncStorage.setItem('userData', JSON.stringify(res.data))
        }catch(erro){
            showError(erro)
        }
    }

    render() {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.stageNew){
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return(
            <ImageBackground source={require('../../assets/imgs/login.jpg')}
                style={styles.background}
            >
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados' }
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput icon={'user'} placeholder={"Nome"} value={this.state.name}
                            style={styles.input} onChangeText={name => this.setState({ name })}/>
                    }
                    <AuthInput icon={'at'} placeholder={"E-mail"} value={this.state.email}
                        style={styles.input} onChangeText={email => this.setState({ email })}
                    />
                    <AuthInput icon={'lock'} placeholder={"Senha"} value={this.state.password}
                        style={styles.input}
                        onChangeText={password => this.setState({ password })}
                        secureTextEntry={true}
                    />
                    {this.state.stageNew &&
                        <AuthInput icon={'asterisk'} placeholder={"Confirmar"} value={this.state.confirmPassword}
                           style={styles.input}
                           onChangeText={confirmPassword => this.setState({ confirmPassword })}
                           secureTextEntry={true}
                        />
                    }
                    <TouchableOpacity onPress={this.signInOrSignUp}
                        disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}
                >
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontFamily: estiloPadrao.fontFamily,
        color: estiloPadrao.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: estiloPadrao.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        padding: Platform.OS === 'ios' ? 20 : 10
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        borderRadius: 12
    },
    buttonText: {
        fontFamily: estiloPadrao.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})
