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

        this.setState(state)
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
        await AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]

        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({ tasks }, this.filterTasks)
    }

    addTask = newTask => {
        if(!newTask.desc.trim()){
            Alert.alert("Dados Inválidos", 'Descrição não informada!')
            return;
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks }, this.filterTasks)
    }

    render(){
        const today = moment().locale('pt-br').format('ddd, D, [de] MMMM')
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onCancel={() => this.setState({ showAddTask: false })}
                    onSave={this.addTask}
                />
                <ImageBackground style={styles.background}
                    source={require('../../assets/imgs/today.jpg')}
                >
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon
                                name={this.state.showDoneTasks ? "eye" : "eye-slash"}
                                size={20} color={estiloPadrao.colors.secondary}
                            >
                            </Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
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
                <TouchableOpacity style={styles.addButton}
                    onPress={() => this.setState({ showAddTask : true })}
                    activeOpacity={0.7}
                >
                    <Icon name={"plus"}
                        size={20} color={estiloPadrao.colors.secondary}
                    ></Icon>
                </TouchableOpacity>
            </View>
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
        justifyContent: 'flex-end',
        marginTop: 40
    },
    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: estiloPadrao.colors.today,
        justifyContent: "center",
        alignItems: "center"
    }
})
