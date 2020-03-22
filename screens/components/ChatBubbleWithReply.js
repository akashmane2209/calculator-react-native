import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageText, MessageImage, Time } from 'react-native-gifted-chat';

class ChatBubbleWithReply extends React.Component {

    render() {
        const { position, children, currentMessage, onLongPress } = this.props;
        // if the position is right it means that it's the current user who sent the message
        const reply_header = `${currentMessage.reply_to}`;
        const reply_to_color = 'black'
        const reply_to_msg_color = 'black';
        const repl_bg_color = (position === 'right') ? '#cfe9ba' : '#f0f0f0'
        return (
            <TouchableOpacity style={styles[`${position}_container`]}
                onLongPress={() => {
                    onLongPress({}, currentMessage)
                }}
            >
                <View style={styles[`${position}_wrapper`]}>
                    <View style={[styles.reply_to_container, {
                        backgroundColor: repl_bg_color
                    }]}>
                        <Text style={[styles.reply_to, { color: reply_to_color }]}>{reply_header}:</Text>
                        <View style={[styles.reply_to_msg_container]}>
                            <Text style={[styles.reply_to_msg, { color: reply_to_msg_color }]}>{currentMessage.reply_to_msg}</Text>
                        </View>
                    </View>
                    <MessageText {...this.props} textStyle={{
                        left: { color: 'black' },
                        right: { color: '#000' }
                    }} />
                    {
                        currentMessage.image &&
                        <MessageImage {...this.props} />
                    }
                    {children}
                    <Time {...this.props} timeTextStyle={{
                        right: {
                            color: 'black',
                        },
                        left: {
                            color: 'black',
                        }
                    }} />
                </View>
            </TouchableOpacity>

        );
    }

}


const styles = StyleSheet.create({
    left_container: {
        flex: 1,
        alignItems: 'flex-start',
        width: 300

    },
    left_wrapper: {
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginRight: 60,
        minHeight: 20,
        justifyContent: 'flex-end',
    },
    right_container: {
        flex: 1,
        alignItems: 'flex-end',
        color: 'black'
    },
    right_wrapper: {
        borderRadius: 5,
        backgroundColor: '#dcf8c7',
        color: 'black',
        marginLeft: 60,
        minHeight: 20,
        justifyContent: 'flex-end',
    },
    reply_to_container: {
        marginRight: 5,
        marginLeft: 5,
        marginTop: 5,
        borderRadius: 5,
        padding: 5

    },
    reply_to: {
        fontSize: 11,
    },
    reply_to_msg_container: {

    },
    reply_to_msg: {
        fontSize: 14
    }
});

export default ChatBubbleWithReply