import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
import moment from 'moment'
// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import RankList from '../../components/rankList/RankList'

import '../style.scss'

const Round_1 = (props) => {
  const [popRankSlide, setPopRankSlide] = useState(false)
  // 
  const eventDate = {start: '2022.03.18', end: '2022.03.27'}
  
  // 랭킹 더보기
  const moreRank = () => {
    setPopRankSlide(true)
  }
  
  return (
    <>
      <section className="date">
        {`${moment(eventDate.start).format('YY.MM.DD')} - ${moment(eventDate.end).format('MM.DD')}`}
      </section>
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
              <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
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
          <button className="moreBtn" onClick={moreRank}>더보기</button>
        </div>
        <div className="noList">
          <img src={`${IMG_SERVER}/event/rebranding/listNone.png`} />
          <span>참가자들이 dalla를 만들고 있어요!</span>
        </div>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
      </section>
      {popRankSlide &&
        <PopSlide setPopSlide={setPopRankSlide}>
          <section className="rebrandingRank">
            <h3>달라져스 : 1 라운드<span>22. 03. 08 - 03. 17</span></h3>
            <div className="rankWrap">
              <RankList photoSize={55}>
                <div className="listContent">
                  <div className="listItem">
                    <GenderItems />
                    <div>adsdfasdf</div>
                  </div>
                </div>
                <div className="listBack">
                  <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
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
            </div>
          </section>
        </PopSlide>
      }
    </>
  )
}

export default Round_1
