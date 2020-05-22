# 결제관련

- 20.05.19 현재 모빌리언스 적용 , 추후 쿠콘적용예정
- ios는 인앱결제, aos는 모빌리언스 적용

### 확인가능한 URL

- <https://devm2.dalbitlive.com/store> 스토어
- <https://devm2.dalbitlive.com/pay?webview=new> 앱채팅화면에서 적용

## code

> /src/pages/pay

```
  if (__NODE_ENV === 'dev' && _.hasIn(props, 'location.state.result')) {
    if (props.location.state.result === 'success') {
      alert('### 결제완료_화면디자인필요 ###')
      alert(props.location.state.message)
      alert(JSON.stringify(props.location.state, null, 1))
      Hybrid('CloseLayerPopup')
      //메인에서 스토어에서 뒤로가기 막아야함

      window.location.href = '/'
      //--------------------결제완료
    }
  }
```

- 위의화면이 실제 결제완료되었을때,적용되는화면
- [이슈] Android에서 백버튼이 히스토리가 남아있는관계로, main으로 이동시 히스토리 지우는방법 논의중.
