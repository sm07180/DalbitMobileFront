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
    new CustomEvent('native-navigator', {
      detail: {url: '/login/'}
    })
  )
  return true
  //document.dispatchEvent(new Event('REACT-callback'))
}
