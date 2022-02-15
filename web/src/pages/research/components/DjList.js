import React from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'

const DjList = (props) => {
  const {data, addAction, delAction} = props

  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <>
      {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index}>
              <div className="listColumn">
                <div className="photo">
                  <img src={list.profImg.thumb150x150} />
                  {list.roomType === '03' && <div className="badgeVideo"></div>}
                </div>
                <div className="listItem">
                  <GenderItems data={list.gender} />
                  <p className='nick'>{list.nickNm}</p>
                </div>
                {!list.isFan ? <button data-mem-no={list.memNo} onClick={addAction}>+ 팬등록</button> : <button className='active' data-mem-no={list.memNo} onClick={delAction}>팬</button>}
              </div>
            </div>
          )
        })}
      </Swiper>
      }
    </>
  )
}

export default DjList;
