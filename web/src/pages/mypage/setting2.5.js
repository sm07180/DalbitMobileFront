import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Switch, Redirect, Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import {authReq} from 'pages/self_auth'
//layout
import Layout from 'pages/common/layout'
import Header from './component/header'
//context
import Api from 'context/api'
import {Context} from 'context'
import {DalbitTextArea} from './content/textarea'
//image
import camera from 'images/camera.svg'
import delIcon from './static/del_g.svg'
import './setting.scss'

export default (props) => {
  // ctx
  const context = useContext(Context)
  const {profile, token, tempImage, editImage} = context
  const history = useHistory()
  // state
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState(null)
  const [profileMsg, setProfileMsg] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [tempPhoto, setTempPhoto] = useState(editImage)
  const [phone, setPhone] = useState('')
  const [authState, setAuthState] = useState(true)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [firstSetting, setFirstSetting] = useState(false)
  const [mypageBirth, setMypageBirth] = useState('')
  const [active, setActive] = useState(false)
  //ref
  const nicknameReference = useRef()
  const formTag = useRef(null)
  // setting img upload func  + mobile rotater
  const profileImageUpload = (e) => {
    let reader = new FileReader()
    const target = e.currentTarget
    const file = target.files[0]
    const isQualityDown = file.size > 10000000
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
    reader.readAsArrayBuffer(file)
    //오리엔테이션 뽑아내는 함수
    function getOrientation(buffer) {
      let view = new DataView(buffer)
      if (view.getUint16(0, false) !== 0xffd8) {
        return {
          buffer: view.buffer,
          orientation: -2
        }
      }
      let length = view.byteLength
      let offset = 2
      while (offset < length) {
        let marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return {
              buffer: view.buffer,
              orientation: -1
            }
          }
          let little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          let tags = view.getUint16(offset, little)
          offset += 2
          for (let i = 0; i < tags; i++) {
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
        img.onload = async () => {
          const limitSize = 1280
          if (img.width > limitSize || img.height > limitSize) {
            img.width = img.width / 5
            img.height = img.height / 5
          }
          // context.action.updateTempImage(originalCacheURL)
          // context.action.updateEditImage(originalCacheURL)
          history.push('/ImageEditor', {
            src: originalCacheURL,
            mimeType: fileExtension,
            isQualityDown: isQualityDown
          })
        }
      }
    }
  }
  // 이미지 editor 후 upload
  const uploadImage = useCallback(() => {
    if (editImage) {
      setPhotoUploading(true)
      setActive(false)
      uploadImageToServer(editImage)
      async function uploadImageToServer(data) {
        const res = await Api.image_upload({
          data: {
            dataURL: data,
            uploadType: 'profile'
          }
        })
        if (res.result === 'success') {
          const data = {
            gender: gender || profile.gender,
            nickNm: nickname || profile.nickNm,
            birth: profile.birth,
            profMsg: profileMsg || profile.profMsg,
            profImg: res.data.path
          }
          console.log(data)
          const res2 = await Api.profile_edit({data})

          if (res2.result === 'success') {
            context.action.toast({
              msg: '프로필 이미지 업로드 성공'
            })
            setPhotoPath(res.data.path)
            setPhotoUploading(false)
            setActive(true)
            context.action.updateTempImage(editImage)
          } else {
            return context.action.alert({
              msg: `${res2.message}`
            })
          }
          // context.action.updateEditImage('')
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
  }, [])
  // change nick name func
  const changeNickname = (e) => {
    const {currentTarget} = e
    if (currentTarget.value.length > 20) {
      return
    }
    setNickname(currentTarget.value)
    // setNickname(currentTarget.value.replace(/ /g, ''))
  }
  const validationCheck = () => {
    if (!profile.nickNm || !nickname) {
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
    if (gender === 'n') {
      return context.action.confirm({
        msg: '성별을 선택하지 않으셨습니다. \n 이대로 저장하시겠습니까?',
        callback: () => {
          saveUpload()
        }
      })
    }
    saveUpload()
  }
  const saveUpload = async () => {
    const data = {
      gender: gender,
      nickNm: nickname || profile.nickNm,
      birth: profile.birth,
      profMsg: profileMsg || profile.profMsg,
      profImg: photoPath || profile.profImg.path
    }
    console.log(data)
    const res = await Api.profile_edit({data})
    if (res && res.result === 'success') {
      context.action.updateProfile({...res.data, birth: profile.birth})
      return context.action.alert({
        msg: '저장되었습니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
          history.push('/myPprofile')
        }
      })
    } else {
      return context.action.alert({
        msg: `${res.message}`
      })
    }
  }
  const checkAuth = () => {
    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        setAuthState(true)
        setPhone(res.data.phoneNo)
      } else {
        setAuthState(false)
      }
    }
    fetchSelfAuth()
  }

  useEffect(() => {
    if (profile !== null) {
      setNickname(profile.nickNm)
      setProfileMsg(profile.profMsg)
      // setPhotoPath(profile.profImg.path)
      setGender(profile.gender)
      if (profile.gender == 'n') {
        setFirstSetting(true)
      }
    }
  }, [profile])

  useEffect(() => {
    if (
      (nickname !== '' && nickname !== context.profile.nickNm) ||
      (profileMsg !== '' && profileMsg !== context.profile.profMsg) ||
      (photoPath !== '' && photoPath !== context.profile.profImg.path) ||
      (gender !== 'n' && gender !== '' && gender !== context.profile.gender)
    ) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [nickname, profileMsg, photoPath, gender])

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
    checkAuth()

    return () => {
      context.action.updateTempImage(null)
      context.action.updateEditImage(null)
    }
  }, [])

  useEffect(() => {
    if (editImage !== null && editImage !== tempImage) {
      uploadImage()
    }

    return () => {
      return
    }
  }, [editImage, tempImage])
  //------------------------------------------------------
  return (
    <Switch>
      {!token.isLogin ? (
        <Redirect to={`/`} />
      ) : (
        <Layout {...props} status="no_gnb">
          <section id="myProfileSetting">
            <Header title="프로필 수정" />
            {/* 공통타이틀:TopWrap */}
            <div className="settingWrap">
              <div className="imgBox">
                <label htmlFor="profileImg">
                  <input id="profileImg" type="file" accept="image/jpg, image/jpeg, image/png" onChange={profileImageUpload} />

                  <div
                    className="backImg"
                    style={{
                      backgroundImage: `url("${tempPhoto ? tempPhoto : profile.profImg ? profile.profImg['thumb150x150'] : ''}")`,
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
                <span className="desc">512(가로)x512(세로) 이상의 사이즈를 권장합니다.</span>
              </div>

              <div className="inputBox">
                <label className="input__label" htmlFor="auth">
                  본인인증
                </label>
                <p className={authState ? 'authPass' : 'notAuth'}>{authState ? phone : '본인인증을 해주세요.'}</p>
                <button
                  className="btn__confirm"
                  onClick={() => {
                    authReq({code: '5', formTagRef: formTag, context})
                  }}>
                  본인인증
                </button>
              </div>
              <span className={`commentBox ${authState ? 'authPass' : 'notAuth'}`}>
                {authState ? '본인인증이 완료 되었으며, 재 인증도 가능합니다.' : '본인인증을 완료하지 않으셨습니다.'}
              </span>

              <form ref={formTag} name="authForm" method="post" id="authForm" target="KMCISWindow"></form>

              <div className="inputBox inputBox__nickname">
                <label className="input__label" htmlFor="nickName">
                  닉네임
                </label>
                <input
                  className="input__text"
                  id="nickName"
                  ref={nicknameReference}
                  autoComplete="off"
                  type="text"
                  // defaultValue={profile.nickNm}
                  value={nickname}
                  onChange={changeNickname}
                  maxLength="20"
                />
                <button
                  className="btn__del"
                  onClick={() => {
                    setNickname('')
                  }}>
                  <img src={delIcon} alt="삭제"></img>
                </button>
              </div>

              <div className="inputBox">
                <label className="input__label" htmlFor="uid">
                  UID
                </label>
                <input className="input__text" id="uid" value={profile.memId} readOnly />
              </div>

              {token.memNo[0] === '1' && (
                <>
                  <div className="inputBox">
                    <label className="input__label" htmlFor="password">
                      비밀번호
                    </label>
                    <div className="input__text password">
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                      <span className="ico" />
                    </div>

                    <button className="btn__confirm" onClick={() => history.push('/password')}>
                      비밀번호 변경
                    </button>
                  </div>
                </>
              )}

              <div className="inputBox inputBox__birth">
                <label className="input__label" htmlFor="password">
                  생년월일
                </label>
                <input
                  className="input__text"
                  id="password"
                  value={`${profile.birth.slice(0, 4)}.${profile.birth.slice(4, 6)}.${profile.birth.slice(6)}`}
                  readOnly
                />
              </div>
              <span className="commentBox">본인인증 정보로 자동 갱신됩니다.</span>
              <div className={`genderBox ${firstSetting ? 'before' : 'after'}`}>
                {firstSetting ? (
                  <>
                    <div
                      className={`genderTab ${gender === 'm' ? '' : 'off'}`}
                      onClick={() => {
                        if (gender === 'm') {
                          setGender('n')
                        } else {
                          setGender('m')
                        }
                      }}>
                      남자
                    </div>

                    <div
                      className={`woman genderTab ${gender === 'f' ? '' : 'off'}`}
                      onClick={() => {
                        if (gender === 'f') {
                          setGender('n')
                        } else {
                          setGender('f')
                        }
                      }}>
                      여자
                    </div>
                  </>
                ) : (
                  <>
                    {profile.gender === 'm' ? (
                      <div className={`genderTab one-btn man ${profile.gender === 'm' ? '' : 'off'}`}>남자</div>
                    ) : (
                      <div className={`genderTab one-btn woman ${profile.gender === 'f' ? '' : 'off'}`}>여자</div>
                    )}
                  </>
                )}
              </div>
              <span className="commentBox">본인인증 정보로 자동 갱신됩니다.</span>

              <div className="msgBox">
                <label className="input-label">프로필 메시지</label>
                <button
                  onClick={() => {
                    setProfileMsg('')
                  }}>
                  <img src={delIcon} alt="삭제"></img>
                </button>
                <DalbitTextArea
                  defaultValue={profile.profMsg}
                  state={profileMsg}
                  setState={setProfileMsg}
                  maxLength={100}
                  className="msgText"
                  placeholder="프로필 메시지는 최대 100자까지 입력할 수 있습니다."
                />
                {/* <GenderAlertMsg>프로필 메시지는 최대 100자까지 입력할 수 있습니다.</GenderAlertMsg> */}
              </div>

              <button
                className={`btn__save ${active === true && 'isActive'}`}
                disabled={!active ? true : false}
                onClick={validationCheck}>
                저장
              </button>
            </div>
            {photoUploading && (
              <div className="loadingWrap">
                <div className="loading">
                  <span></span>
                </div>
              </div>
            )}
          </section>
        </Layout>
      )}
    </Switch>
  )
}
