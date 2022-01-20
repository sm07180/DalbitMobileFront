import React, {useEffect, useState, useContext} from 'react'

import Swiper from 'react-id-swiper'
import Header from 'components/ui/new_header'

import './dallaClipAll.scss'

const DallaClipAll = () => {

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 2, 
  }

  const tabBtnLists = ['ALL','커버/노래','작사/작곡','힐링','수다/대화','ASMR','고민/사연','성우','더빙',]

  return (
    <div id="dallaClipAll">
      <Header title="좋아요한 클립" />
      <section>
        <div className="tabWrap">
          <Swiper {...swiperParams}>
            {tabBtnLists.map((list, index)=>{
              return(
                <div className="tabBtn" key={index}>{list}</div>
              )
            })}
          </Swiper>
        </div>
      </section>
      <section>
        <div className="filterWrap">
          <div className="filter">최신순</div>
          <div className="filter">전체 기간</div>
        </div>
      </section>
      <section>
        <div className="listWrap">
          <div className="list">
            <div className="listImg"></div>
            <div className="listInfo">
              <div className="listItem">
                <span className="title">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
              </div>
              <div className="listItem">
                <span className="gender">m</span>
                <span className="nickNm">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
              </div>
              <div className="listItem">
                <div className="cnt">45</div>
                <div className="cnt">45</div>
              </div>
            </div>
            <div className="listBack">♥</div>
          </div>
          <div className="list">
            <div className="listImg"></div>
            <div className="listInfo">
              <div className="listItem">
                <span className="title">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
              </div>
              <div className="listItem">
                <span className="gender">m</span>
                <span className="nickNm">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
              </div>
              <div className="listItem">
                <div className="cnt">45</div>
                <div className="cnt">45</div>
              </div>
            </div>
            <div className="listBack">♥</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DallaClipAll