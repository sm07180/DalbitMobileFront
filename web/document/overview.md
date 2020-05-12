# 컨셉

- SPA가 아닌 페이지별로 분리됨

# 폴더구조

> src/index.js

- react 에서 가장 처음으로 실행되는 index.js

> src/App.js

- /token 정보업데이트
- 'custom-header' 정보 context 및 쿠키 업데이트
- 최초기동여부 customHeader['isFirst'] === 'Y' , 'N'
- Player 실행여부, 쿠키 'native-player-info' 로 정보파싱

> src/Interface.js

- React <-> App 간의 통신규약

```
// Native => React
// in app
document.dispatchEvent(
    new CustomEvent('native-push-background', {
        detail: `{"push_type":"32","mem_no":"11583120797169"}`
    })
)
// in react
document.addEventListener('native-push-background', update)

// React => Native
Hybrid('GetLoginToken', tokenInfo.data)
```

> src/Route.js
