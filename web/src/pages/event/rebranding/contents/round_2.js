import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
import moment from 'moment'
// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'

import '../style.scss'

const Round_2 = (props) => {
  // 
  const eventDate = {start: '2022.03.18', end: '2022.03.27'}
  const newDate = moment().format('YYMMDD');
  const startDate = moment(eventDate.start).format('YYMMDD')

  return (
    <>
      <section className="date">
        {`${moment(eventDate.start).format('YY.MM.DD')} - ${moment(eventDate.end).format('MM.DD')}`}
      </section>
      {startDate < newDate ? 
        <>
        <section className="listWrap">
          <div className="rankWrap">
            <RankList photoSize={55} type="my">
              <div className="listContent">
                <div className="listItem">
                  <GenderItems />
                  <div>adsdfasdf</div>
                </div>
                <div className="listItem">
                  <i className="d">100</i>
                  <i className="a">100</i>
                  <i className="l">100</i>
                </div>
              </div>
              <div className="listBack">
                <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="" />
                <span>0</span>
              </div>
            </RankList>
          </div>
          <div className="rankWrap">
            <RankList photoSize={55}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems />
                  <div>adsdfasdf</div>
                </div>
              </div>
              <div className="listBack">
                <span>0</span>
              </div>
            </RankList>
            <RankList photoSize={55}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems />
                  <div>adsdfasdf</div>
                </div>
              </div>
              <div className="listBack">
                <span>0</span>
              </div>
            </RankList>
            <RankList photoSize={55}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems />
                  <div>adsdfasdf</div>
                </div>
              </div>
              <div className="listBack">
                <span>0</span>
              </div>
            </RankList>
            <RankList photoSize={55}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems />
                  <div>adsdfasdf</div>
                </div>
              </div>
              <div className="listBack">
                <span>0</span>
              </div>
            </RankList>
            <button className="moreBtn">더보기</button>
          </div>
          <div className="noList">
            <img src={`${IMG_SERVER}/event/rebranding/listNone.png`} />
            <span>참가자들이 dalla를 만들고 있어요!</span>
          </div>
        </section>
        <section>
          <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
        </section>
        </>
        :
        <section className="listWrap">
          <div className="comingsoon">
            <img src={`${IMG_SERVER}/event/rebranding/comingsoon.png`} alt="comingsoon" />
            <p>다음 회차엔 어떤 경품이?</p>
            <span>회차가 변경되면 보유한 dalla와 스톤이<br/>자동으로 소멸됩니다.</span>
          </div>
        </section>
      }
    </>
  )
}

export default Round_2
