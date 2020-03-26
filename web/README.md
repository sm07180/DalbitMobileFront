### 달빛라이브

- 개발페이지 : <https://devwww2.dalbitcast.com/>
- gitrepo@devj.dalbitcast.com:radio_front.git

# 공통

> custom Header 출력 (PC접속시)

```
os: "3"
locale: "temp_KR"
deviceId: "e9609b9f-626c-41d1-8a4d-8b327152e691"
browserName: "Chrome"
language: "ko"
deviceToken: "make_custom_header"
```

> 네이티브앱 과 모바일웹 구분

```
import {isHybrid, Hybrid} from 'context/hybrid'

//code
isHybrid()  true/false (Boolean)
```

> 로그인여부확인

```
context.token.isLogin
```

# Google Analytics

```
//index.html
<script src="https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js"></script>
<!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.9.1/firebase-analytics.js"></script>
<script>
    // Your web app's Firebase configuration
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
    firebase.analytics()
</script>

//사용시
window.firebase.analytics().logEvent(`REACT-GNB-CLICK`)
```

# 플러그인

# 라우팅

- 예제준비중

> 팝업띄우기

```
//import
import {Context} from 'Context'
//makeContext
const context = useContext(Context)
//실행
context.action.updatePopup('LOGIN')
```

> 팝업컨텐츠설정

```
/src/pages/popup/index.js

//   레이어팝업컨텐츠
const makePopupContents = () => {
console.log(context.popup_code)
switch (context.popup_code) {
    case 'LOGIN':
    return <Auth {...props} />
}

```

위의 function에서 case를 추가하면된다.
