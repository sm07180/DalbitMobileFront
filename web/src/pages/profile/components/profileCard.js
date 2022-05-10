import React, {useEffect, useState} from 'react';

import Api from 'context/api';
// global components
import LevelItems from '../../../components/ui/levelItems/LevelItems';
import GenderItems from '../../../components/ui/genderItems/GenderItems';
import FrameItems from '../../../components/ui/frameItems/frameItems';

import {isIos} from "context/hybrid";
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ProfileCard = (props) => {
  const {data, isMyProfile, openSlidePop, openShowSlide} = props;
  const dispatch = useDispatch();

  /* 팬 버튼 토글 */
  const fanToggle = (memNo, memNick, isFan, callback) => {
    isFan ? deleteFan(memNo, memNick, callback) : addFan(memNo, memNick, callback);
  }
  /* 팬 등록 */
  const addFan = (memNo, memNick, callback) => {
    Api.fan_change({data: {memNo}}).then(res => {
      if (res.result === 'success') {
        if(typeof callback === 'function') callback();
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: `${memNick ? `${memNick}님의 팬이 되었습니다` : '팬등록에 성공하였습니다'}`
        }))
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message, callback: undefined
        }))
      }
    })
  }
  /* 팬 해제 */
  const deleteFan = (memNo, memNick, callback) => {
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: `${memNick} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        Api.mypage_fan_cancel({data: {memNo}}).then(res => {
          if (res.result === 'success') {
            if(typeof callback === 'function') callback();
            dispatch(setGlobalCtxMessage({type:'toast', msg: res.message }))
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({type:'alert', msg: res.message }))
          }
        });
      }
    }))
  }
  /* fan toggle 데이터 변경 */
  const fanToggleCallback = () => {
    /* api에서 조회하지 않고 스크립트로만 스타수 +- 시킴 (팬,스타 리스트 api 조회시에는 각각 갱신함) */
    if(data.isFan) { // isFan -> !isFan (팬해제)
      dispatch(setProfileData({...data, isFan: !data.isFan, fanCnt: data.fanCnt -1}))
    }else { // !isFan -> isFan (팬등록)
      dispatch(setProfileData({...data, isFan: !data.isFan, fanCnt: data.fanCnt +1}))
    }
  }

  return (
    <section className="profileCard">
      <div className="cardWrap">
        <div className="userInfo">
          <div className="photo"
              onClick={() => {
                if(!data.profImg?.isDefaultImg) openShowSlide(data.profImgList)
              }}>
            <img src={data.profImg && data.profImg?.thumb292x292} alt="" />
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
          <div data-target-type="fan" onClick={openSlidePop} className="item">
            <span>{data.fanCnt}</span>
            <i>팬</i>
          </div>
          <div data-target-type="star" onClick={openSlidePop} className="item">
            <span>{data.starCnt}</span>
            <i>스타</i>
          </div>
          <div data-target-type="like" onClick={openSlidePop} className="item">
            <span>{data.likeTotCnt}</span>
            <i>좋아요</i>
          </div>
        </div>
        {!isMyProfile &&
          <div className="buttonWrap">
            {!isIos() && <button className="presentBtn" data-target-type="present" onClick={openSlidePop}>선물하기</button>}
            <button className={`${data.isFan ? 'isFan' : ''}`}
                    onClick={() => {
                      fanToggle(data.memNo, data.nickNm, data.isFan, fanToggleCallback)
                    }}>
              {data.isFan ? '팬' : '+ 팬등록'}
            </button>
          </div>
        }
      </div>
    </section>
  )
}

export default ProfileCard;
