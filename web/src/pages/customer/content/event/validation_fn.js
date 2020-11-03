export function winnerInspection(minorYn, state) {
  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

  if (!state.winner_email.match(regExp)) {
    return {
      state: false,
      content: '이메일 형식을 확인 후 다시 입력해주세요.'
    }
  }

  if (state.winner_address_2 === '') {
    return {
      state: false,
      content: '수령 받으실 주소를 입력해주세요.'
    }
  }

  if (state.files[0] === false) {
    return {
      status: false,
      content: '신분증 사본을 등록해주세요.'
    }
  }

  if (minorYn === 1) {
    if (state.files[1] === false) {
      return {
        status: false,
        content: '가족관계 증명서 또는\n주민등록 등본 사본을 등록해주세요.'
      }
    }
  }

  if (!state.check) {
    return {
      status: false,
      content: '개인정보 수집 및 이용에\n동의하셔야 경품 수령이 가능합니다.'
    }
  }

  return {
    status: true,
    content: ''
  }
}
