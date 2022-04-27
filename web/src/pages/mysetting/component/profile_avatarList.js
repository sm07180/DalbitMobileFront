import React, {useRef, useState} from 'react'
import Swiper from 'react-id-swiper'
import OperationModal from './star_del_modal'
import {IMAGE_THUMB} from '../constant'
import {useSelector} from "react-redux";

const ProfileAvatarList = ({onImgClick}) => {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {profile} = globalState
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

  return (
    <>
      <Swiper {...params} className="custom-swiper">
        {profile?.profImgList.map((photo, index) => (
          <div key={photo.profImg.path} className={`keen-slider__slide`}>
            <div className={`img_wrap ${photo.isLeader ? 'leader' : ''}`}>
              <div onClick={() => onImgClick(index)}>
                <img src={photo.profImg[IMAGE_THUMB]} alt={photo.profImg.path} />
                {photo.isLeader && (
                  <span className="checkmark">
                    <div className="checkmark_stem"></div>
                    <div className="checkmark_kick"></div>
                  </span>
                )}
              </div>
              <button className="img_wrap__btn" type="button" onClick={() => onButtonClick(photo.idx)}></button>
            </div>
          </div>
        ))}
      </Swiper>
      <OperationModal ref={operationMoalRef} imgInfo={imgInfo} />
    </>
  )
}

export default ProfileAvatarList
