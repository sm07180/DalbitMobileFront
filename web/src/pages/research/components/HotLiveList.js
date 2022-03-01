import React, {useContext} from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const HotLiveList = (props) => {
  const {data, type, nickNmKey} = props
  const context = useContext(Context); //context
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  const RoomEnter = (e) => {
    e.preventDefault();
    const { roomNo, bjNickNm } = e.currentTarget.dataset;

    if (roomNo !== undefined && bjNickNm !== undefined && bjNickNm !== '') {
      RoomValidateFromClip(roomNo, context, history, bjNickNm)
    }
  };

  return (
    <>
      {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          const targetNickName = list.hasOwnProperty(nickNmKey) === undefined ? '' : list[nickNmKey];
          return (
            <div key={index} data-room-no={list.roomNo}  data-bj-nick-nm={targetNickName} onClick={RoomEnter}>
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
