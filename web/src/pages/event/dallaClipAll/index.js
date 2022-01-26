import React, {useEffect, useState, useContext} from 'react'

import Swiper from 'react-id-swiper'
import Header from 'components/ui/new_header'
import ListRow from 'components/ui/listRow/ListRow'

import './dallaClipAll.scss'

const DallaClipAll = () => {

  const [periodPop, setPeriodPopup] = useState(false)
  const [classifiPop, setClassifiPopup] = useState(false)

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 2, 
  }

  const tabBtnLists = ['ALL','커버/노래','작사/작곡','힐링','수다/대화','ASMR','고민/사연','성우','더빙',]

  return (
    <div id="dallaClipAll">
      <Header>
        <h2>좋아요한 클립</h2>
        <div className="iconWrap">
          <img src="https://image.dalbitlive.com/clip/dalla/play.png" />
          <img src="https://image.dalbitlive.com/clip/dalla/randomMix.png" />
        </div>
      </Header>
      <section className='tabmenuWrap'>
        <div className="tabmenu">
          <Swiper {...swiperParams}>
            {tabBtnLists.map((list, index)=>{
              return(
                <div className="tabBtn" key={index}>{list}</div>
              )
            })}
          </Swiper>
        </div>
      </section>
      <section className="filterWrap">
        <div className="filter">
          <div className="filterBtn" onClick={()=>{setClassifiPopup(!classifiPop)}}>
            최신순
            <span className="arrowDown"></span>
            {classifiPop &&
              <div className="option">
                <span className="checked">인기순</span>
                <span>최신순</span>
                <span>좋아요 많은 순</span>
                <span>재생 많은 순</span>
                <span>받은 선물 순</span>
              </div>
            }
            
          </div>
          <div className="filterBtn" onClick={()=>{setPeriodPopup(!periodPop)}}>
            전체 기간
            <span className="arrowDown"></span>
            {periodPop && 
              <div className="option">
                <span className="checked">오늘</span>
                <span>최근 7일</span>
                <span>전체 기간</span>
              </div>
            }
          </div>
        </div>
      </section>
      <section className="listWrap">
        <ListRow>
          <div className="listInfo">
            <div className="listItem">
              <span className="title">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
            </div>
            <div className="listItem">
              <span className="gender male"></span>
              <span className="nickNm">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
            </div>
            <div className="listItem">
              <div className="cnt">45</div>
              <div className="cnt">45</div>
            </div>
          </div>
          <div className="heart">
            <img src="https://image.dalbitlive.com/clip/dalla/heartOff.png" />
          </div>
        </ListRow>
      </section>
    </div>
  )
}

export default DallaClipAll