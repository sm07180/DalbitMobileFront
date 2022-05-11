import React, {useEffect} from 'react'

// global components
import Swiper from 'react-id-swiper'
// components
// css
import '../scss/swiperList.scss'
import { RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const HotLiveList = (props) => {
  const {data, nickNmKey, swiperRefresh, section} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  const RoomEnter = (e) => {
    e.preventDefault();
    const { roomNo, bjNickNm ,bjMemNo} = e.currentTarget.dataset;

    if (roomNo !== undefined && bjNickNm !== undefined && bjNickNm !== '') {
      RoomValidateFromClipMemNo(roomNo, bjMemNo, dispatch, globalState, history, bjNickNm)
    }
  };

  useEffect(() => {
    if(typeof swiperRefresh === 'function') {
      swiperRefresh(section)
    }
  }, [data]);

  return (
    <>
      {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          const targetNickName = list.hasOwnProperty(nickNmKey) === undefined ? '' : list[nickNmKey];
          return (
            <div key={list.roomNo} data-room-no={list.roomNo}  data-bj-mem-no={list.bjMemNo} data-bj-nick-nm={targetNickName} onClick={RoomEnter}>
              <div className="listColumn">
                <div className="photo">
                  <img src={list.bgImg.thumb292x292} />
                  {/* {list.roomType === '03' && <div className="badgeVideo"></div>} */}
                </div>
                <p className='nick'>{targetNickName}</p>
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
