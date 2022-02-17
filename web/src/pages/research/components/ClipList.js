import React from 'react'

// global components
import Swiper from 'react-id-swiper'
// components
// css
import '../scss/swiperList.scss'
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const ClipList = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {data} = props;
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
  }

  // 클립 듣기
  const playClip = (e) => {
    const {clipNo} = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      const clipParam = {clipNo: clipNo, globalState, dispatch, history};

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
                  <img src={list.bgImg.thumb150x150} />
                </div>
                  <p className='nick'>{list.nickName}</p>
                  <p className='title'>{list.title}</p>
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
