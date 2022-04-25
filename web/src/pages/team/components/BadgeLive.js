import React, {useContext} from 'react';
import Lottie from 'react-lottie';

import {useHistory} from "react-router-dom";
import {IMG_SERVER} from 'context/config';
import {RoomJoin} from "context/room";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
// global components

const BadgeLive = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({type:'alert',
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo,memNo, gtx, history, nickNm);
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo,memNo:memNo, nickNm: nickNm})
        } else {
          let alertMsg
          if (isNaN(listenRoomNo)) {
            alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
            dispatch(setGlobalCtxMessage({
              type: 'alert',
              msg: alertMsg
            }))
          } else {
            alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
            dispatch(setGlobalCtxMessage({
              type: 'confirm',
              msg: alertMsg,
              callback: () => {
                return RoomJoin({roomNo: listenRoomNo,memNo:memNo, listener: 'listener'})
              }
            }))
          }
        }
      }
    }
  };
  // 페이지 시작
  return (
    <div className="badgeLive" onClick={(e) => {
      e.stopPropagation();
      goLive(list.roomNo, list.memNo,list.nickNm, list.listenRoomNo);
    }}>
      <span className='equalizer'>
        <Lottie
          options={{
            loop: true,
            autoPlay: true,
            path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
          }}
        />
      </span>
      <span className='liveText'>LIVE</span>
    </div>
  )
}

export default BadgeLive;
