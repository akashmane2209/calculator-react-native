import React, { Component, Fragment } from 'react'
import { Platform, KeyboardAvoidingView, SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GiftedChat, Send, Message, Bubble, Time } from 'react-native-gifted-chat'
import Firebase from './../config/firebase.config'
import ReplyToFooter from './components/ReplyToFooter';
import ChatBubbleWithReply from './components/ChatBubbleWithReply';
import Modal from 'react-native-modal';
import EmojiSelector from 'react-native-emoji-selector';

export default class ChatScreen extends Component {
    state = {
        messages: [],
        isTyping: false,
        show_reply_to_footer: false,
        reply_to: '',
        reply_to_msg: '',
        is_emoji_modal_visible: false,
        has_emoji: false,
        text: ''
    }
    get user() {
        return {
            _id: Firebase.uid,
            name: this.props.route.params.name,
        }
    }
    componentDidMount() {
        Firebase.get(data => {
            const { message } = this.getMessage(data);
            this.setState((previous) => ({
                messages: GiftedChat.append(previous.messages, message)
            }), () => {
            })
        })
    }
    getMessage = (message) => {
        const { _id,
            user,
            text,
            createdAt } = message;
        let msg_data = {
            _id: _id,
            text: text,
            createdAt: new Date(createdAt),
            user: user
        };

        if (message.reply && message.reply.user_name) {
            const reply_to = message.reply.user_name;
            const reply_to_msg = message.reply.message

            Object.assign(msg_data, {
                reply_to,
                reply_to_msg
            });
        }

        return {
            message: msg_data
        };
    }
    componentWillUnmount() {
        Firebase.off()
    }


    renderSend(props) {
        return (
            <Send
                {...props}
            >
                <View style={{ marginRight: 20, marginBottom: 5 }}>
                    <View style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                        backgroundColor: '#9075e3',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    >
                        <Ionicons name="md-arrow-round-forward" size={30} color="white" />
                    </View>
                </View>
            </Send>
        );
    }
    onLongPress = (context, message) => {
        this.setState({
            reply_to: message.user.name,
            reply_to_msg: message.text,
            show_reply_to_footer: true, // make the ReplyToFooter component visible
        });
    }
    renderChatFooter = () => {
        const { show_reply_to_footer, reply_to, reply_to_msg } = this.state;
        if (show_reply_to_footer) { // only render if it's set to visible
            return (
                <ReplyToFooter
                    reply_to={reply_to}
                    reply_to_msg={reply_to_msg}
                    closeFooter={this.closeReplyToFooter} />
            );
        }
        return null;
    }
    closeReplyToFooter = () => {
        this.setState({
            show_reply_to_footer: false,
            reply_to: null,
            reply_to_msg: null
        });
    }
    renderPreview = (bubbleProps) => {
        bubbleProps.reply_to = this.state.reply_to;
        bubbleProps.reply_to_msg = this.state.reply_to_msg
        bubbleProps.onLongPress = this.onLongPress
        return (
            <ChatBubbleWithReply {...bubbleProps} />
        );
    }
    renderMessage = (msg) => {
        // console.log(msg.currentMessage, 'renderMessage')
        if (msg.currentMessage.reply_to) {
            const { reply_to,
                reply_to_msg } = msg.currentMessage;
            const renderBubble = this.renderPreview

            let modified_msg = {
                ...msg,
                renderBubble
            };

            return <Message {...modified_msg} />
        }
        const renderBubble = (props) => {
            return (<Bubble {...props}
                // renderTime={this.renderTime}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#ffffff',
                    },
                    right: {
                        backgroundColor: '#dcf8c7',
                    }
                }}
                textStyle={{
                    right: {
                        color: "black"
                    },
                    left: {
                        color: "black"
                    }
                }}
                renderTime={(props) => {
                    return (
                        <Time {...props} timeTextStyle={{
                            right: {
                                color: 'black',
                            },
                            left: {
                                color: 'black',
                            }
                        }} />
                    )
                }}
            />)
        }
        let modified_msg = {
            ...msg,
            renderBubble
        };
        return <Message {...modified_msg} style={{
            backgroundColor: '#dcf8c7',
            color: 'black',
        }} />

    }
    onSend = (message) => {
        console.log(message, this.state, 'chat')
        const { reply_to, reply_to_msg } = this.state;
        if (reply_to.length > 0 && reply_to_msg.length > 0) {
            message[0].reply = {
                user_name: reply_to,
                message: reply_to_msg
            }
        }
        // console.log(message, 'is_reply')
        Firebase.send(message)
        this.setState({
            reply_to: '',
            reply_to_msg: '',
            show_reply_to_footer: false, // make the ReplyToFooter component visible
        });
    }

    renderTime = ({ position, containerStyle, currentMessage, timeFormat, textStyle }, context) => {
        return (
            <View style={[containerStyle[position]]}>
                <Text style={[textStyle[position], {
                    right: {
                        color: 'black',
                    },
                    left: {
                        color: 'black',
                    }
                }]}>
                    {moment(currentMessage.createdAt)
                        .locale(context.getLocale())
                        .format(timeFormat)}
                </Text>
            </View>
        );
    }
    renderCustomActions = () => {

        return (
            <View style={styles.custom_actions_container}>

                <TouchableOpacity onPress={() => this.setState({ is_emoji_modal_visible: true })}>
                    <View style={styles.buttonContainer}>
                        <Image style={{ width: 25, height: 25 }}
                            source={require('./../assets/smile.png')} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    selectEmoji = (emoji) => {
        this.setState(state => {
            return {
                text: `${state.text} ${emoji}`,
                has_emoji: true
            }
        });
    }
    render() {
        const { messages, is_emoji_modal_visible, text } = this.state;

        const chat = <GiftedChat
            messages={messages}
            onSend={messages => this.onSend(messages)}
            showUserAvatar={true}
            user={
                this.user
            }
            onInputTextChanged={text => this.setState({ text })}
            text={text}

            renderSend={this.renderSend}
            alwaysShowSend={true}
            onLongPress={this.onLongPress}
            renderChatFooter={this.renderChatFooter}
            renderMessage={this.renderMessage}
            renderActions={this.renderCustomActions}

        />

        if (Platform.OS === 'android') {
            return (
                <Fragment>
                    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#e5ddd5' }} behavior='padding' enabled>
                        {chat}
                    </KeyboardAvoidingView>
                </Fragment>

            )
        }
        return (
            <Fragment>

                <SafeAreaView style={{ flex: 1, backgroundColor: '#e5ddd5' }}>
                    {chat}
                    <Modal isVisible={is_emoji_modal_visible}>
                        <View style={styles.modal_body}>
                            <TouchableOpacity onPress={() => {
                                this.setState({ is_emoji_modal_visible: false });
                            }}>
                                <View style={styles.modal_close_container}>
                                    <Text style={styles.modal_close_text}>Close</Text>
                                </View>
                            </TouchableOpacity>

                            <EmojiSelector
                                columns={6}
                                showHistory={true}
                                onEmojiSelected={this.selectEmoji}
                            />
                        </View>
                    </Modal>
                </SafeAreaView>

            </Fragment>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    custom_actions_container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonContainer: {
        padding: 10
    },
    modal_body: {
        height: 500,
        backgroundColor: '#FFF',
        overflow: 'scroll',
        position: 'absolute',
        bottom: 0
    },
    modal_close_container: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 10
    },
    modal_close_text: {
        color: '#0366d6'
    }
});

