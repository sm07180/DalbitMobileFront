import React, {useContext, useEffect} from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'
import {useHistory} from "react-router-dom";
import {playClip} from "pages/clip/components/clip_play_fn";
import {useDispatch, useSelector} from "react-redux";

const ClipList = (props) => {
  const { data, swiperRefresh, section } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  // 클립 듣기
  const clipPlayHandler = (e, memNo) => {
    const { clipNo } = e.currentTarget.dataset;
    const playListInfoData = {
      myClipType: 1,
      page: 1,
      records: 100,
      memNo,
      type:'setting'
    }
    const clipParam = { clipNo, playList: data, globalState, dispatch, history, playListInfoData };
    playClip(clipParam);
  };

  useEffect(() => {
    if(typeof swiperRefresh === 'function') {
      swiperRefresh(section);
    }
  }, [data]);

  return (
    <>
    {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={list.clipNo} data-clip-no={list.clipNo} onClick={(e) => clipPlayHandler(e, list.memNo)}>
              <div className="listColumn">
                <div className="photo">
                  <img src={list.bgImg.thumb292x292} />
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
