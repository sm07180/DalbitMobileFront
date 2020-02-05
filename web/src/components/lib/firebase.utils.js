import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {functionDeclaration} from '@babel/types'

var firebaseConfig = {
  apiKey: 'AIzaSyD5rY6sPsRqvlTb7jtEzO32vOHu-lbdDrs',
  authDomain: 'dalbitcast-1a445.firebaseapp.com',
  databaseURL: 'https://dalbitcast-1a445.firebaseio.com',
  projectId: 'dalbitcast-1a445',
  storageBucket: 'dalbitcast-1a445.appspot.com',
  messagingSenderId: '76445230270',
  appId: '1:76445230270:web:7cbe088acdddba78a3aaef',
  measurementId: 'G-GY6SLG0J86'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
//firebase.analytics()

//export const auth = firebase.auth()
// export const firestore = firebase.firestore()

const Googleprovider = new firebase.auth.GoogleAuthProvider()

// // const Fbprovider = new firebase.auth.FacebookAuthProvider()
// // // GoogleAuthProvider 클래스를 authentication 라이브러리에서 사용할 수 있도록 불러오는 코드.
Googleprovider.setCustomParameters({prompt: 'select_account'})
// //Fbprovider.setCustomParameters({prompt: 'select_account'})
// signIn이랑 authentication을 위해서 GoogleAuthProvider를 사용할 때마다 구글 팝업을 항상 띄우기를 원한다는 의미이다.
export const signInWithGoogle = () => firebase.auth().signInWithPopup(Googleprovider)

// export const signInWithFacebook = () => auth.signInWithPopup(Fbprovider)
// // signInWithPopup 메소드는 여러 파라미터를 받을 수 있다. 트위터, 페이스북, 깃허브 등으로도 로그인이 필요할 수도 있으므로.
// // 여기에서는 google로 signIn할 것이기 때문에, 파라미터로 위에서 정의한 provider를 넣어준다.

export default firebase
// 혹시 전체 라이브러리가 필요할지도 모르기 때문에 firebase도 export 해준다.
