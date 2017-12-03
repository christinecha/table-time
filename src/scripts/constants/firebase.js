import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyDJ_iuy9w-4IcmjRWFh2Kx90VF3ydasNPo',
  authDomain: 'manatee-85d23.firebaseapp.com',
  databaseURL: 'https://manatee-85d23.firebaseio.com',
  projectId: 'manatee-85d23',
  storageBucket: 'manatee-85d23.appspot.com',
  messagingSenderId: '437280873848',
}

firebase.initializeApp( config )

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
