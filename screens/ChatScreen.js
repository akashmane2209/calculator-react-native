import React, { Component } from 'react'
import { Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils';
import Firebase from './../config/firebase.config'
import SlackMessage from './Slack-Style-Chat/SlackMessage'

export default class ChatScreen extends Component {
    state = {
        messages: []
    }
    get user() {
        return {
            _id: Firebase.uid,
            name: this.props.route.params.name,
            // avatar: 'AM'
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

    renderMessage(props) {
        const {
            currentMessage: { text: currText },
        } = props

        let messageTextStyle

        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            }
        }

        return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
    }

    render() {
        const chat = <GiftedChat messages={this.state.messages} user={this.user} onSend={Firebase.send}
        // renderMessage={this.renderMessage}

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

