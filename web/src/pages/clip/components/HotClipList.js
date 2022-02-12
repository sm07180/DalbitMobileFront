import React from 'react'

import Swiper from 'react-id-swiper'
// global components
import ListRow from 'components/ui/listRow/ListRow'

const HotClipList = (props) => {
  const {data} = props
  
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <>
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index}>
              <ListRow photo={list.bgImg.thumb120x120}>
                <div className='listContent'>
                  <div className="listItem">
                    <img className='rankNm' src={`https://image.dalbitlive.com/clip/dalla/number-${index + 1}.png`} />
                  </div>
                  <div className="listItem">
                    <span className="subject">111{list.subjectName}</span>
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <span className='nick'>{list.nickName}</span>
                  </div>
                </div>
              </ListRow>
              <ListRow photo={list.bgImg.thumb120x120}>
                <div className='listContent'>
                  <div className="listItem">
                    <img className='rankNm' src={`https://image.dalbitlive.com/clip/dalla/number-${index + 1}.png`} />
                  </div>
                  <div className="listItem">
                    <span className="subject">{list.subjectName}</span>
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <span className='nick'>{list.nickName}</span>
                  </div>
                </div>
              </ListRow>
              <ListRow photo={list.bgImg.thumb120x120}>
                <div className='listContent'>
                  <div className="listItem">
                    <img className='rankNm' src={`https://image.dalbitlive.com/clip/dalla/number-${index + 1}.png`} />
                  </div>
                  <div className="listItem">
                    <span className="subject">{list.subjectName}</span>
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <span className='nick'>{list.nickName}</span>
                  </div>
                </div>
              </ListRow>
            </div>
          )
        })}
      </Swiper>
    </>
  )
}

export default HotClipList
