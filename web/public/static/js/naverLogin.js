var naverLogin = new naver.LoginWithNaverId({
  clientId: 'WK0ohRsfYc9aBhZkyApJ',
  callbackUrl: 'https://devm-hgkim1118.dalbitcast.com',
  isPopup: false,
  loginButton: {color: 'green', type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */,
  callbackHandle: false
  /* callback 페이지가 분리되었을 경우에 callback 페이지에서는 callback처리를 해줄수 있도록 설정합니다. */
})

/* (3) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
//naverLogin.init()
