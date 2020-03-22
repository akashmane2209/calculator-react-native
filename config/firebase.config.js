import firebase from 'firebase'
import config from './../config.js'
class Firebase {
    constructor() {
        this.init();
        this.checkAuth()
    }
    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp(config.FIREBASE)
        }
        console.log('Firebase Initialized Successfully')
    };
    checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously()
            }
        })
    }
    send = (messages) => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                user: item.user,
                reply: item.reply ? item.reply : {},
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }
            this.db.push(message)

        })
    }
    parse = message => {
        const { text, user, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);
        let data = {
            _id,
            user,
            text,
            createdAt
        }
        if (message.val().reply) {
            data.reply = message.val().reply
        }
        return data
    };

    get = callback => {
        this.db.on('child_added', snapshot => {
            callback(this.parse(snapshot))
        })
    }
    off() {
        this.db.off()
    }
    get db() {
        return firebase.database().ref('messages')
    }
    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }
}

export default new Firebase()