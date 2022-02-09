import React from 'react'

// global components
import LevelItems from 'components/ui/levelItems/LevelItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import FrameItems from 'components/ui/frameItems/FrameItems'

import './profileCard.scss'
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";

const ProfileCard = (props) => {
  const {data, isMyProfile, openShowSlide, openPopFanStarLike, fanToggle} = props
  const dispatch = useDispatch();

  const fanToggleCallback = () => dispatch(setProfileData({...data, isFan: !data.isFan}))
  const fanToggleAction = () => fanToggle(data.memNo, data.nickNm, data.isFan, fanToggleCallback);
  return (
    <div className="cardWrap">
      <div className="userInfo">
        {data.profImg && (data.profImg.isDefaultImg ?
            <div className="photo">
              <img src={data.profImg.thumb500x500} alt="" />
              <FrameItems content={data} />
            </div>
            :
            <div className="photo" onClick={() => openShowSlide(data.profImgList)}>
              <img src={data.profImg.thumb500x500} alt="" />
              <FrameItems content={data} />
            </div>
        )}
        <div className="info">
          <div className="item">
            <LevelItems data={data.level} />
            <GenderItems data={data.gender} size={18} />
            <span className='nick'>{data.nickNm}</span>
          </div>
          <div className="item">
            <span className='userid'>{data.memId}</span>
          </div>
        </div>
      </div>
      <div className="count">
        <div data-target-type="fan" onClick={openPopFanStarLike} className="item">
          <span>{data.fanCnt}</span>
          <i>팬</i>
        </div>
        <div data-target-type="star" onClick={openPopFanStarLike} className="item">
          <span>{data.starCnt}</span>
          <i>스타</i>
        </div>
        <div data-target-type="like" onClick={openPopFanStarLike} className="item">
          <span>{data.likeTotCnt}</span>
          <i>좋아요</i>
        </div>
      </div>
      {!isMyProfile &&
        <div className="buttonWrap">
          <button>선물하기</button>
          {data.isFan ?
            <button className='isFan'
                    onClick={fanToggleAction}
            >팬</button>
            : <button onClick={fanToggleAction}>+ 팬등록</button>
          }
        </div>
      }
    </div>
  )
}

export default ProfileCard
