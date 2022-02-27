import React from 'react'

// global components
import LevelItems from 'components/ui/levelItems/LevelItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import FrameItems from 'components/ui/frameItems/frameItems'

import './profileCard.scss'
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {isIos} from "context/hybrid";
import {setCommonPopupOpenData} from "redux/actions/common";

const ProfileCard = (props) => {
  const {data, isMyProfile, openShowSlide, openPopFanStar, openPopLike, fanToggle, popup} = props
  const dispatch = useDispatch();

  /* fan toggle 데이터 변경 */
  const fanToggleCallback = () => {
    if(!isMyProfile) {
      /* api에서 조회하지 않고 스크립트로만 스타수 +- 시킴 (팬,스타 리스트 api 조회시에는 각각 갱신함) */
      if(data.isFan) { // isFan -> !isFan (팬해제)
        dispatch(setProfileData({...data, isFan: !data.isFan, fanCnt: data.fanCnt -1}))
      }else { // !isFan -> isFan (팬등록)
        dispatch(setProfileData({...data, isFan: !data.isFan, fanCnt: data.fanCnt +1}))
      }
    }else {
      dispatch(setProfileData({...data, isFan: !data.isFan}))
    }
  }

  const openPresentPop = () => {
    dispatch(setCommonPopupOpenData({...popup, presentPopup: true}));
  }

  return (
    <div className="cardWrap">
      <div className="userInfo">
        <div className="photo"
             onClick={() => {
               if(!data.profImg?.isDefaultImg) openShowSlide(data.profImgList)
             }}>
          <img src={data.profImg?.thumb292x292} alt="" />
          <FrameItems content={data} />
        </div>
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
        <div data-target-type="fan" onClick={openPopFanStar} className="item">
          <span>{data.fanCnt}</span>
          <i>팬</i>
        </div>
        <div data-target-type="star" onClick={openPopFanStar} className="item">
          <span>{data.starCnt}</span>
          <i>스타</i>
        </div>
        <div data-target-type="like" onClick={openPopLike} className="item">
          <span>{data.likeTotCnt}</span>
          <i>좋아요</i>
        </div>
      </div>
      {!isMyProfile &&
        <div className="buttonWrap">
          {!isIos() && <button onClick={openPresentPop}>선물하기</button>}
          <button className={`${data.isFan ? 'isFan' : ''}`}
                  onClick={() => {
                    fanToggle(data.memNo, data.nickNm, data.isFan, fanToggleCallback)
                  }}>{data.isFan ? '팬' : '+ 팬등록'}</button>
        </div>
      }
    </div>
  )
}

export default ProfileCard
