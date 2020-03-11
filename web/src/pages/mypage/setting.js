import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import Api from 'context/api'
import {Context} from 'context'

export default props => {
  const context = useContext(Context)
  const {profile} = context
  const [nickname, setNickname] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(null)

  if (!profile) {
    props.history.push('/')
  }

  const profileImageUpload = e => {
    const target = e.currentTarget
    let reader = new FileReader()
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
        }
      }
    }
  }

  const changeNickname = e => {
    const {currentTarget} = e
    setNickname(currentTarget.value)
  }

  const changeMsg = e => {
    const {currentTarget} = e
    setProfileMsg(currentTarget.value)
  }

  const saveUpload = async () => {
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
      return alert('저장되었습니다.')
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
          <ProfileImg style={{backgroundImage: `url(${tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb88x88'] : ''})`}}>
            <label htmlFor="profileImg" />
            <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />
          </ProfileImg>
          <div className="nickname">
            <NicknameInput autoComplete="off" value={nickname} onChange={changeNickname} />
          </div>
          <UserId>{`@${profile.memId}`}</UserId>
          {/* <PasswordInput autoComplete="new-password" /> */}
          {/* <BirthDate>{`${profile.birth.slice(0, 4)}-${profile.birth.slice(4, 6)}-${profile.birth.slice(6)}`}</BirthDate> */}
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
`

const PasswordInput = styled.input.attrs({type: 'password'})`
  display: block;
  border: 1px solid #e5e5e5;
  padding: 16px;
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
`
const NicknameInput = styled.input.attrs({type: 'text'})`
  display: block;
  border: 1px solid #e5e5e5;
  padding: 16px;
  width: 100%;
`

const ProfileImg = styled.div`
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
