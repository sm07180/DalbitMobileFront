import React from 'react'

// global components
import Swiper from 'react-id-swiper'
// components
// css
import '../scss/swiperList.scss'
import {RoomValidateFromClip} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const HotLiveList = (props) => {
  const {data, type} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 12,
  }

  const RoomEnter = (e) => {
    e.preventDefault();
    const {roomNo, bjNickNm} = e.currentTarget.dataset;

    if (roomNo !== undefined && bjNickNm !== undefined) {
      RoomValidateFromClip(roomNo, dispatch, globalState, history, bjNickNm)
    }
  };

  return (
    <>
      {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index} data-room-no={list.roomNo}  data-bj-nick-nm={list.nickNm} onClick={RoomEnter}>
              <div className="listColumn">
                <div className="photo">
                  <img src={list.bgImg.thumb190x190} />
                  {/* {list.roomType === '03' && <div className="badgeVideo"></div>} */}
                </div>
                <p className='nick'>{list.nickNm}</p>
              </div>
            </div>
          )
        })}
      </Swiper>
      }
    </>
  )
}

export default HotLiveList;
