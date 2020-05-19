/**
 * App -> React sampleCode
 * @params "detail" 속성으로 전달
 */
function debug(obj) {
  document.dispatchEvent(
    new CustomEvent('react-debug', {
      detail: obj
    })

    /*
    example) debug({title:'111',msg:'ssss'})

    document.dispatchEvent(
      new CustomEvent('react-debug', {
        detail: {
          title: '타이틀',
          message: '메시지 내용 에러메시지내용 '
        }
      })
    */
  )
}
function native() {
  document.dispatchEvent(
    new CustomEvent('native-push-foreground', {
      detail: `{"push_type":"1","mem_no":"11583120797169","content":"1234545"}`
    })
  )
  return true
}
function native1() {
  document.dispatchEvent(
    new CustomEvent('native-push-background', {
      detail: `{"push_type":"1","room_no":"1111"}`
    })
  )
  return true
}
