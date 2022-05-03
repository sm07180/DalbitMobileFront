import React, {useState, useEffect} from 'react';

import Api from 'context/api';
// css
import './fanBtn.scss';
import {useDispatch, useSelector} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const FanBtn = (props) => {
  const {data, isMyProfile} = props;
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);

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
          msg: res.message
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

  const fanToggleCallback = (isFan) => {
    data.isFan = !isFan;

    // 마이페이지, 마이프로필 페이지에서 카운트 하기위한 것이니 그 외에 곳에서는 안써도 됨
    if (isMyProfile) {
      if(isFan) { // 팬 해제 후
        dispatch(setProfileData({...profileData, isFan: !profileData.isFan, starCnt: profileData.starCnt -1}));
        console.log(profileData.starCnt);
      }else { // 팬 등록 후
        dispatch(setProfileData({...profileData, isFan: !profileData.isFan, starCnt: profileData.starCnt +1}));
        console.log(profileData.starCnt);
      }
    }else {
      dispatch(setProfileData({...profileData, isFan: !profileData.isFan}))
    }
  }

  return (
    <button 
      id="fanBtn"
      className={`${data.isFan ? 'isFan' : ''}`}
      onClick={() => {
        fanToggle(data.memNo, data.nickNm, data.isFan, () => fanToggleCallback(data.isFan))
    }}>
      {data.isFan ? '팬' : '+ 팬등록'}
    </button>
  )
}

export default FanBtn;
