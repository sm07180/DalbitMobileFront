# 컨셉

- SPA가 아닌 페이지별로 분리됨

# 상태관리

- context API
- 전역으로 사용 /context , 각객체에서 사용 store.js 사용
- 참고페이지 : https://reactjs.org/docs/context.html

# 폴더구조

- /src/components //컴포넌트단위모듈
- /src/context //전역으로 관리하는 상태관리
- /src/pages //라우팅 기준으로 pages모듈
- /src/styles //scss 스타일링

## /src

> src/index.js

- react 에서 가장 처음으로 실행되는 index.js

> src/App.js

- /token 정보업데이트
- 'custom-header' 정보 context 및 쿠키 업데이트
- 최초기동여부 customHeader['isFirst'] === 'Y' , 'N'
- Player 실행여부, 쿠키 'native-player-info' 로 정보파싱

> src/Interface.js

React <-> App 간의 통신규약

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

라우터별로 코드스플릿, [참고페이지](https://velog.io/@odini/Code-Splitting%EC%BD%94%EB%93%9C-%EC%8A%A4%ED%94%8C%EB%A6%BF%ED%8C%85) 처리함
리엑트 라우터별로 분할로드처리함, SPA구조 깨뜨린상태라, Router기준으로 다시 읽음.

```
//
const MyPage = React.lazy(() => import('pages/mypage'))
```

## /src/components

hooks및 라이브러리 UI단위적으로 사용하는 모듈

[참고페이지](https://sg-choi.tistory.com/229)

- hooks (자체적으로 상태관리가 되는 모듈) 커스텀으로 제작된것들
- 일부페이지에 useChange.js 사용
-

## /src/context

- /src/context/api.js
