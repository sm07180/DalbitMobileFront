/**
 * App -> React sampleCode
 * @params "detail" 속성으로 전달
 */
function native() {
  // document.dispatchEvent(
  //   new CustomEvent('native-goLogin', {
  //     detail: {title: 'text', auth: '111112222CCCCCDDDDD'}
  //   })
  // )
  document.dispatchEvent(
    new CustomEvent('native-player-show', {
      detail: {
        roomNo: '1111',
        bjNickNm: '2222',
        title: '3333',
        bjProfImg: '4444',
        auth: '555'
      }
    })
  )
  return true
  //document.dispatchEvent(new Event('REACT-callback'))
}
