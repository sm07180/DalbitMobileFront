import React, {useEffect, useState, useContext, useRef} from 'react'
import {Switch, Redirect, Link} from 'react-router-dom'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//layout
import Layout from 'pages/common/layout'
import Header from './component/header'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
import {DalbitTextArea} from './content/textarea'
//image
import camera from 'images/camera.svg'
import MaleIcon from './static/ico_male.svg'
import FeMaleIcon from './static/ico_female.svg'
import calIcon from './static/calender_b.svg'

export default (props) => {
  // ctx

  const context = useContext(Context)

  const {profile, token} = context
  const {isOAuth} = token
  const history = useHistory()
  // state
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState(null)
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [firstSetting, setFirstSetting] = useState(false)
  const [mypageBirth, setMypageBirth] = useState('')
  //ref
  const nicknameReference = useRef()
  // setting img upload func  + mobile rotater
  const profileImageUpload = (e) => {
    const target = e.currentTarget
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
        }
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
    reader.onload = async () => {
      if (reader.result) {
        const originalBuffer = reader.result
        const {buffer, orientation} = getOrientation(originalBuffer)
        const blob = new Blob([buffer])
        //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
        const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
        const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
        const img = new Image()
        img.src = cacheURL

        setPhotoUploading(true)
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
            setPhotoPath(res.data.path)
            setPhotoUploading(false)
          } else {
            context.action.alert({
              msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
              title: '',
              callback: () => {
                context.action.alert({visible: false})
              }
            })
          }
        }
      }
    }
  }
  // change nick name func
  const changeNickname = (e) => {
    const {currentTarget} = e
    if (currentTarget.value.length > 20) {
      return
    }
    setNickname(currentTarget.value.replace(/ /g, ''))
  }
  // change Msg func

  const changeMsg = (e) => {
    let {value} = e.target
    const lines = value.split('\n').length
    const a = value.split('\n')
    const cols = 30
    if (lines < 6) {
      if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
        value += '\n'
      } else if (a[lines - 1].length > cols) {
        const b = a[lines - 1].substr(0, cols) + '\n' + a[lines - 1].substr(cols, a[lines - 1].length - 1)
        a.pop()
        value = a.join('\n') + '\n' + b
      }
      setProfileMsg(value)
    } else if (lines > 5) {
      return
    }
  }
  // upload validate
  const saveUpload = async () => {
    if (!profile.nickNm) {
      return context.action.alert({
        msg: '닉네임을 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
          if (nicknameReference.current) {
            nicknameReference.current.focus()
          }
        }
      })
    }
    if (photoUploading) {
      return context.action.alert({
        msg: '프로필 사진 업로드 중입니다.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
    //##submit
    const data = {
      gender: gender,
      nickNm: nickname || profile.nickNm,
      birth: profile.birth,
      profMsg: profileMsg || profile.profMsg,
      profImg: photoPath || profile.profImg.path
    }
    //fetch
    const res = await Api.profile_edit({data})
    if (res && res.result === 'success') {
      context.action.updateProfile({...res.data, birth: profile.birth})
      return context.action.alert({
        msg: '저장되었습니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
          history.push('/menu/profile')
        }
      })
    } else {
      return context.action.alert({
        title: `${res.messageKey}`,
        msg: `${res.message}`
      })
    }
  }
  //----------------------------------------------------
  useEffect(() => {
    if (profile !== null) {
      setNickname(profile.nickNm)
      setProfileMsg(profile.profMsg)
      setPhotoPath(profile.profImg.path)
      setGender(profile.gender)
      if (profile.gender == 'n') {
        setFirstSetting(true)
      }
    }
  }, [profile])
  useEffect(() => {
    const getMyPageNew = async () => {
      if (profile === null || profile || profile.birth === '') {
        Api.mypage().then((result) => {
          if (profile instanceof Object) {
            context.action.updateProfile({
              ...profile,
              ...result.data
            })
          }
        })
        return null
      }
    }
    getMyPageNew()
  }, [])
  //null check updateProfile
  // if (profile === null) {
  //   Api.mypage().then((result) => {
  //     context.action.updateProfile(result.data)
  //   })
  //   return null
  // }
  // if (profile && profile.birth === '') {
  //   Api.mypage().then((result) => {
  //     context.action.updateProfile(result.data)
  //   })
  //   return null
  // }
  //------------------------------------------------------
  return (
    <Switch>
      {!token.isLogin ? (
        <Redirect to={`/`} />
      ) : (
        <Layout {...props} status="no_gnb">
          <Content>
            <SettingWrap>
              <Header>
                <div className="category-text">프로필 설정</div>
              </Header>
              {/* 공통타이틀:TopWrap */}
              <div className="individual_Wrap">
                <ProfileImg>
                  <label htmlFor="profileImg">
                    <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />

                    <div
                      className="backImg"
                      style={{
                        backgroundImage: `url("${
                          tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''
                        }")`,
                        backgroundColor: '#333'
                      }}></div>
                    {/* <img
                      src={tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''}
                      className="backImg"></img> */}
                    <img
                      src={camera}
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        right: '-15px'
                      }}
                      className="cameraImg"
                    />
                  </label>
                </ProfileImg>

                <div className="nickname">
                  <span className="matchTitle">닉네임</span>
                  <NicknameInput
                    id="nickName"
                    ref={nicknameReference}
                    matchTitle
                    autoComplete="off"
                    defaultValue={profile.nickNm}
                    onChange={changeNickname}
                    maxLength="20"
                  />
                </div>

                <UserId>
                  <span className="matchTitle">UID</span>
                  <span>{profile.memId}</span>
                </UserId>

                {token.memNo[0] === '1' && (
                  <>
                    <PasswordWrap>
                      <span className="matchTitle">비밀번호</span>
                      <PasswordTextWrap>
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                        <PasswordCircle />
                      </PasswordTextWrap>

                      <PasswordRedirectBtn>
                        <a href="/password">비밀번호 변경</a>
                      </PasswordRedirectBtn>
                    </PasswordWrap>
                  </>
                )}

                <div className="birthBox">
                  <span className="matchTitle">생년월일</span>
                  <BirthDate>{`${profile.birth.slice(0, 4)}.${profile.birth.slice(4, 6)}.${profile.birth.slice(6)}`}</BirthDate>
                  <GenderAlertMsg>생년월일 수정을 원하시는 경우 고객센터로 문의해주세요.</GenderAlertMsg>
                </div>
                <GenderWrap className={firstSetting ? 'before' : 'after'}>
                  {firstSetting ? (
                    <>
                      <GenderTab
                        className={gender === 'm' ? '' : 'off'}
                        onClick={() => {
                          if (gender === 'm') {
                            setGender('n')
                          } else {
                            setGender('m')
                          }
                        }}>
                        남자
                      </GenderTab>

                      <GenderTab
                        className={gender === 'f' ? '' : 'off'}
                        onClick={() => {
                          if (gender === 'f') {
                            setGender('n')
                          } else {
                            setGender('f')
                          }
                        }}>
                        여자
                      </GenderTab>
                    </>
                  ) : (
                    <>
                      {profile.gender === 'm' ? (
                        <GenderTab className={`one-btn man ${profile.gender === 'm' ? '' : 'off'}`}>남자</GenderTab>
                      ) : (
                        <GenderTab className={`one-btn woman ${profile.gender === 'f' ? '' : 'off'}`}>여자</GenderTab>
                      )}
                    </>
                  )}
                </GenderWrap>

                <div className="msg-wrap">
                  <label className="input-label">프로필 메시지</label>
                  <DalbitTextArea
                    defaultValue={profile.profMsg}
                    state={profileMsg}
                    setState={setProfileMsg}
                    cols={20}
                    rows={5}
                    className="MsgText"
                    placeholder="프로필 메시지는 최대 100자까지 입력할 수 있습니다."
                  />
                  {/* <GenderAlertMsg>프로필 메시지는 최대 100자까지 입력할 수 있습니다.</GenderAlertMsg> */}
                </div>

                <SaveBtn onClick={saveUpload}>저장</SaveBtn>
              </div>
            </SettingWrap>
          </Content>
        </Layout>
      )}
    </Switch>
  )
}
// style
const SaveBtn = styled.button`
  margin-top: 32px;
  width: 100%;
  letter-spacing: -0.4px;
  background-color: #632beb;
  cursor: pointer;
  margin-bottom: 20px;
  background: #632beb;
  color: #fff;
  line-height: 44px;
  font-size: 18px;
  border-radius: 12px;
  font-weight: bold;
`
const MsgText = styled.textarea`
  display: block;
  width: 100%;
  border: 1px solid #e0e0e0;
  resize: none;
  padding: 12px;
  height: 116px;
  font-family: inherit;
  color: #000000;
  transform: skew(-0.03deg);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  outline: none;
  border-radius: 12px;
  :focus {
    border: 1px solid #000;
  }
`

const MsgTitle = styled.div`
  color: #616161;
  letter-spacing: -0.4px;
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 8px;
`

const GenderAlertMsg = styled.div`
  position: absolute;
  width: 100%;
  top: 46px;
  padding: 22px 0 0 0;
  left: 0;
  bottom: 0;
  z-index: 2;
  text-align: center;
  height: 44px;
  margin-bottom: 4px;
  background-color: #9e9e9e;
  color: #616161;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  vertical-align: bottom;
  border-radius: 12px;
  letter-spacing: -0.5px;
  transform: skew(-0.03deg);
`

const GenderTab = styled.div`
  width: 50%;
  height: 44px;
  line-height: 44px;
  text-align: left;
  user-select: none;
  box-sizing: border-box;
  color: #9e9e9e;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px 0 0 12px;
  padding-left: 16px;

  &.one-btn {
    text-align: center;
    &.woman {
      color: #f35da3 !important;
      border: 1px solid #f35da3;
    }
    &.man {
      color: #27a2db !important;
      border: 1px solid #27a2db;
    }
  }

  ::after {
    display: inline-block;
    width: 24px;
    height: 16px;
    margin-left: 5px;
    background: url(${MaleIcon}) no-repeat center;
    content: '';
    vertical-align: top;
    margin-top: 14px;
  }

  & + & {
    border-radius: 0 12px 12px 0;

    ::after {
      display: inline-block;
      width: 24px;
      height: 16px;
      margin-left: 5px;
      background: url(${FeMaleIcon}) no-repeat center;
      content: '';
      vertical-align: top;
      margin-top: 14px;
    }
  }

  &.woman::after {
    background: url(${FeMaleIcon}) no-repeat center;
  }

  &.off {
    color: #9e9e9e;
    border: 1px solid #000;
  }
`
const GenderWrap = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #e0e0e0;
  &.after {
    border: 0;
  }
  border-radius: 12px;
  margin-top: 24px;
  position: relative;
  &.before > div {
    border: 1px solid #000;
    background-color: #fff;
    text-align: center;
    color: #000;
    padding-left: 0;
    &.off {
      color: #9e9e9e;
      border: 1px solid #f5f5f5;
      background-color: #f5f5f5;
    }
  }

  &.before > div:nth-child(2).off {
    border-left: 1px solid #e0e0e0;
  }
  &.before > div:nth-child(2) {
    border-left: 1px solid #000;
  }

  &.after > div {
    width: 100%;
    background-color: #f5f5f5;
    border-radius: 12px;
    cursor: not-allowed;
    &.off {
      color: #9e9e9e;
      background-color: #fff;
    }
  }
`

const BirthDate = styled.div`
  position: relative;
  padding: 29px 16px 0 16px;
  height: 62px;
  z-index: 3;
  border-radius: 12px;
  border: solid 1px #e0e0e0;
  box-sizing: border-box;
  background-color: #f5f5f5;
  color: #616161;
  cursor: not-allowed;
  font-size: 16px;
  font-weight: 600;
  color: #9e9e9e;
  border-bottom: none;
  background: #f5f5f5 url(${calIcon}) no-repeat right 8px top 24px;
`

const PasswordRedirectBtn = styled.button`
  width: 100px;
  display: flex;
  margin-top: 22px;
  /* align-items: center; */
  justify-content: center;
  a {
    display: block;
    width: 100%;
    height: 32px;
    font-size: 16px;
    color: #fff;
    font-size: 14px;
    line-height: 32px;
    background-color: #bdbdbd;
    border-radius: 8px;
  }
`

const PasswordCircle = styled.div`
  display: block;
  width: 8px;
  height: 8px;
  background-color: #9e9e9e;
  border-radius: 50%;
  margin: 0 2px;
`

const PasswordTextWrap = styled.div`
  display: flex;
  /* display: none; */
  /* align-items: center; */
  width: calc(100% - 128px);
  margin-top: 29px;
  border-right: none;
  /* background-color: #eee; */
  box-sizing: border-box;
  padding: 6px 0 6px 0px;
  cursor: not-allowed;
`

const PasswordWrap = styled.div`
  position: relative;
  padding: 0px 4px 0px 16px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  height: 62px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  margin-bottom: 4px;

  .matchTitle {
    position: absolute;
    top: 9px;
    left: 16px;
    z-index: 2;
    font-size: 12px;
    line-height: 1.08;
    color: #000000;
  }
`

const UserId = styled.div`
  position: relative;
  padding: 20px 16px 0px 16px;
  height: 58px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  color: #9e9e9e;
  letter-spacing: -0.35px;
  cursor: not-allowed;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  margin-bottom: 4px;

  .matchTitle {
    position: absolute;
    top: 9px;
    left: 16px;
    z-index: 2;
    font-size: 12px;
    line-height: 1.08;
    color: #000000;
  }

  span:nth-child(2) {
    display: inline-block;
    line-height: 36px;
    height: 36px;
  }
`
const NicknameInput = styled.input.attrs({type: 'text'})`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  padding: 20px 16px 0px 16px;
  width: 100%;
  height: 58px;
  border-radius: 12px;
  background-color: #fff;
  font-size: 16px;
  font-weight: 800;
  color: #000000;
  margin-bottom: 4px;
  :focus {
    border: 1px solid #000;
  }
`

const ProfileImg = styled.div`
  position: relative;
  margin: 0 auto;
  margin-bottom: 12px;
  margin-top: 20px;
  /* border: 1px solid #8556f5; */
  border-radius: 50%;
  width: 72px;
  height: 72px;
  /* cursor: pointer; */
  /* background-size: cover;
  background-position: center; */
  .cameraImg {
    width: 30px;
    height: 30px;
  }
  .backImg {
    display: block;
    width: 72px;
    height: 72px;
    border: 1px solid #8556f5;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
  }
  label {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;

    cursor: pointer;
    input[type='file'] {
      position: absolute;
      width: 0;
      height: 0;
    }
  }

  & > input[type='file'] {
    position: absolute;
    width: 0;
    height: 0;
  }
`

const SettingWrap = styled.div`
  width: 394px;
  margin: 0 auto;
  .individual_Wrap {
    padding: 0 16px;
  }
  .close-btn {
    position: absolute;
    /* top: 6px; */
    left: 6px;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    /* height: 100vh; */
  }
  .msg-wrap {
    position: relative;
  }
`

const Content = styled.section`
  background-color: #eeeeee;
  margin: 0 0 0px 0;
  height: 100%;
  overflow: auto;
  .MsgText {
    display: block;
    width: 100%;
    border: 1px solid #e0e0e0;
    resize: none;
    padding: 12px;
    height: 116px;
    font-family: inherit;
    color: #000000;
    transform: skew(-0.03deg);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    outline: none;
    border-radius: 12px;
    :focus {
      border: 1px solid #000;
    }
  }

  .birthBox {
    position: relative;
    height: 72px;
    margin-bottom: 13px;
    .matchTitle {
      position: absolute;
      top: 9px;
      left: 16px;
      z-index: 5;
      font-size: 12px;
      line-height: 1.08;
      color: #000000;
    }
  }
  canvas {
    position: relative;
    margin: 0 auto;
    margin-bottom: 16px;
    margin-top: 20px;
    border: 1px solid #8556f5;
    border-radius: 50%;
    width: 72px;
    height: 72px;
    cursor: pointer;
    background-size: cover;
    background-position: center;
  }

  .input-label {
    display: block;
    width: 100%;
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 800;
    color: #000000;

    &.require:after {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-weight: bold;
      background: url(${IMG_SERVER}/images/api/icn_asterisk.svg) no-repeat center;
      content: '';
      vertical-align: bottom;
    }

    span {
      font-size: 12px;
    }
  }
  .nickname {
    position: relative;
    .matchTitle {
      position: absolute;
      top: 12px;
      left: 16px;
      z-index: 2;
      font-size: 12px;
      line-height: 1.08;
      color: #000000;
    }
  }
`
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
