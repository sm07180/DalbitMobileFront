import React, {useEffect} from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'
import {useHistory} from "react-router-dom";

const DjList = (props) => {
  const {data, addAction, delAction, swiperRefresh, section} = props

  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 16,
  }

  const goProfile = (e) => {
    const { memNo } = e.currentTarget.dataset;

    if ( memNo !== undefined ) {
      history.push(`/profile/${memNo}`);
    }
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
            <div className='listWrap' key={list.memNo}>
              <div className="listColumn">
                <div className="photo" data-mem-no={list.memNo} onClick={goProfile}>
                  <img src={list.profImg.thumb292x292} />
                </div>
                <div className="listItem">
                  <GenderItems data={list.gender} />
                  <p className='nick'>{list.nickNm}</p>
                </div>
              </div>              
              {!list.isFan ? <button data-mem-no={list.memNo} onClick={addAction}>+ 팬등록</button> : <button className='active' data-mem-no={list.memNo} onClick={delAction}>팬</button>}
            </div>
          )
        })}
      </Swiper>
      }
    </>
  )
}

export default DjList;
