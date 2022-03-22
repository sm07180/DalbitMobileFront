import React, {useContext} from 'react'

import Lottie from 'react-lottie'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {IMG_SERVER} from 'context/config'
import {RoomJoin} from "context/room";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
// components
// css

export default withRouter((props) => {
  const {data, children, tab, topRankList} = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo, memNo, dispatch, globalState, history, nickNm);
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
  }

  return (
    <>
      {data.map((list, index) => {
        return (
          <ListRow photo={list.profImg.thumb292x292} key={index} onClick={() => history.push(`/profile/${list.memNo}`)} photoClick={() => history.push(`/profile/${list.memNo}`)}>
            <div className="rank">{typeof topRankList === "undefined" ? index + 1 : index + 4}</div>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={list.gender} />
                <span className="nick">{list.nickNm}</span>
              </div>
              <div className='listItem'>
                {tab === "DJ" && <DataCnt type={"listenerPoint"} value={list.listenerPoint}/>}
                <DataCnt type={tab === "FAN" ? "starCnt" : tab === "DJ" ? "djGoodPoint" : "cupid"} value={tab === "FAN" ? list.starCnt : tab === "DJ" ? list.goodPoint : list.djNickNm} clickEvent={(e) => {
                  e.stopPropagation();
                  tab === "CUPID" && props.history.push(`/profile/${list.djMemNo}`);
                }}/>
                <DataCnt type={tab === "FAN" ? "listenPoint" : tab === "DJ" ? "listenPoint" : "djGoodPoint"} value={tab === "FAN" ? list.listenPoint : tab === "DJ" ? list.broadcastPoint : list.djGoodPoint}/>
              </div>
            </div>
            {list.roomNo &&
              <div className="listBack">
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
              </div>
            }
          </ListRow>
        )
      })}
    </>
  )
})
