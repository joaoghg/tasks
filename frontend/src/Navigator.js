import React from "react";
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import {createDrawerNavigator} from "@react-navigation/drawer";
import TaskList from "./screens/TaskList";
import Auth from "./screens/auth";
import AuthOrApp from "./screens/AuthOrApp";

import Menu from "./screens/menu";
import estiloPadrao from "./estiloPadrao";

const Drawer = createDrawerNavigator()

const drawerOptions = {
    headerShown: false,
}

function menuNavigator(){
    return (
        <Drawer.Navigator initialRouteName={"Hoje"}
            drawerContent={props => <Menu {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#080',
                drawerLabelStyle: {
                    fontFamily: estiloPadrao.fontFamily,
                    fontWeight: 'bold',
                    fontSize: 20
                },
                drawerActiveBackgroundColor: '#EEE',
            }}
        >
            <Drawer.Screen options={drawerOptions} name="Hoje">
                {props => <TaskList title={"Hoje"} daysAhead={0} {...props} />}
            </Drawer.Screen>
            <Drawer.Screen options={drawerOptions} name="Amanhã">
                {props => <TaskList title={"Amanhã"} daysAhead={1} {...props} />}
            </Drawer.Screen>
            <Drawer.Screen options={drawerOptions} name="Semana">
                {props => <TaskList title={"Semana"} daysAhead={7} {...props} />}
            </Drawer.Screen>
            <Drawer.Screen options={drawerOptions} name="Mês">
                {props => <TaskList title={"Mês"} daysAhead={30} {...props} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

const mainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    }
}

const MainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'AuthOrApp'
})

export default createAppContainer(MainNavigator)
