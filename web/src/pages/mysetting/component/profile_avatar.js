import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Api from 'context/api'
import DalbitCropper from 'components/ui/dalbit_cropper'
import ProfileAvatarList from './profile_avatarList'
import {IMAGE_THUMB} from '../constant'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxMultiViewer, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

const ProfileAvatar = ({setCurrentAvatar}) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {profile, token} = globalState
  const inputRef = useRef(null)
  const avatarInputRef = useRef(null)
  const [img, setImg] = useState('https://image.dalbitlive.com/mypage/ico_profile.svg')
  const [cropOpen, setCropOpen] = useState(false)
  const [editedImg, setEditedImg] = useState(null)
  const [eventObj, setEventObj] = useState(null)
  const [loading, setLoading] = useState(false)

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
    dispatch(setGlobalCtxMessage({
      type: "alert",
      msg: message,
      callback: () => {
      }
    }))
  }

  const clearInputValue = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = ''
    }
    if (avatarInputRef && avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }, [inputRef, avatarInputRef])

  const onProfileClick = () => {
    if (indexOfMainProfile !== -1) {
      dispatch(setGlobalCtxMultiViewer({
        show: true,
        list: profile.profImgList.length ? profile.profImgList : [{profImg: profile.profImg}],
        initSlide: indexOfMainProfile
      }));
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
        dispatch(setGlobalCtxUpdateProfile(data));
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
        setLoading(false)
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: '이미지 등록 되었습니다.'
        }))
      } else {
        alertMessage(message)
      }
    })
  }, [])

  const uploadImageToServer = useCallback(() => {
    setLoading(true)
    Api.image_upload({
      data: {
        dataURL: editedImg.content,
        uploadType: 'profile'
      }
    }).then((res) => {
      clearInputValue()
      const {result, data} = res
      if (result === 'success') {
        if (!hasPhotoList) {
          setImg(data[IMAGE_THUMB])
          setCurrentAvatar(data.path)
          setLoading(false)
        } else {
          addProfileImg(data.path)
        }
      } else {
        setLoading(false)
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
          title: '',
          callback: () => {
          }
        }))
      }
    })
  }, [editedImg, hasPhotoList, clearInputValue])

  const onAddProfileClick = () => {
    if (profile?.profImgList && profile?.profImgList.length >= 10) {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: '프로필 사진은 최대 10장까지 등록 가능합니다.'
      }))
    }
  }

  const onImgClick = (index) => {
    dispatch(setGlobalCtxMultiViewer({
      show: true,
      list: profile.profImgList.length ? profile.profImgList : [{profImg: profile.profImg}],
      initSlide: index
    }));
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
          <input type="file" ref={avatarInputRef} id="mainProfile" accept="image/png, image/jpeg" onChange={onProfileChange} />
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
            ref={inputRef}
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
        <DalbitCropper
          imgInfo={eventObj}
          onClose={() => {
            setCropOpen(false)
            clearInputValue()
          }}
          onCrop={(value) => setEditedImg(value)}
        />
      )}

      {loading && (
        <div id="dim-layer">
          <div className="loading">
            <span></span>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileAvatar
