# PUSH

- 푸쉬알림 이벤트 "native-push-background" 는 Background에서 상태에서 받음
- **로그인이 된 상태에서** 에서만 울린다. [기획협의완료]

> native-push-background

```
    //마이페이지>내 지갑
  document.dispatchEvent(
    new CustomEvent('native-push-background', {
      detail: `{"push_type":"32","mem_no":"11583120797169"}`
    })
  )
    //방송방 [room_no]
  document.dispatchEvent(
    new CustomEvent('native-push-background', {
      detail: `{"push_type":"1","room_no":"1111"}`
    })
  )
```

## DB에서 받는 푸쉬코드값

```
    /**
     * @title 네이티브 푸쉬관련
     * @push_type
        1 : 방송방 [room_no]
        2 : 메인
        31 : 마이페이지>팬 보드
        32 : 마이페이지>내 지갑
        33 : 마이페이지>캐스트>캐스트 정보 변경 페이지
        34 : 마이페이지>알림>해당 알림 글
        35 : 마이페이지
        36 : 레벨 업 DJ 마이페이지 [mem_no]
        4 : 등록 된 캐스트
        5 : 스페셜 DJ 선정 페이지
        6 : 이벤트 페이지>해당 이벤트 [board_idx]
        7 : 공지사항 페이지 [board_idx]
      */
```

## 브라우져에서 스티커팝업

```

```
