import React, {useRef, useState, useContext} from 'react'
import Swiper from 'react-id-swiper'
import {Context} from 'context'
import OperationModal from './star_del_modal'
import {IMAGE_THUMB} from '../constant'

const ProfileAvatarList = ({onImgClick}) => {
  const globalCtx = useContext(Context)
  const {profile} = globalCtx
  const [imgInfo, setImgInfo] = useState('')
  const operationMoalRef = useRef()

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 4,
    freeMode: true,
    loop: false,
    rebuildOnUpdate: true
  }
  const onButtonClick = (imgInfo) => {
    operationMoalRef.current.handleOpen()
    setImgInfo(imgInfo)
  }

  // useLayoutEffect(() => {
  //   if (profile && profile.profImgList) {

  //   }
  // }, [profile?.profImgList]);

  return (
    <>
      <Swiper {...params} className="custom-swiper">
        {profile?.profImgList.map((photo, index) => (
          <div key={photo.profImg.path} className={`keen-slider__slide`}>
            <div className={`img_wrap`}>
              <img src={photo.profImg[IMAGE_THUMB]} alt={photo.profImg.path} onClick={() => onImgClick(index)} />
              <button className="img_wrap__btn" type="button" onClick={() => onButtonClick(photo.idx)}>
                <span className="img_wrap__btn__dot"></span>
                <span className="img_wrap__btn__dot"></span>
                <span className="img_wrap__btn__dot"></span>
              </button>
            </div>
          </div>
        ))}
      </Swiper>
      <OperationModal ref={operationMoalRef} imgInfo={imgInfo} />
    </>
  )
}

export default ProfileAvatarList
