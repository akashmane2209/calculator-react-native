import firebase from 'firebase'

class Firebase {
    constructor() {
        this.init();
        this.checkAuth()
    }
    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyC5UuuZ0dlTi2rYkdQhpE-8q4gS5QaTvQY",
                authDomain: "chatapp-f94fd.firebaseapp.com",
                databaseURL: "https://chatapp-f94fd.firebaseio.com",
                projectId: "chatapp-f94fd",
                storageBucket: "chatapp-f94fd.appspot.com",
                messagingSenderId: "722583145628",
                appId: "1:722583145628:web:26cca3fa21b3415b97b159",
                measurementId: "G-J809NWQ06R"
            })
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