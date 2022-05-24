import React from 'react'

import Lottie from 'react-lottie'
import Swiper from 'react-id-swiper'
import ListRow from 'components/ui/listRow/ListRow'
import {useHistory} from "react-router-dom";
import {RoomValidateFromClipMemNo, RoomValidateFromListenerFollow,} from "common/audio/clip_func";
import {IMG_SERVER} from 'context/config'
import {useDispatch, useSelector} from "react-redux";

const DjChatSwiper = (props) => {
  const {data} = props

  let locationStateHistory = useHistory();
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    loop: false,
    rebuildOnUpdate: true
  }

  return (
    <div className='chartSwiper'>
      {data && data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list, index) => {
          return (
            <div key={index}>
              <ListRow photo={list.profImg.thumb292x292} onClick={() => history.push(`/profile/${list.memNo}`)}>
                <div className='rankWrap'>
                  <div className='rank'>{index + 1}</div>
                </div>
                {
                  !list.listenRoomNo && list.roomNo &&
                  <div className='livetag' onClick={(e) => {
                    e.stopPropagation();
                    RoomValidateFromClipMemNo(list.roomNo, list.memNo, dispatch, globalState, locationStateHistory, list.nickNm);
                  }}>
                    <Lottie
                      options={{loop: true, autoPlay: true, path: `${IMG_SERVER}/dalla/ani/live_icon_ranking.json`}}/>
                  </div>
                }
                {
                  !list.roomNo && list.listenRoomNo && list.listenOpen !== 2 &&
                  <div className='listenertag' onClick={(e) => {
                    e.stopPropagation();
                    RoomValidateFromListenerFollow({
                      memNo: list.memNo,
                      history: locationStateHistory,
                      globalState,
                      dispatch,
                      nickNm: list.nickNm,
                      listenRoomNo: list.listenRoomNo
                    });
                  }}>
                    <Lottie
                      options={{loop: true, autoPlay: true, path: `${IMG_SERVER}/dalla/ani/main_headset_icon.json`}}/>
                  </div>
                }
                <div className='infoWrap'>
                  <div className='userNick'>{list.nickNm}</div>
                </div>
              </ListRow>
            </div>
          )
        })}
        <div className='nextRanking' onClick={() => history.push(`/rank/dj`)}>
          <p>그 다음은 누구일까?</p><span/>
        </div>
      </Swiper>
      }
    </div>
  )
}

export default React.memo(DjChatSwiper);
