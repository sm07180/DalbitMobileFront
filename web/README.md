### 달빛라디오

- 개발페이지 : <https://devwww2.dalbitcast.com/>
- gitrepo@devj.dalbitcast.com:radio_front.git

# 공통

> custom Header 출력 (PC접속시)

```
os: "3"
locale: "temp_KR"
deviceId: "e9609b9f-626c-41d1-8a4d-8b327152e691"
hybridApp: "N"
browserName: "Chrome"
language: "ko"
deviceToken: "make_custom_header"
```

> 네이티브앱 과 모바일웹 구분

```
//값이 "N" 일경우 모바일웹
context.customHeader.hybridApp
```

> 로그인여부확인

```
context.token.isLogin
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
