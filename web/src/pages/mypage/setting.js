import React, {useEffect, useState, useContext, useRef} from 'react'
import {Switch, Redirect, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'

//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
//image
import camera from 'images/camera.svg'

export default props => {
  const context = useContext(Context)
  const {profile, token} = context
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState(null)
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const nicknameReference = useRef()

  const profileImageUpload = e => {
    const target = e.currentTarget
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = ext => {
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

    reader.readAsDataURL(target.files[0])

    reader.onload = async () => {
      if (reader.result) {
        setPhotoUploading(true)
        const res = await Api.image_upload({
          data: {
            dataURL: reader.result,
            uploadType: 'profile'
          }
        })
        if (res.result === 'success') {
          setTempPhoto(reader.result)
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

  const changeNickname = e => {
    const {currentTarget} = e
    if (currentTarget.value.length > 20) {
      return
    }
    setNickname(currentTarget.value.replace(/ /g, ''))
  }

  const changeMsg = e => {
    const {currentTarget} = e
    setProfileMsg(currentTarget.value)
  }

  const saveUpload = async () => {
    if (!nickname) {
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

    const data = {
      gender: gender,
      nickNm: nickname,
      birth: profile.birth,
      profMsg: profileMsg
    }

    if (photoPath) {
      data['profImg'] = photoPath
    }

    const res = await Api.profile_edit({data})
    if (res && res.result === 'success') {
      context.action.updateProfile(res.data)
      return context.action.alert({
        msg: '저장되었습니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
          props.history.push('/')
        }
      })
    } else {
      return context.action.alert({
        title: `${res.messageKey}`,
        msg: `${res.message}`
      })
    }
  }

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickNm)
      setProfileMsg(profile.profMsg)
      setPhotoPath(profile.profImg.path)
      setGender(profile.gender)
    }
  }, [])

  return (
    <Switch>
      {!token.isLogin ? (
        <Redirect to={`/`} />
      ) : (
        <Layout {...props}>
          <Content>
            <SettingWrap>
              {/* 공통타이틀:TopWrap */}
              <TopWrap>
                <button onClick={() => window.history.back()}></button>
                <div className="title">내 정보 관리</div>
              </TopWrap>
              <ProfileImg
                style={{
                  backgroundImage: `url(${tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''})`
                }}>
                <label htmlFor="profileImg">
                  <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />
                  <img src={camera} style={{position: 'absolute', bottom: '-5px', right: '-15px'}} />
                </label>
              </ProfileImg>
              <div className="nickname">
                <NicknameInput ref={nicknameReference} autoComplete="off" value={nickname} onChange={changeNickname} />
              </div>
              <UserId>{`@${profile.memId}`}</UserId>
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
                  <Link to="/password">비밀번호 변경</Link>
                </PasswordRedirectBtn>
              </PasswordWrap>
              <BirthDate>{`${profile.birth.slice(0, 4)}-${profile.birth.slice(4, 6)}-${profile.birth.slice(6)}`}</BirthDate>
              <GenderWrap>
                <GenderTab className={gender === 'm' ? '' : 'off'} onClick={() => setGender('m')}>
                  남자
                </GenderTab>
                <GenderTab className={gender === 'f' ? '' : 'off'} onClick={() => setGender('f')}>
                  여자
                </GenderTab>
              </GenderWrap>

              <GenderAlertMsg>* 생년월일 수정을 원하시는 경우 고객센터로 문의해주세요.</GenderAlertMsg>

              <div className="msg-wrap">
                <MsgTitle>프로필 메세지</MsgTitle>
                <MsgText value={profileMsg} onChange={changeMsg} />
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
  margin-top: 60px;
  width: 100%;
  padding: 16px 0;
  color: #fff;
  text-align: center;
  font-size: 16px;
  letter-spacing: -0.4px;
  background-color: #8556f6;
  cursor: pointer;
`

const MsgText = styled.textarea`
  display: block;
  width: 100%;
  border: 1px solid #e0e0e0;
  resize: none;
  padding: 16px;
  height: 178px;
  font-family: inherit;
  color: #000000;
  transform: skew(-0.03deg);
  font-size: 14px;
  line-height: 20px;
  outline: none;
`

const MsgTitle = styled.div`
  margin-left: 16px;
  color: #616161;
  letter-spacing: -0.4px;
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 12px;
`

const GenderAlertMsg = styled.div`
  color: #bdbdbd;
  font-size: 12px;
  margin-top: 12px;
  transform: skew(-0.03deg);
`

const GenderTab = styled.div`
  width: 50%;
  padding: 16px 0;
  text-align: center;
  user-select: none;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  background-color: #8556f6;
  color: #fff;
  cursor: pointer;

  &.off {
    color: #616161;
    border: none;
    background-color: #eee;
  }
`
const GenderWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`

const BirthDate = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #eee;
  box-sizing: border-box;
  color: #616161;
  cursor: not-allowed;
`

const PasswordRedirectBtn = styled.button`
  width: 100%;
  a {
    display: block;
    width: 100%;
    font-size: 16px;
    color: #fff;
    padding: 16px 0;
    background-color: #9e9e9e;
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
`

const PasswordWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
`

const UserId = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #eee;
  box-sizing: border-box;
  color: #616161;
  letter-spacing: -0.4px;
  cursor: not-allowed;
`
const NicknameInput = styled.input.attrs({type: 'text'})`
  display: block;
  border: 1px solid #e5e5e5;
  padding: 16px;
  width: 100%;
`

const ProfileImg = styled.div`
  position: relative;
  margin: 0 auto;
  margin-bottom: 32px;
  border: 1px solid #8556f5;
  border-radius: 50%;
  width: 88px;
  height: 88px;
  cursor: pointer;
  background-size: cover;
  background-position: center;

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
  padding-top: 20px;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 91.111%;
  }
`

const Content = styled.section`
  margin: 20px 0 20px 0;
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
