import React from 'react'

import Lottie from 'react-lottie'

import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import {IMG_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo, RoomValidateFromListenerFollow,} from "common/audio/clip_func";
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";
import {useDispatch, useSelector} from "react-redux";

export default withRouter((props) => {
  const {data, tab, breakNo} = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const goProfile = (value, e) => {
    e.stopPropagation();
    if (value !== undefined) {
      props.history.push(`/profile/${value}`);
    }
  };

  return (
    <>
      {data.map((list, index) => {
        if (breakNo < index + 1) {
          return;
        }

        return (
          <div className='listWrap'>
            <ListRow photo={list.profImg.thumb292x292} key={index}
                     onClick={() => props.history.push(`/profile/${list.memNo}`)}
                     photoClick={() => props.history.push(`/profile/${list.memNo}`)}>
              <div className="rank">{tab !== 'team' ? list.rank : index + 4}</div>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems data={list.gender}/>
                  <span className="nick">{list.nickNm}</span>
                </div>
                <div className='listItem'>
                  {tab === "dj" &&
                  <>
                    <DataCnt type={"listenerPoint"} value={list.listenerPoint}/>
                    <DataCnt type={'djGoodPoint'} value={list.goodPoint}/>
                    <DataCnt type={"listenPoint"} value={list.broadcastPoint}/>
                  </>
                  }
                  {tab === 'fan' &&
                  <>
                    <DataCnt type={'starCnt'} value={list.starCnt}/>
                    <DataCnt type={"listenPoint"} value={list.listenPoint}/>
                  </>
                  }
                  {tab === 'cupid' &&
                  <>
                    <DataCnt type={'cupid'} value={list.djNickNm} clickEvent={(e) => goProfile(list.djMemNo, e)}/>
                    <DataCnt type={'djGoodPoint'} value={list.djGoodPoint}/>
                  </>
                  }
                  {tab === 'team' &&
                  <>
                    <DataCnt type={'point'} value={list.rank_pt}/>
                  </>
                  }
                </div>
              </div>

              {
                !list.listenRoomNo && list.roomNo &&
                <div className="listBack">
                  <div className="badgeLive" onClick={(e) => {
                    e.stopPropagation();
                    RoomValidateFromClipMemNo(list.roomNo, list.memNo, dispatch, globalState, history, list.nickNm);
                  }}>
                  <span className='equalizer'>
                    <Lottie
                      options={{loop: true, autoPlay: true, path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`}}/>
                  </span>
                    <span className='liveText'>LIVE</span>
                  </div>
                </div>
              }

              {
                !list.roomNo && list.listenRoomNo && list.listenOpen !== 2 &&
                <div className="listBack">
                  <div className='badgeListener' onClick={(e) => {
                    e.stopPropagation();
                    RoomValidateFromListenerFollow({
                      memNo: list.memNo,
                      history,
                      globalState,
                      dispatch,
                      nickNm: list.nickNm,
                      listenRoomNo: list.listenRoomNo
                    });
                  }}>
                    <span className='headset'>
                      <Lottie options={{
                        loop: true,
                        autoPlay: true,
                        path: `${IMG_SERVER}/dalla/ani/ranking_headset_icon.json`
                      }}/>
                    </span>
                    <span className='ListenerText'>LIVE</span>
                  </div>
                </div>
              }

            </ListRow>
          </div>
        )
      })}
    </>
  )
});
