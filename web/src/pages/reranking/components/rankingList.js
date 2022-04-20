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
  const {data, children, tab, topRankList} = props;

  const context = useContext(Context);
  const history = useHistory();

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
                  RoomValidateFromClipMemNo(list.roomNo, list.memNo, context, history, list.nickNm);
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
            {
              list.listenRoomNo && (list.listenOpen === 0 || list.listenOpen === 1) &&
                <div className="listBack">
                  <div className='badgeListener' onClick={(e) => {
                    e.stopPropagation();
                    RoomValidateFromClipMemNo(list.listenRoomNo, list.memNo, context, history, list.nickNm);
                  }}>
                    <span className='headset'>
                      <Lottie
                          options={{
                            loop: true,
                            autoPlay: true,
                            path: `${IMG_SERVER}/dalla/ani/ranking_headset_icon.json`
                          }}
                        />
                    </span>
                    <span className='ListenerText'>LIVE</span>
                  </div>
                </div>
            }
          </ListRow>
        )
      })}
    </>
  )
})
