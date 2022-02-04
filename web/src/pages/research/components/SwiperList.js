import React from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import './swiperList.scss'

const SwiperList = (props) => {
  const {data, type} = props

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
                  <img src={list.bgImg.thumb150x150} />
                  {type === 'live' && list.roomType === '03' && <div className="badgeVideo"></div>}
                </div>
                {type === 'dj' &&
                  <>
                  <div className="listItem">
                    <GenderItems data={list.gender} />
                    <p className='nick'>{list.nickNm}</p>
                  </div>
                  {!list.isFan ? <button>+ 팬등록</button> : <button className='active'>팬</button>}
                  </>
                }
                {type === 'live' &&
                  <p className='nick'>{list.nickNm}</p>
                }
                {type === 'clip' &&
                  <>
                    <p className='nick'>{list.nickName}</p>
                    <p className='title'>{list.title}</p>
                  </>
                }
              </div>
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default SwiperList
