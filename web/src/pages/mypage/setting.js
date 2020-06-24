import React, {useEffect, useState, useContext, useRef} from 'react'
import {Switch, Redirect, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import Header from './component/header'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
//image
import camera from 'images/camera.svg'

export default (props) => {
  const context = useContext(Context)
  const {profile, token} = context
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState(null)
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const [mypage, setMypage] = useState(null)

  const nicknameReference = useRef()
  const {isOAuth} = token

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
    //파일을 배열 버퍼로 읽는 최신 약속 기반 API입니다
    reader.readAsArrayBuffer(file)
    // reader.readAsDataURL(file)

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

  const changeNickname = (e) => {
    const {currentTarget} = e
    if (currentTarget.value.length > 20) {
      return
    }
    setNickname(currentTarget.value.replace(/ /g, ''))
  }

  const changeMsg = (e) => {
    const {currentTarget} = e
    if (currentTarget.value.length > 100) {
      return
    } else {
      setProfileMsg(currentTarget.value)
    }
  }

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

    console.log('data', data)

    const res = await Api.profile_edit({data})
    if (res && res.result === 'success') {
      context.action.updateProfile({...res.data, birth: profile.birth})
      return context.action.alert({
        msg: '저장되었습니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
          props.history.push('/menu/profile')
        }
      })
    } else {
      return context.action.alert({
        title: `${res.messageKey}`,
        msg: `${res.message}`
      })
    }
  }

  const [firstSetting, setFirstSetting] = useState(false)

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

  if (mypage === null) {
    setMypage(undefined)
    Api.mypage().then((result) => {
      setMypage(result.data)
    })
    return null
  }

  return (
    <Switch>
      {!token.isLogin ? (
        <Redirect to={`/`} />
      ) : (
        <Layout {...props} status="no_gnb">
          <Content>
            <SettingWrap>
              {/* 공통타이틀:TopWrap */}
              <Header>
                <div className="category-text">내 정보 관리</div>
              </Header>

              <ProfileImg>
                <label htmlFor="profileImg">
                  <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />
                  <img
                    src={tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''}
                    className="backImg"></img>
                  <img src={camera} style={{position: 'absolute', bottom: '-5px', right: '-15px'}} />
                </label>
              </ProfileImg>
              <div className="nickname">
                <label htmlFor="nickName" className="input-label">
                  닉네임
                </label>
                <NicknameInput
                  id="nickName"
                  ref={nicknameReference}
                  autoComplete="off"
                  defaultValue={profile.nickNm}
                  onChange={changeNickname}
                />
              </div>
              <label className="input-label">아이디</label>
              <UserId>{`@${profile.memId}`}</UserId>

              {token.memNo[0] === '1' && (
                <>
                  <label className="input-label">비밀번호</label>
                  <PasswordWrap>
                    <PasswordTextWrap>
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

              <label className="input-label">생년월일</label>
              {mypage && (
                <BirthDate>{`${mypage.birth.slice(0, 4)}-${mypage.birth.slice(4, 6)}-${mypage.birth.slice(6)}`}</BirthDate>
              )}
              <label className="input-label">성별</label>
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
                      <GenderTab className={profile.gender === 'm' ? '' : 'off'}>남자</GenderTab>
                    ) : (
                      <GenderTab className={profile.gender === 'f' ? 'woman' : 'off woman'}>여자</GenderTab>
                    )}
                  </>
                )}
              </GenderWrap>

              <GenderAlertMsg>* 생년월일, 성별 수정은 고객센터로 문의해주세요.</GenderAlertMsg>

              <div className="msg-wrap">
                <label className="input-label">프로필 메세지</label>
                <MsgText defaultValue={profile.profMsg} onChange={changeMsg} maxLength={100} />
              </div>
              <SaveBtn onClick={saveUpload}>저장</SaveBtn>
            </SettingWrap>
          </Content>
        </Layout>
      )}
    </Switch>
  )
}

const SaveBtn = styled.button`
  margin-top: 20px;
  width: 100%;
  letter-spacing: -0.4px;
  background-color: #632beb;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
  background: #632beb;
  color: #fff;
  line-height: 44px;
  font-size: 18px;
  border-radius: 4px;
  font-weight: bold;
`

const MsgText = styled.textarea`
  display: block;
  width: 100%;
  border: 1px solid #e0e0e0;
  resize: none;
  padding: 16px;
  height: 116px;
  font-family: inherit;
  color: #000000;
  transform: skew(-0.03deg);
  font-size: 14px;
  line-height: 20px;
  outline: none;
  border-radius: 4px;
`

const MsgTitle = styled.div`
  color: #616161;
  letter-spacing: -0.4px;
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 8px;
`

const GenderAlertMsg = styled.div`
  color: #616161;
  font-size: 14px;
  margin-top: 8px;
  letter-spacing: -0.5px;
  transform: skew(-0.03deg);
`

const GenderTab = styled.div`
  width: 50%;
  padding: 9px 0;
  text-align: center;
  user-select: none;
  box-sizing: border-box;
  color: #616161;
  border-radius: 4px 0 0 4px;

  ::before {
    display: inline-block;
    width: 10px;
    height: 16px;
    margin-right: 5px;
    background: url(${IMG_SERVER}/images/api/ico_male.svg) no-repeat center;
    content: '';
    vertical-align: top;
    margin-top: 2px;
  }

  & + & {
    border-left: 1px solid #bdbdbd;
    border-radius: 0 4px 4px 0;

    ::before {
      display: inline-block;
      width: 10px;
      height: 16px;
      margin-right: 5px;
      background: url(${IMG_SERVER}/images/api/ico_female.svg) no-repeat center;
      content: '';
      vertical-align: top;
      margin-top: 2px;
    }
  }

  &.woman::before {
    background: url(${IMG_SERVER}/images/api/ico_female.svg) no-repeat center;
  }

  &.off {
    color: #9e9e9e;
    background-color: #fff;
  }
`
const GenderWrap = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  &.before > div {
    background-color: ${COLOR_MAIN};
    color: #fff;
    &.off {
      color: #9e9e9e;
      background-color: #fff;
    }
  }

  &.after > div {
    width: 100%;
    background-color: #eee;
    cursor: not-allowed;
    &.off {
      color: #9e9e9e;
      background-color: #fff;
    }
  }
`

const BirthDate = styled.div`
  padding: 9px 10px;
  background-color: #eee;
  box-sizing: border-box;
  color: #616161;
  cursor: not-allowed;
  border-radius: 4px;
`

const PasswordRedirectBtn = styled.button`
  width: 100%;
  a {
    display: block;
    width: 100%;
    font-size: 16px;
    color: #fff;
    padding: 11px 0;
    background-color: #9e9e9e;
    border-radius: 4px;
  }
`

const PasswordCircle = styled.div`
  display: none;
  width: 10px;
  height: 10px;
  background-color: #9e9e9e;
  border-radius: 50%;
  margin: 0 2px;
`

const PasswordTextWrap = styled.div`
  /* display: flex; */
  display: none;
  align-items: center;
  width: calc(100% - 128px);
  border: 1px solid #e0e0e0;
  border-right: none;
  background-color: #eee;
  box-sizing: border-box;
  padding-left: 18px;
  cursor: not-allowed;
  border-radius: 4px;
`

const PasswordWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const UserId = styled.div`
  padding: 9px 10px;
  background-color: #eee;
  box-sizing: border-box;
  color: #616161;
  letter-spacing: -0.4px;
  cursor: not-allowed;
  border-radius: 4px;
`
const NicknameInput = styled.input.attrs({type: 'text'})`
  display: block;
  border: 1px solid #bdbdbd;
  padding: 8px 10px;
  width: 100%;
  border-radius: 4px;
`

const ProfileImg = styled.div`
  position: relative;
  margin: 0 auto;
  margin-bottom: 16px;
  margin-top: 20px;
  /* border: 1px solid #8556f5; */
  border-radius: 50%;
  width: 88px;
  height: 88px;
  /* cursor: pointer; */
  /* background-size: cover;
  background-position: center; */

  .backImg {
    display: block;
    width: 88px;
    height: 88px;
    border: 1px solid #8556f5;
    border-radius: 50%;
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

  .close-btn {
    position: absolute;
    top: 6px;
    left: 2%;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    padding: 0 16px;
  }
`

const Content = styled.section`
  margin: 0 0 20px 0;
  canvas {
    position: relative;
    margin: 0 auto;
    margin-bottom: 16px;
    margin-top: 20px;
    border: 1px solid #8556f5;
    border-radius: 50%;
    width: 88px;
    height: 88px;
    cursor: pointer;
    background-size: cover;
    background-position: center;
  }

  .input-label {
    display: block;
    width: 100%;
    color: #424242;
    font-size: 14px;
    line-height: 16px;
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: bold;

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
