import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity
} from "react-native";
import estiloPadrao from "../estiloPadrao";
import Icon from "@expo/vector-icons/FontAwesome"
import moment from 'moment'
import 'moment/locale/pt-br'
import Swipeable from 'react-native-gesture-handler/Swipeable'

export default props => {

    const doneOrNotStyle = props.doneAt !== null ?
        { textDecorationLine: 'line-through' } : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    const getRightContent = () => {
        return(
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}
            >
                <Icon name={"trash"} size={30} color={"#FFF"}></Icon>
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return(
            <View style={styles.left}>
                <Icon name={"trash"} size={20} color={"#FFF"} style={styles.excludeIcon}></Icon>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return(
        <Swipeable renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.toggleTask(props.id)}
                >
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt){
    if(doneAt !== null){
        return (
            <View style={styles.done}>
                <Icon name={"check"} size={20} color={"#FFF"}></Icon>
            </View>
        )
    }
    else{
        return (
            <View style={styles.pending}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    checkContainer: {
        width: '20%',
        alignItems: "center",
        justifyContent: "center"
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4d7031',
        justifyContent: "center",
        alignItems: "center"
    },
    desc: {
        fontFamily: estiloPadrao.fontFamily,
        color: estiloPadrao.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: estiloPadrao.fontFamily,
        color: estiloPadrao.colors.subText,
        fontSize: 12
    },
    right: {
        backgroundColor: 'red',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 20
    },
    left: {
        backgroundColor: 'red',
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    excludeText: {
        fontFamily: estiloPadrao.fontFamily,
        color: '#fff',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})
