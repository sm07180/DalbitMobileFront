# RoomJoin

- 방입장 및 퇴장,

> '/src/context/room.js'

## ▷ RoomMake

Gnb 및 메인상단에 3군대정도 코드가 사용되고있음.

```
export const RoomMake = async (context) => {}
```

#### 적용예제

```
//import
import {RoomMake} from 'context/room'

//code (context)
RoomMake(globalCtx)
```

## ▷ RoomExit

방퇴장이 사용되는 export module

#### 적용예제

```
//import
import {RoomExit} from 'context/room'

/**
 * @title 방송방종료
 * @param {roomNo} string           //방송방번호
 */

//code (context)
RoomExit(roomNo)
```

## ▷ RoomJoin

메인페이지 및 검색등에서 사용

```

```
