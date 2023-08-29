import React from "react";
import TaskList from "./src/screens/TaskList";
import { useFonts } from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {

    const [fontsLoaded] = useFonts({
        'Lato': require("./assets/fonts/Lato.ttf")
    })

    if(!fontsLoaded){
        return null
    }else{
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <TaskList/>
            </GestureHandlerRootView>
        );
    }
}
