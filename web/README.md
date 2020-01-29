### 달빛라디오

- 개발페이지 : <https://devwww2.dalbitcast.com/>
- git :

# 공통

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
