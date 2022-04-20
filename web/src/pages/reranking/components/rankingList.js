import React, {useContext} from 'react'

import Lottie from 'react-lottie'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {IMG_SERVER} from 'context/config'
import {RoomJoin} from "context/room";
import {Context, GlobalContext} from "context";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";
// components
// css

export default withRouter((props) => {
  const {data, tab, topRankList, breakNo} = props;

  const context = useContext(Context);

  const gtx = useContext(GlobalContext);

  const history = useHistory();

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        if(listenRoomNo){
          RoomValidateFromClipMemNo(listenRoomNo,memNo, gtx, history, nickNm);
        } else {
          RoomValidateFromClipMemNo(roomNo,memNo, gtx, history, nickNm);
        }
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo,memNo:memNo, nickNm: nickNm})
        } else {
          let alertMsg
          if (isNaN(listenRoomNo)) {
            alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
            context.action.alert({
              type: 'alert',
              msg: alertMsg
            })
          } else {
            alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
            context.action.confirm({
              type: 'confirm',
              msg: alertMsg,
              callback: () => {
                return RoomJoin({roomNo: listenRoomNo,memNo:memNo, listener: 'listener'})
              }
            })
          }
        }
      }
    }
  }

  const goProfile = (value) => {
    const { profileMemNo } = e.currentTarget.dataset;

    if (profileMemNo !== undefined) {
      props.history.push(`/profile/${value}`);
    }
  }
  return (
    <>
      {data.map((list, index) => {
        if (breakNo < index + 1) {
          return;
        }

        return (
          <ListRow photo={list.profImg.thumb292x292} key={index} onClick={() => history.push(`/profile/${list.memNo}`)} photoClick={() => history.push(`/profile/${list.memNo}`)}>
            <div className="rank">{index + 4}</div>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={list.gender} />
                <span className="nick">{list.nickNm}</span>
              </div>
              <div className='listItem'>
                {tab === "DJ" &&
                  <>
                    <DataCnt type={"listenerPoint"} value={list.listenerPoint}/>
                    <DataCnt type={'djGoodPoint'} value={list.goodPoint} />
                    <DataCnt type={"listenPoint"} value={list.broadcastPoint}/>
                  </>
                }
                {tab === 'FAN' &&
                  <>
                    <DataCnt type={'starCnt'} value={list.starCnt} clickEvent={(e) => goProfile(list.djMemNo)}/>
                    <DataCnt type={"listenPoint"} value={list.listenPoint}/>
                  </>
                }
                {tab === 'CUPID' &&
                  <>
                    <DataCnt type={'cupid'} value={list.djNickNm} clickEvent={(e) => goProfile(list.djMemNo)}/>
                    <DataCnt type={'djGoodPoint'} value={list.djGoodPoint} />
                  </>
                }
                {tab === 'TEAM' &&
                  <>
                    <DataCnt type={'point'} value={list.rank_pt} />
                  </>
                }
              </div>
            </div>
            {list.roomNo &&
              <div className="listBack">
                <div className="badgeLive" onClick={(e) => {
                  e.stopPropagation();
                  goLive(list.roomNo, list.memNo,list.nickNm, list.listenRoomNo);
                }}>
                  <span className='equalizer'>
                    <Lottie options={{ loop: true, autoPlay: true, path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json` }} />
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
});