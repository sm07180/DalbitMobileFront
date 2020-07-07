// /**
//  * @title : 푸쉬알람
//  * @params "detail" 속성으로 전달
//  * @notice : ios decodeURIComponent 확인
//  */
// function pushBackground(event) {
//   //alert(event.type)

//   try {
//     var info = decodeURIComponent(event.detail)
//     // var info = event.detail
//   } catch (error) {
//     //    alert(error)
//     console.error(error)
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
//   }

//   var push_type = JSON.parse(info).push_type || ''
//   var room_no = JSON.parse(info).room_no || ''
//   var mem_no = JSON.parse(info).mem_no || ''
//   //

//   window.sessionStorage.setItem('push_type', 'Y')
//   window.location.replace(`/?push_redirect&push_type=${push_type}&room_no=${room_no}&mem_no=${mem_no}`)
// }

// //--------------------------------------------------------------------
// //document.addEventListener('native-push-background', pushBackground)
