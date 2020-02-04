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

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
// GoogleAuthProvider 클래스를 authentication 라이브러리에서 사용할 수 있도록 불러오는 코드.
provider.setCustomParameters({prompt: 'select_account'})
// signIn이랑 authentication을 위해서 GoogleAuthProvider를 사용할 때마다 구글 팝업을 항상 띄우기를 원한다는 의미이다.

// signInWithPopup 메소드는 여러 파라미터를 받을 수 있다. 트위터, 페이스북, 깃허브 등으로도 로그인이 필요할 수도 있으므로.
// 여기에서는 google로 signIn할 것이기 때문에, 파라미터로 위에서 정의한 provider를 넣어준다.
console.log('팝업 전 ')
auth.signInWithPopup(provider).then(
  function(result) {
    console.clear()
    console.log('signInWithPopup')
    // The firebase.User instance:
    var user = result.user
    // The Facebook firebase.auth.AuthCredential containing the Facebook
    // access token:
    var credential = result.credential
  },
  function(error) {
    // The provider's account email, can be used in case of
    // auth/account-exists-with-different-credential to fetch the providers
    // linked to the email:
    var email = error.email
    // The provider's credential:
    var credential = error.credential
    // In case of auth/account-exists-with-different-credential error,
    // you can fetch the providers using this:
    if (error.code === 'auth/account-exists-with-different-credential') {
      auth.fetchSignInMethodsForEmail(email).then(function(providers) {
        // The returned 'providers' is a list of the available providers
        // linked to the email address. Please refer to the guide for a more
        // complete explanation on how to recover from this error.
      })
    }
  }
)
export const signInWithGoogle = () => auth.signInWithPopup(provider)
export default firebase
// 혹시 전체 라이브러리가 필요할지도 모르기 때문에 firebase도 export 해준다.
