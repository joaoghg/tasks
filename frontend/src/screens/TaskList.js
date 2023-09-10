import React, { Component } from "react";
import {
    Text,
    View,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from "react-native";
import moment from 'moment'
import 'moment/locale/pt-br'
import estiloPadrao from "../estiloPadrao";
import Task from "../components/Task";
import Icon from '@expo/vector-icons/FontAwesome';
import AddTask from "./AddTask";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import axios from "axios";
import { server, showError } from "../common";

const initialState = {
    showDoneTasks: false,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {
    state = {
        ...initialState
    }

    /* Tasks {
            id: Math.random(),
            desc: 'Comprar Livro de React Native',
            estimateAt: new Date(),
            doneAt: new Date()
        },
        {
            id: Math.random(),
            desc: 'Ler Livro de React Native',
            estimateAt: new Date(),
            doneAt: null
        }
     */

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const state = JSON.parse(stateString) || initialState

        this.setState({
            showDoneTasks: state.showDoneTasks
        })

        this.loadTasks()
    }

    loadTasks = async () => {
        try{
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)

            this.setState({ tasks: res.data }, this.filterTasks)
        }catch(erro){
            showError(erro)
        }
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)

    }

    filterTasks = async () => {
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        }
        else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks })
        await AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async taskId => {
        try{
            await axios.put(`${server}/tasks/${taskId}`)
            this.loadTasks()
        }catch(err){
            showError(err)
        }
    }

    addTask = async newTask => {
        if(!newTask.desc.trim()){
            Alert.alert("Dados Inválidos", 'Descrição não informada!')
            return;
        }

        try{
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({ showAddTask: false }, this.loadTasks)
        }catch(err){
            showError(err)
        }
    }

    deleteTask = async id => {
        try{
            await axios.delete(`${server}/tasks/${id}`)
            this.loadTasks()
        }catch(err){
            showError(err)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead){
            case 0: return require('../../assets/imgs/today.jpg')
            case 1: return require('../../assets/imgs/tomorrow.jpg')
            case 7: return require('../../assets/imgs/week.jpg')
            case 30: return require('../../assets/imgs/month.jpg')
        }
    }

    getColor = () => {
        switch(this.props.daysAhead){
            case 0: return estiloPadrao.colors.today
            case 1: return estiloPadrao.colors.tomorrow
            case 7: return estiloPadrao.colors.week
            case 30: return estiloPadrao.colors.month
        }
    }

    render(){
        const today = moment().locale('pt-br').format('ddd, D, [de] MMMM')
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <AddTask isVisible={this.state.showAddTask}
                             onCancel={() => this.setState({ showAddTask: false })}
                             onSave={this.addTask}
                    />
                    <ImageBackground style={styles.background}
                                     source={this.getImage()}
                    >
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <Icon
                                    name={"bars"}
                                    size={20} color={estiloPadrao.colors.secondary}
                                >
                                </Icon>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <Icon
                                    name={this.state.showDoneTasks ? "eye" : "eye-slash"}
                                    size={20} color={estiloPadrao.colors.secondary}
                                >
                                </Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{this.props.title}</Text>
                            <Text style={styles.subtitle}>{today}</Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.taskList}>
                        <FlatList data={this.state.visibleTasks}
                                  keyExtractor={item => `${item.id}`}
                                  renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask}
                                                                onDelete={this.deleteTask}
                                  />}
                        />
                    </View>
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: this.getColor() }]}
                                      onPress={() => this.setState({ showAddTask : true })}
                                      activeOpacity={0.7}
                    >
                        <Icon name={"plus"}
                              size={20} color={estiloPadrao.colors.secondary}
                        ></Icon>
                    </TouchableOpacity>
                </View>
            </GestureHandlerRootView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: "flex-end"
    },
    title: {
        fontFamily: estiloPadrao.fontFamily,
        fontSize: 50,
        color: estiloPadrao.colors.secondary,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: estiloPadrao.fontFamily,
        color: estiloPadrao.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: "row",
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: 40
    },
    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    }
})
