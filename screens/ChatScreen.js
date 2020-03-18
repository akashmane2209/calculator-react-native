import React, { Component } from 'react'
import { Platform, KeyboardAvoidingView, SafeAreaView, View, TouchableOpacity, Text, Clipboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import Firebase from './../config/firebase.config'
import ChatFooter from './components/ChatFooter'
export default class ChatScreen extends Component {
    state = {
        messages: [],
        isTyping: false,
        replyMessage: ""

    }
    get user() {
        return {
            _id: Firebase.uid,
            name: this.props.route.params.name,
        }
    }
    componentDidMount() {
        Firebase.get(messages => {
            this.setState((previous) => ({
                messages: GiftedChat.append(previous.messages, messages)
            }))
        })
    }
    componentWillUnmount() {
        Firebase.off()
    }


    renderSend(props) {
        return (
            <Send
                {...props}
            >
                <View style={{ marginRight: 20 }}>
                    <View style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                        backgroundColor: '#9075e3',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    >
                        <Ionicons name="md-arrow-round-forward" size={24} color="white" />
                    </View>
                </View>
            </Send>
        );
    }
    replyToMessage = (context, message) => {
        console.log(context, message)
        const options = [
            'Reply',
            'Copy Text',
            'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.setState({
                            replyMessage: message.text
                        })
                    case 1:
                        Clipboard.setString(message.text);
                        break;
                }
            });
    }
    render() {
        const chat = <GiftedChat messages={this.state.messages} user={this.user} onSend={(messages) => { Firebase.send(messages); this.setState({ replyMessage: '' }) }} alwaysShowSend={true}
            renderChatFooter={() => <ChatFooter replyTo={this.user.name} replyMsg={this.state.replyMessage} />}
            onLongPress={(context, message) => this.replyToMessage(context, message)}
            renderSend={this.renderSend}
            scrollToBottom={true}
            showAvatarForEveryMessage={true}
        />

        if (Platform.OS === 'android') {
            return (
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior='padding' enabled>
                    {chat}
                </KeyboardAvoidingView>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                {chat}
            </SafeAreaView>
        )
    }
}

