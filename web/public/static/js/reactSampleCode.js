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
  // document.dispatchEvent(
  //   new CustomEvent('native-goLogin', {
  //     detail: {title: 'text', auth: '111112222CCCCCDDDDD'}
  //   })
  // )
  document.dispatchEvent(
    new CustomEvent('native-room-check', {
      detail: {
        memNo: '81586743438500'
      }
    })
  )
  return true
  //document.dispatchEvent(new Event('REACT-callback'))
}
