import React, {useContext} from 'react'

import Lottie from 'react-lottie'
// global components
import Swiper from 'react-id-swiper'
import ListRow from 'components/ui/listRow/ListRow'
import {Context} from "context";
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {IMG_SERVER} from 'context/config'

const CardList = (props) => {
  const {data} = props

  const history = useHistory();
  const context = useContext(Context);

  let locationStateHistory = useHistory();

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
                      list.roomNo &&
                        <div className='livetag' onClick={(e) => {
                          e.stopPropagation();
                          RoomValidateFromClipMemNo(list.roomNo, list.memNo, context, locationStateHistory, list.nickNm);
                        }}>
                          <Lottie
                            options={{
                              loop: true,
                              autoPlay: true,
                              path: `${IMG_SERVER}/dalla/ani/live_icon_ranking.json`
                            }}
                          />
                        </div>
                    }
                    <div className='infoWrap'>
                      <div className='userNick'>{list.nickNm}</div>
                    </div>
                  </ListRow>
                </div>
              )
            })}
            <div className='nextRanking' onClick={() => history.push(`/rankDetail/DJ`)}>
              <p>그 다음은 누구일까?</p>
              <span></span>
            </div>
        </Swiper>
      }
    </div>
  )
}

export default React.memo(CardList);
