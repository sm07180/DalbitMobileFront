import React from 'react'
import Swiper from 'react-id-swiper'

export default function AwardsWinnersList(props) {
  const {awardsHonorsDJList, selectedDJIndex, onDJClickHandler} = props
  const swiperParamsRecent = {
    slidesPerView: 'auto',
    initialSlide: selectedDJIndex
  }
  return (
    <div className="winnerList">
      {awardsHonorsDJList?.length > 0 && (
        <Swiper {...swiperParamsRecent}>
          {awardsHonorsDJList.map(({profImg, nickNm}, idx) => (
            <div
              className={`slideWrap ${selectedDJIndex === idx ? 'active' : ''}`}
              onClick={() => onDJClickHandler(idx)}
              key={`latest-` + idx}>
              <div className="slideWrap__thumb">
                <img src={profImg['thumb336x336']} alt={profImg['url']} />
              </div>
              <span className="slideWrap__nickName">{nickNm}</span>
            </div>
          ))}
        </Swiper>
      )}
      <img src="https://image.dalbitlive.com/event/award_rank/dj_content_img01.jpg" alt="2020 달라 어워즈 수상 명단" />
    </div>
  )
}
