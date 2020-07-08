import React, {useState, useEffect, useContext, useReducer, useRef} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import Utility from 'components/lib/utility'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'

//components
import Layout from 'pages/common/layout/new_layout'

//static
import icoProfile from './static/ico-profil.svg'
import icoCamera from './static/ico-camera.svg'

let intervalId = null
let setTime = 300

export default (props) => {
  const context = useContext(Context)
  const {webview, redirect} = qs.parse(location.search)

  const memIdRef = useRef(null)
  const authRef = useRef(null)

  const [timeText, setTimeText] = useState()
  const [btnState, setBtnState] = useState({
    memId: false,
    auth: false
  })
  const [tempPhoto, setTempPhoto] = useState(null)

  //SNS 회원가입 셋팅
  let snsInfo = qs.parse(location.search)

  if (_.hasIn(snsInfo, 'nickNm')) {
    snsInfo = {...snsInfo, nickNm: snsInfo.nickNm.replace(/(\s*)/g, '')}
  }
  if (_.hasIn(snsInfo, 'profImgUrl') && snsInfo.profImgUrl.includes('http://')) {
    snsInfo = {...snsInfo, profImgUrl: snsInfo.profImgUrl.replace('http://', 'https://')}
  }

  function reducer(state, action) {
    const {name, value} = action

    //휴대폰번호
    if (name === 'memId' && value.length === 11) {
      setBtnState({
        ...btnState,
        memId: true
      })
    } else {
      setBtnState({
        ...btnState,
        memId: false
      })
    }

    //인증번호
    if (name === 'auth') {
      if (value.length === 6) {
        setBtnState({
          ...btnState,
          auth: true
        })
      } else if (value.length > 6) {
        return {...state}
      } else {
        setBtnState({
          ...btnState,
          auth: false
        })
      }
    }

    return {
      ...state,
      [name]: value
    }
  }

  const [changes, dispatch] = useReducer(reducer, {
    memId: '',
    loginPwd: '',
    loginPwdCheck: '',
    nickNm: '',
    birth: '',
    gender: 'n',
    profImgUrl: '',
    memType: 'p',
    allTerm: 'n',
    term1: 'n',
    term2: 'n',
    term3: 'n',
    term4: 'n',
    auth: '',
    CMID: '',
    ...snsInfo
  })

  function validateReducer(state, validate) {
    return {
      ...state,
      [validate.name]: {
        check: validate.check,
        text: validate.text === undefined ? '' : validate.text
      }
    }
  }

  const [validate, setValidate] = useReducer(validateReducer, {
    memId: {
      check: true,
      text: ''
    },
    auth: {
      check: true,
      text: ''
    },
    loginPwd: {
      check: true,
      text: ''
    },
    loginPwdCheck: {
      check: true,
      text: ''
    },
    nickNm: {
      check: true,
      text: ''
    },
    birth: {
      check: true,
      text: ''
    },
    term: {
      check: true,
      text: ''
    },
    time: {
      check: true,
      text: ''
    },
    memIdBtn: {
      check: true,
      text: ''
    },
    authBtn: {
      check: true,
      text: ''
    }
  })

  const {
    memId,
    loginPwd,
    loginPwdCheck,
    nickNm,
    birth,
    gender,
    profImgUrl,
    memType,
    allTerm,
    term1,
    term2,
    term3,
    term4,
    auth,
    CMID
  } = changes

  //------------------------------------------------------------------------------
  //휴대폰 본인인증
  const validateID = (target) => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const memIdVal = target
    if (memIdVal !== undefined) {
      if (memIdVal.length >= 11) {
        if (!rgEx.test(memIdVal)) {
          setValidate({
            name: 'memId',
            check: false,
            text: '올바른 휴대폰 번호가 아닙니다.'
          })
          return false
        } else {
          setValidate({
            name: 'memId',
            check: true
          })
          return true
        }
      }
    }
  }

  const fetchSmsReq = async () => {
    if (!validateID(memId)) return null
    const {result, data, message} = await Api.sms_request({
      data: {
        phoneNo: memId,
        authType: 0
      }
    })
    if (result === 'success') {
      dispatch({name: 'CMID', value: data.CMID})
      setValidate({
        name: 'memId',
        check: true,
        text: '인증번호 요청이 완료되었습니다.'
      })
      memIdRef.current.disabled = true
      authRef.current.disabled = false
      startAuthTimer()
    } else {
      setValidate({name: 'memId', check: false, text: message})
      context.action.alert({
        msg: message
      })
    }
  }

  const fetchSmsCheck = async () => {
    const {result, message} = await Api.sms_check({
      data: {
        CMID: CMID,
        code: Number(auth)
      }
    })
    if (result === 'success') {
      setValidate({name: 'auth', check: true, text: message})
      setValidate({name: 'memId', check: true, text: ''})
      clearInterval(intervalId)
      setTimeText('')
      authRef.current.disabled = true
      setBtnState({memId: false, auth: false})
    } else {
      setValidate({
        name: 'auth',
        check: false,
        text: '인증번호(가) 일치하지 않습니다.'
      })
    }
  }

  const startAuthTimer = () => {
    clearInterval(intervalId)
    setTime = 300
    intervalId = setInterval(() => {
      let timer = `${Utility.leadingZeros(Math.floor(setTime / 60), 2)}:${Utility.leadingZeros(setTime % 60, 2)}`
      setTimeText(timer)
      setTime--
      if (setTime < 0) {
        clearInterval(intervalId)
        setValidate({
          name: 'memId',
          check: false,
          text: '인증시간이 초과되었습니다.'
        })
        authRef.current.disabled = true
        setBtnState({memId: true, auth: true})
      }
    }, 1000)
  }

  //프로필사진
  const uploadSingleFile = (e) => {
    let reader = new FileReader()
    const file = e.target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }

    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.'
      })
    }

    //파일을 배열 버퍼로 읽는 최신 약속 기반 API
    reader.readAsArrayBuffer(file)
    //오리엔테이션 뽑아내는 함수
    function getOrientation(buffer) {
      var view = new DataView(buffer)
      if (view.getUint16(0, false) !== 0xffd8) {
        return {
          buffer: view.buffer,
          orientation: -2
        }
      }
      var length = view.byteLength,
        offset = 2
      while (offset < length) {
        var marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return {
              buffer: view.buffer,
              orientation: -1
            }
          }
          var little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          var tags = view.getUint16(offset, little)
          offset += 2
          for (var i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              const orientation = view.getUint16(offset + i * 12 + 8, little)
              view.setUint16(offset + i * 12 + 8, 1, little)
              return {
                buffer: view.buffer,
                orientation
              }
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break
        } else {
          offset += view.getUint16(offset, false)
        }
      }
      return {
        buffer: view.buffer,
        orientation: -1
      }
    }
    //캔버스로 그려서 dataurl 로 뽑아내는 함수
    function drawAdjustImage(img, orientation) {
      const cnvs = document.createElement('canvas')
      const ctx = cnvs.getContext('2d')
      let dx = 0
      let dy = 0
      let dw
      let dh
      let deg = 0
      let vt = 1
      let hr = 1
      let rad
      let sin
      let cos
      cnvs.width = orientation >= 5 ? img.height : img.width
      cnvs.height = orientation >= 5 ? img.width : img.height
      switch (orientation) {
        case 2: // flip horizontal
          hr = -1
          dx = cnvs.width
          break
        case 3: // rotate 180 degrees
          deg = 180
          dx = cnvs.width
          dy = cnvs.height
          break
        case 4: // flip upside down
          vt = -1
          dy = cnvs.height
          break
        case 5: // flip upside down and rotate 90 degrees clock wise
          vt = -1
          deg = 90
          break
        case 6: // rotate 90 degrees clock wise
          deg = 90
          dx = cnvs.width
          break
        case 7: // flip upside down and rotate 270 degrees clock wise
          vt = -1
          deg = 270
          dx = cnvs.width
          dy = cnvs.height
          break
        case 8: // rotate 270 degrees clock wise
          deg = 270
          dy = cnvs.height
          break
      }
      rad = deg * (Math.PI / 180)
      sin = Math.sin(rad)
      cos = Math.cos(rad)
      ctx.setTransform(cos * hr, sin * hr, -sin * vt, cos * vt, dx, dy)
      dw = orientation >= 5 ? cnvs.height : cnvs.width
      dh = orientation >= 5 ? cnvs.width : cnvs.height
      ctx.drawImage(img, 0, 0, dw, dh)
      return cnvs.toDataURL('image/jpeg', 1.0)
    }

    reader.onload = function () {
      if (reader.result) {
        const originalBuffer = reader.result
        const {buffer, orientation} = getOrientation(originalBuffer)
        const blob = new Blob([buffer])
        //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
        const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
        const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
        const img = new Image()
        img.src = cacheURL

        setTempPhoto(originalCacheURL)

        img.onload = async () => {
          const limitSize = 1280
          if (img.width > limitSize || img.height > limitSize) {
            img.width = img.width / 5
            img.height = img.height / 5
          }

          const encodedDataAsBase64 = drawAdjustImage(img, orientation)
          uploadImageToServer(encodedDataAsBase64)
        }

        async function uploadImageToServer(data) {
          const res = await Api.image_upload({
            data: {
              dataURL: data,
              uploadType: 'profile'
            }
          })
          if (res.result === 'success') {
            dispatch({
              name: 'profImgUrl',
              value: res.data.path
            })
          } else {
            context.action.alert({
              msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.'
            })
          }
        }
      }
    }
  }

  useEffect(() => {
    //console.log(memIdRef)
  }, [memIdRef])

  return (
    <Layout status="no_gnb" header="회원가입">
      <Content>
        {/* 휴대폰 본인인증 -------------------------------------------------------- */}
        <InputItem button={true} validate={validate.memId.check}>
          <div className="layer">
            <label htmlFor="memId">휴대폰 번호</label>
            <input
              type="tel"
              ref={memIdRef}
              id="memId"
              name="memId"
              placeholder="휴대폰 번호를 입력해주세요"
              maxLength={11}
              autoComplete="off"
              value={memId}
              onChange={(e) => dispatch(e.target)}
            />
            <button disabled={!btnState.memId} onClick={fetchSmsReq}>
              인증요청
            </button>
          </div>
          {validate.memId.text && <p className="help-text">{validate.memId.text}</p>}
        </InputItem>
        <InputItem button={true} validate={validate.auth.check}>
          <div className="layer">
            <label htmlFor="auth">인증번호</label>
            <input
              type="number"
              ref={authRef}
              id="auth"
              name="auth"
              placeholder="인증번호를 입력해주세요"
              autoComplete="off"
              value={auth}
              onChange={(e) => dispatch(e.target)}
              disabled={true}
            />
            <span className="timer">{timeText}</span>
            <button disabled={!btnState.auth} onClick={fetchSmsCheck}>
              인증확인
            </button>
          </div>
          {validate.auth.text && <p className="help-text">{validate.auth.text}</p>}
        </InputItem>

        {/* 프로필 사진 ---------------------------------------------------------- */}
        <ProfileUpload imgUrl={tempPhoto ? tempPhoto : profImgUrl} className={memType !== 'p' && 'top'}>
          <label htmlFor="profileImg">
            <div></div>
            <span>클릭 이미지 파일 추가</span>
          </label>
          <input
            type="file"
            id="profileImg"
            accept="image/jpg, image/jpeg, image/png"
            onChange={(e) => {
              uploadSingleFile(e)
            }}
          />
          <p className="img-text">프로필 사진을 등록 해주세요</p>
        </ProfileUpload>
      </Content>
    </Layout>
  )
}

const Content = styled.section`
  padding: 12px 16px;
`

const InputItem = styled.div`
  & + & {
    margin-top: 4px;
  }
  .layer {
    position: relative;
    height: 58px;

    letter-spacing: -0.5px;

    label {
      display: block;
      position: relative;
      padding-top: 9px;
      color: #000;
      font-size: 12px;
      line-height: 12px;
      text-indent: 16px;
      z-index: 1;
    }

    input {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: ${(props) => (props.button ? 'calc(100% - 106px)' : 'calc(100% - 28px)')};
      padding: ${(props) => (props.button ? '20px 90px 4px 15px' : '20px 12px 4px 15px')};
      border-radius: 12px;
      border: 1px solid;
      border-color: ${(props) => (props.validate ? '#e0e0e0' : '#ec455f')};
      background: #fff;
      height: 32px;
      font-size: 16px;
      font-weight: 800;
      line-height: 32px;
      box-sizing: content-box;
    }

    input:focus {
      border-color: #000;
    }

    input::placeholder {
      font-size: 14px;
      color: #bdbdbd;
      font-weight: 400;
    }

    input:disabled {
      background: #fff;
      color: #9e9e9e;
    }

    input:focus {
      &::after {
        display: block;
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-radius: 12px;
        content: '';
      }
    }

    .timer {
      position: absolute;
      right: 98px;
      top: 28px;
      font-size: 14px;
      font-weight: bold;
      color: #ec455f;
      z-index: 1;
    }

    button {
      display: inline-block;
      position: absolute;
      right: 4px;
      bottom: 4px;
      height: 32px;
      padding: 0 10px;
      border-radius: 9px;
      background: ${COLOR_MAIN};
      color: #fff;
      line-height: 32px;
      letter-spacing: -0.5px;

      :disabled {
        background: #bdbdbd;
      }
    }
  }

  .help-text {
    display: block;
    margin-top: -17px;
    padding: 23px 12px 7px 12px;
    border-radius: 12px;
    color: #fff;
    font-size: 11px;
    line-height: 14px;
    background: #9e9e9e;
    text-align: center;
  }
`

//프로필 업로드 영역
const ProfileUpload = styled.div`
  margin: 20px 0 16px 0;
  text-align: center;
  &.top {
    margin-top: -20px;
  }
  input {
    position: absolute;
    height: 0;
    width: 0;
  }
  div {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid ${COLOR_MAIN};
    background: url(${(props) => (props.imgUrl ? props.imgUrl : icoProfile)}) no-repeat center center / cover;
    background-size: ${(props) => (props.imgUrl ? 'cover' : '73px 73px')};
  }
  div.on {
    img {
      display: none;
    }
  }
  label {
    display: block;
    position: relative;
    width: 72px;
    margin: 0 auto;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      bottom: -4px;
      right: -13px;
      width: 30px;
      height: 30px;
      background: url(${icoCamera}) no-repeat center / cover;
      text-indent: -9999px;
    }
  }

  .img-text {
    padding-top: 8px;
    font-size: 14px;
    color: ${COLOR_MAIN};
    font-weight: 600;
    letter-spacing: -0.5px;
    text-align: center;
    transform: skew(-0.03deg);
  }
`
