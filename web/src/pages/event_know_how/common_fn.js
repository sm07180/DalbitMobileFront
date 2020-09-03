export function InspectionCheckWithAlert(device, additional, title, contents, uploadFile) {
  if (device === -1) {
    return {
      status: false,
      msg: '디바이스를 선택해 주세요'
    }
  }
  if (additional.device1 === '') {
    return {
      stats: false,
      msg: '마이크 또는 기종을 입력해 주세요.'
    }
  }
  if (title === '') {
    return {
      status: false,
      msg: '노하우 제목을 입력해 주세요.'
    }
  }
  if (contents === '') {
    return {
      status: false,
      msg: '노하우 내용을 입력해 주세요.'
    }
  }
  if (uploadFile[0] === false) {
    return {
      status: false,
      msg: '이미지를 등록해 주세요.'
    }
  }

  return {
    status: true,
    msg: ''
  }
}
