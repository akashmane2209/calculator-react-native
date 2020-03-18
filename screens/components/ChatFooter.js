import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

export class ChatFooter extends Component {
    render() {
        const { replyTo, replyMsg, dismiss } = this.props
        return (
            replyMsg.length > 0 ?
                <View style={{ height: 50, flexDirection: 'row' }}>
                    <View style={{ height: 50, width: 5, backgroundColor: 'red' }}></View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: 'red', paddingLeft: 10, paddingTop: 5 }}>{replyTo}</Text>
                        <Text style={{ color: 'gray', paddingLeft: 10, paddingTop: 5 }}>{replyMsg}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
                        {/* <TouchableOpacity onPress={dismiss}>
                        <Icon name="x" type="feather" color="#0084ff" />
                    </TouchableOpacity> */}
                    </View>
                </View>
                : null
        )
    }
}

export default ChatFooter
