import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCsRXVswU1rl5U7_UJzjm4kUDsGaL5vMDA',
	authDomain: 'gallery-me-70f1d.firebaseapp.com',
	projectId: 'gallery-me-70f1d',
	storageBucket: 'gallery-me-70f1d.appspot.com',
	messagingSenderId: '57142544777',
	appId: '1:57142544777:web:c83da1229730f0718ab958',
	measurementId: 'G-9LS4VHKB4D'
}

// Initialize Firebase
const app = getApps()?.length
	? getApp()
	: initializeApp(firebaseConfig)

const analytics = isSupported().then(yes => yes
	? getAnalytics(app)
	: null)

const db = getFirestore(app)

// enableIndexedDbPersistence(db)

enum DbCollections {
	Users = 'users',
	Galleries = 'galleries',
	Items = 'items',
}

export { db, DbCollections }
