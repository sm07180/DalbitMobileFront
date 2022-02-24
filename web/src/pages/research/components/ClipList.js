import React, {useContext} from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const ClipList = (props) => {
  const { data } = props;
  const context = useContext(Context); //context
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 12,
  }

  // 클립 듣기
  const playClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      const clipParam = { clipNo: clipNo, gtx: context, history };

      NewClipPlayerJoin(clipParam);
    }
  };

  return (
    <>
    {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index} data-clip-no={list.clipNo} onClick={playClip}>
              <div className="listColumn">
                <div className="photo">
                  <img src={list.bgImg.thumb190x190} />
                </div>
                  <p className='title'>{list.title}</p>
                  <p className='nick'>{list.nickName}</p>
              </div>
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default ClipList
