import React, { Component } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TextInput, TouchableOpacity,
    Platform
} from 'react-native'
import estiloPadrao from "../estiloPadrao";
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

const initialState = { desc: '', date: new Date(), showDatePicker: false }

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date}
                             onChange={(e, date) => this.setState({ date, showDatePicker: false })}
                             mode={'date'}
                          />

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')

        if(Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }

        return datePicker
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({...initialState})
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType={'slide'}
            >
                <TouchableWithoutFeedback
                    onPress={this.props.onCancel}
                >
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa</Text>
                    <TextInput style={styles.input}
                        placeholder={"Informe a descrição"}
                        value={this.state.desc}
                        placeholderTextColor={"#696969"}
                        onChangeText={desc => this.setState({ desc })}
                    />
                    {this.getDatePicker()}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={this.props.onCancel}
                >
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        backgroundColor: '#fff'
    },
    header: {
        fontFamily: estiloPadrao.fontFamily,
        backgroundColor: estiloPadrao.colors.today,
        color: estiloPadrao.colors.secondary,
        fontSize: 18,
        textAlign: "center",
        padding: 15
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    input: {
        fontFamily: estiloPadrao.fontFamily,
        height: 40,
        margin: 15,
        padding: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: estiloPadrao.colors.today
    },
    date: {
        fontFamily: estiloPadrao.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})
