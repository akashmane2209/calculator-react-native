import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
export default class LoginScreen extends Component {
    state = {
        name: ''
    }
    continue = () => {
        this.props.navigation.navigate('Chat', { name: this.state.name })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.circle} />
                <View style={{ marginHorizontal: 32 }}>
                    <Text style={styles.header}>Username</Text>
                    <TextInput style={styles.input} placeholder="Enter Name" onChangeText={(name) => this.setState({ name })} value={this.state.name} />
                    <View style={{ alignItems: 'flex-end', marginTop: 64 }}>
                        <TouchableOpacity style={styles.continue} onPress={this.continue}>
                            <Ionicons name="md-arrow-round-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f4f7',
        marginTop: 50
    },
    circle: {
        backgroundColor: '#fff',
        height: 500,
        width: 500,
        borderRadius: 500 / 2,
        position: 'absolute',
        left: -140,
        top: -50
    },
    header: {
        fontWeight: '800',
        fontSize: 30,
        marginTop: 32,
        color: '#514e5a'
    },
    input: {
        marginTop: 32,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#Bab7c3',
        borderRadius: 30,
        paddingHorizontal: 16,
        color: '#514e5a',
        fontWeight: '600'
    },
    continue: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: '#9075e3',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
