import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
import moment from 'moment'
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'

import '../style.scss'

const Round_3 = (props) => {
  const [popSpecial, setPopSpecial] = useState(false)
  //
  const eventDate = {start: '2022.03.18', end: '2022.03.27'}
  const newDate = moment().format('YYMMDD');
  const startDate = moment(eventDate.start).format('YYMMDD')

  // 스페셜 라운드 팝업
  const onPopSpecial = () => {
    setPopSpecial(true)
  }
  const closePopSpecial = () => {
    setPopSpecial(false)
  }

  return (
    <>
      <section className="date">
        라운드 1+2 종합순위
        <button className="question" onClick={onPopSpecial}></button>
      </section>
      {startDate < newDate ? 
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
        :
        <section className="listWrap">
          <div className="specialRound">
            <img src={`${IMG_SERVER}/event/rebranding/roulette.png`} alt="roulette" />
            <p>종합순위 상위 50명에게<br/>주어지는 당첨 기회</p>
            <span>· 당첨자는 라이브 방송에서 추첨합니다.</span>
            <span>· 방송 일정은 추후 공지됩니다.</span>
          </div>
        </section>
      }
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
      </section>
      {popSpecial && 
        <LayerPopup title="스페셜 라운드" setPopup={setPopSpecial} close={false}>
          <section className="specialRound">
            <img src={`${IMG_SERVER}/event/rebranding/roulette.png`} alt="roulette" />
            <p>종합순위 상위 50명에게<br/>주어지는 당첨 기회</p>
            <span>· 당첨자는 라이브 방송에서 추첨합니다.</span>
            <span>· 방송 일정은 추후 공지됩니다.</span>
            <SubmitBtn text="확인" onClick={closePopSpecial} />
          </section>
        </LayerPopup>
      }
    </>
  )
}

export default Round_3
