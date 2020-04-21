/**
 * @title : 푸쉬알람
 * @params "detail" 속성으로 전달
 */
function pushBackground(event) {
  //alert(event.type)
  var info = event.detail
  var push_type = JSON.parse(event.detail).push_type || ''
  var room_no = JSON.parse(event.detail).room_no || ''
  var mem_no = JSON.parse(event.detail).mem_no || ''

  window.location.href = `/?push_redirect&push_type=${push_type}&room_no=${room_no}&mem_no=${mem_no}`
}

//--------------------------------------------------------------------
document.addEventListener('native-push-background', pushBackground)
