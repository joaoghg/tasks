import {
    Alert,
    Platform
} from "react-native";

const server  = Platform.OS === 'ios'
    ? 'http://localhost:3000' : 'http://10.0.2.2:3000'

function showError(err) {
    if(err.response && err.response.data){
        Alert.alert('Ocorreu um problema!', `Mensagem: ${err.response.data}`)
    }else{
        Alert.alert('Ocorreu um problema!', `Mensagem: Contate o suporte`)
    }
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSuccess }
