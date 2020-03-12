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
    new CustomEvent('native-start', {
      detail: {
        bjNickNm: '손완휘',
        roomNo: '1111',
        bjProfImg: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
        title: '상쾌한 아침을 함께해요✨'
      }
    })
  )
  return true
  //document.dispatchEvent(new Event('REACT-callback'))
}
