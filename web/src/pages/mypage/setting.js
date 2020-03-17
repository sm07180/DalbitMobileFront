import React, {useEffect, useState, useContext, useRef} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import Api from 'context/api'
import {Context} from 'context'

//image
import camera from 'images/camera.svg'

export default props => {
  const context = useContext(Context)
  const {profile} = context
  const [nickname, setNickname] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(null)

  const nicknameReference = useRef()

  if (!profile) {
    props.history.push('/')
  }

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
        const res = await Api.image_upload({
          data: {
            dataURL: reader.result,
            uploadType: 'profile'
          }
        })
        if (res.result === 'success') {
          setTempPhoto(reader.result)
          setPhotoPath(res.data.path)
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

    const data = {
      gender: profile.gender,
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
        }
      })
    }
  }

  useEffect(() => {
    setNickname(profile.nickNm)
    setProfileMsg(profile.profMsg)
    setPhotoPath(profile.profImg.path)
  }, [])
  return (
    <Layout {...props}>
      <Content>
        <SettingWrap>
          <ProfileImg style={{backgroundImage: `url(${tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''})`}}>
            <label htmlFor="profileImg" />
            <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />
            <img src={camera} style={{position: 'absolute', bottom: '-5px', right: '-15px'}} />
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
              <Link to="/user/password">비밀번호 변경</Link>
            </PasswordRedirectBtn>
          </PasswordWrap>
          <BirthDate>{`${profile.birth.slice(0, 4)}-${profile.birth.slice(4, 6)}-${profile.birth.slice(6)}`}</BirthDate>
          <GenderWrap>
            <GenderTab className={profile.gender === 'm' ? '' : 'off'}>남자</GenderTab>
            <GenderTab className={profile.gender === 'w' ? '' : 'off'}>여자</GenderTab>
          </GenderWrap>

          <GenderAlertMsg>* 생년월일과 성별 수정을 원하시는 경우 고객센터로 문의해주세요.</GenderAlertMsg>

          <div className="msg-wrap">
            <MsgTitle>프로필 메세지</MsgTitle>
            <MsgText value={profileMsg} onChange={changeMsg} />
          </div>
          <SaveBtn onClick={saveUpload}>저장</SaveBtn>
        </SettingWrap>
      </Content>
    </Layout>
  )
}

const SaveBtn = styled.div`
  margin-top: 60px;
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
`

const GenderTab = styled.div`
  width: 50%;
  padding: 16px 0;
  text-align: center;
  user-select: none;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  &.off {
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
  width: 138px;
  font-size: 16px;
  color: #fff;
  padding: 16px 0;
  background-color: #9e9e9e;
`

const PasswordCircle = styled.div`
  width: 10px;
  height: 10px;
  background-color: #9e9e9e;
  border-radius: 50%;
  margin: 0 2px;
`

const PasswordTextWrap = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 138px);
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
`

const Content = styled.section`
  margin: 30px 0 100px 0;
`
