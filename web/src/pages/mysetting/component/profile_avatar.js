import React, {useEffect, useCallback, useState, useContext, useMemo} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import DalbitCropper from 'components/ui/dalbit_cropper'
import ProfileAvatarList from './profile_avatarList'
import {IMAGE_THUMB} from '../constant'

const ProfileAvatar = ({setCurrentAvatar}) => {
  const globalCtx = useContext(Context)
  const {profile, token} = globalCtx
  const [img, setImg] = useState('https://image.dalbitlive.com/mypage/ico_profile.svg')
  const [cropOpen, setCropOpen] = useState(false)
  const [editedImg, setEditedImg] = useState(null)
  const [eventObj, setEventObj] = useState(null)

  const hasPhotoList = useMemo(() => profile && profile.profImgList && profile.profImgList.length > 0, [profile.profImgList])

  const indexOfMainProfile = useMemo(() => {
    let index = -1
    profile?.profImgList.forEach((item, i) => {
      if (item.isLeader) {
        index = i
      }
    })
    return index
  }, [profile?.profImgList])

  const alertMessage = (message) => {
    globalCtx.action.alert({
      msg: message,
      callback: () => {
        globalCtx.action.alert({visible: false})
      }
    })
  }

  const onProfileClick = () => {
    if (indexOfMainProfile !== -1) {
      globalCtx.action.updateMultiViewer({
        show: true,
        list: profile.profImgList.length ? profile.profImgList : [{profImg: profile.profImg}],
        initSlide: indexOfMainProfile
      })
    }
  }
  const onProfileChange = (e) => {
    e.persist()
    setEventObj(e)
    setCropOpen(true)
  }

  const getProfileAcount = () => {
    Api.profile({params: {memNo: profile.memNo}}).then((res) => {
      const {result, message, data} = res
      if (result === 'success') {
        globalCtx.action.updateProfile(data)
      } else {
        alertMessage(message)
      }
    })
  }

  const addProfileImg = useCallback((profImg) => {
    Api.postAddProfileImg({profImg}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        getProfileAcount()
      } else {
        alertMessage(message)
      }
    })
  }, [])

  const uploadImageToServer = useCallback(() => {
    Api.image_upload({
      data: {
        dataURL: editedImg.content,
        uploadType: 'profile'
      }
    }).then((res) => {
      const {result, data} = res
      if (result === 'success') {
        if (!hasPhotoList) {
          setImg(data[IMAGE_THUMB])
          setCurrentAvatar(data.path)
        } else {
          addProfileImg(data.path)
        }
      } else {
        globalCtx.action.alert({
          msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
          title: '',
          callback: () => {
            globalCtx.action.alert({visible: false})
          }
        })
      }
    })
  }, [editedImg, hasPhotoList])

  const onAddProfileClick = () => {
    if (profile?.profImgList && profile?.profImgList.length >= 10) {
      globalCtx.action.toast({
        msg: '프로필 사진은 최대 10장까지 등록 가능합니다.'
      })
    }
  }

  const onImgClick = (index) => {
    globalCtx.action.updateMultiViewer({
      show: true,
      list: profile.profImgList.length ? profile.profImgList : [{profImg: profile.profImg}],
      initSlide: index
    })
  }

  useEffect(() => {
    if (profile && profile.profImg && profile.profImg[IMAGE_THUMB]) {
      setImg(profile.profImg[IMAGE_THUMB])
    }
  }, [profile?.profImg])

  useEffect(() => {
    if (editedImg !== null) {
      if (editedImg.status === false) {
        if (editedImg.content) {
          context.action.alert({
            status: true,
            type: 'alert',
            content: image.content,
            callback: () => {
              return
            }
          })
        }
      } else {
        uploadImageToServer()
      }
    }
  }, [editedImg])

  return (
    <>
      <div className={`profilePicBox`}>
        <label htmlFor="mainProfile" className={`mainProfile exist`} onClick={onProfileClick}>
          <img src={img} alt="프로필 사진" />
        </label>
        {indexOfMainProfile === -1 && (
          <input type="file" id="mainProfile" accept="image/png, image/jpeg" onChange={onProfileChange} />
        )}

        <div className="subProfile">
          <label
            htmlFor="subProfile"
            className={`addPhotoBtn ${profile?.profImgList.length >= 10 ? 'isDisabled' : ''}`}
            onClick={onAddProfileClick}>
            <img src={'https://image.dalbitlive.com/svg/ico-camera-gray-plus.svg'} alt="사진 등록하기" />
            <span>{profile?.profImgList.length}/10</span>
          </label>
          <input
            type="file"
            id="subProfile"
            accept="image/png, image/jpeg"
            onChange={onProfileChange}
            disabled={profile?.profImgList.length >= 10}
          />

          <p className={`addPhotoDesc ${hasPhotoList ? 'hide' : ''}`}>
            512X512 이상의 사이즈를 권장하며, <br />
            최대 10장까지 등록 가능합니다
          </p>
          {hasPhotoList && <ProfileAvatarList onImgClick={onImgClick} />}
        </div>
      </div>
      {cropOpen && eventObj !== null && (
        <DalbitCropper customName={`croperWrap`} event={eventObj} setCropOpen={setCropOpen} setImage={setEditedImg} />
      )}
    </>
  )
}

export default ProfileAvatar
