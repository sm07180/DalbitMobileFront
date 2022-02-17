import React from 'react'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomJoin} from "context/room";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
// components
// css

export default withRouter((props) => {
  const {data, children, tab} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const goLive = (roomNo, nickNm, listenRoomNo) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3) {
        RoomValidateFromClip(roomNo, dispatch, globalState, history, nickNm);
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, nickNm: nickNm})
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
                return RoomJoin({roomNo: listenRoomNo, listener: 'listener'})
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
          <ListRow photo={list.profImg.thumb88x88} key={index} photoClick={() => history.push(`/profile/${list.memNo}`)}>
            <div className="rank">{list.rank}</div>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={list.gender} />
                <span className="nick">{list.nickNm}</span>
              </div>
              <div className='listItem'>
                {tab === "DJ" && <DataCnt type={"listenerPoint"} value={list.listenerPoint}/>}
                <DataCnt type={tab === "FAN" ? "starCnt" : tab === "DJ" ? "djGoodPoint" : "cupid"} value={tab === "FAN" ? list.starCnt : tab === "DJ" ? list.goodPoint : list.djNickNm} clickEvent={() => {
                  tab === "LOVER" && props.history.push(`/profile/${list.djMemNo}`);
                }}/>
                <DataCnt type={tab === "FAN" ? "listenPoint" : tab === "DJ" ? "listenPoint" : "djGoodPoint"} value={tab === "FAN" ? list.listenPoint : tab === "DJ" ? list.broadcastPoint : list.djGoodPoint}/>
              </div>
            </div>
            {list.roomNo &&
              <div className="listBack">
                <div className="badgeLive" onClick={(e) => {
                  e.stopPropagation();
                  goLive(list.roomNo, list.nickNm, list.listenRoomNo);
                }}></div>
              </div>
            }
          </ListRow>
        )
      })}
    </>
  )
})
