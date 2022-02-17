import React, {useState, useEffect} from 'react'
import Utility ,{addComma} from 'components/lib/utility'
import moment from 'moment';

// global components
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import CheckList from '../components/CheckList'

const HistoryList = (props) => {
  const {walletData} = props;
  const [slidePop, setSlidePop] = useState(false)

  const {popHistory, listHistory, popHistoryCnt} = walletData;

  const onClickPopSlide = () => {
    setSlidePop(true)
  }

  return (
    <>
      {/* 상세내역 리스트 */}
      <section className="optionWrap">
        <div className="selectBox">
          <button onClick={onClickPopSlide}>전체<i className="arrowDownIcon" /></button>
        </div>
        <div className="sub">최근 6개월 이내</div>
      </section>
      <section className='listWrap'>
        {listHistory.map((data, index)=>
          <div className="listRow" key={index}>
            <div className="listContent">
              <div className="listItem">
                {data?.type === 4 && data?.exchangeIdx > 0
                && <button className="exCancelBtn">취소하기</button>}
                <div className="historyText">{data?.contents}</div>

                {/*<div className="otherUserNick">계란노른자</div>*/}
                {/*<span className="privateBdg">몰래</span>*/}

                <div className="historyDate">{moment(data?.updateDt,'YYYYMMDD').format('YYYY.MM.DD')}</div>
              </div>
            </div>
            <div className={`quantity${data?.dalCnt < 0 ? ' minous' : ''}`}>
              {Utility.addComma(`${data?.dalCnt < 0 ? '':'+'}${data?.dalCnt}`)}
            </div>
          </div>
        )}
      </section>

      {/* 상세내역 검색조건 팝업 */}
      {slidePop &&
        <PopSlide setPopSlide={setSlidePop}>
          <section className='walletHistoryCheck'>
            <div className='title'>달 사용/획득</div>
            <div className="listWrap">
              <div className="listAll">
                <CheckList text="전체내역">
                  <input type="checkbox" className="blind" name="checkListAll" />&nbsp;
                  ({Utility.addComma(popHistoryCnt)}건)
                </CheckList>
              </div>
              <div className="historyScroll">
                {popHistory.map((data,index) => {
                  return (
                    <CheckList text={data.text} key={index}>
                      <input type="checkbox" className="blind" name={`check-${index}`} /> ({Utility.addComma(data.cnt)}건)
                    </CheckList>
                  )
                })}
              </div>
            </div>
            <div className="buttonGroup">
              <button className="cancel">취소</button>
              <button className="apply">적용</button>
            </div>
          </section>
        </PopSlide>
      }
    </>
  )
}

export default HistoryList