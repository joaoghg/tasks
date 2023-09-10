import 'react-native-gesture-handler';
import React from "react";
import { useFonts } from 'expo-font'
import Navigator from "./src/Navigator";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

    const [fontsLoaded] = useFonts({
        'Lato': require("./assets/fonts/Lato.ttf")
    })

    if(!fontsLoaded){
        return null
    }else{
        return (
            <NavigationContainer>
                <Navigator/>
            </NavigationContainer>
        );
    }
}
