import React, {useEffect, useState} from 'react'
import Utility from 'components/lib/utility'
import moment from 'moment';

// global components
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import CheckList from '../components/CheckList'

const HistoryList = (props) => {
  const {walletData, pageNo, setPageNo, selectedCode, setSelectedCode, isLoading, setIsLoading, getWalletHistory, lastPage, cancelExchangeFetch, walletType} = props;
  const [slidePop, setSlidePop] = useState(false);

  const {popHistory, listHistory, popHistoryCnt} = walletData;

  const [beforeCode, setBeforeCode] = useState("0");

  useEffect(() => {
    if (slidePop){
      setBeforeCode(selectedCode);
    }
  }, [slidePop]);

  const onClickPopSlide = () => {
    setSlidePop(true)
  }

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }

    return () => {
      if (typeof document !== "undefined"){
        document.removeEventListener("scroll", scrollEvent);
      }
    }

  }, [walletData, pageNo, setPageNo, selectedCode, setSelectedCode, isLoading, setIsLoading, getWalletHistory, lastPage]);

  const scrollEvent = () => {
    if (!isLoading){
      let scrollHeight = document.documentElement.scrollHeight;
      let scrollTop = document.documentElement.scrollTop;
      let offsetHieght = document.documentElement.offsetHeight;

      if (scrollHeight - 10 <= scrollTop + offsetHieght && pageNo < lastPage){
        setIsLoading(true);
        let nexPageNo = pageNo + 1;
        setPageNo(nexPageNo);
        getWalletHistory(nexPageNo, selectedCode);
      }
    }
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
                <div className="historyText">{data?.contents}</div>
                {data?.type === 4 && data?.exchangeIdx > 0 &&
                <button className="exCancelBtn"
                        onClick={() => cancelExchangeFetch(data.exchangeIdx)}>취소하기</button>
                }
                {/*<div className="otherUserNick">계란노른자</div>*/}
                {/*<span className="privateBdg">몰래</span>*/}
              </div>
              <div className="listItem">
                <div className="historyDate">{moment(data?.updateDt,'YYYYMMDD').format('YYYY.MM.DD')}</div>
              </div>
            </div>
            <div className={`quantity${(data?.dalCnt < 0 || data?.byeolCnt < 0) ? ' minous' : ''}`}>
              {walletType === "달 내역" ?
                Utility.addComma(`${data?.dalCnt < 0 ? '':'+'}${data?.dalCnt}`)
                :
                Utility.addComma(`${data?.byeolCnt < 0 ? '':'+'}${data?.byeolCnt}`)
              }
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
                <CheckList text="전체내역" code={`0`} beforeCode={beforeCode} setBeforeCode={setBeforeCode}>
                  <input type="checkbox" className="blind" name="checkListAll" />&nbsp;
                  ({Utility.addComma(popHistoryCnt)}건)
                </CheckList>
              </div>
              <div className="historyScroll">
                {popHistory.map((data,index) => {
                  return (
                    <CheckList text={`${data.text} (${data?.cnt||'0'}건)`} index={index} key={index} code={`${data.walletCode}`} beforeCode={beforeCode} setBeforeCode={setBeforeCode}>
                    </CheckList>
                  )
                })}
              </div>
            </div>
            <div className="buttonGroup">
              <button className="cancel"
                      onClick={() => setSlidePop(false)}
              >취소</button>
              <button className="apply" onClick={() =>{
                setSelectedCode(beforeCode);
                setSlidePop(false);
              }}>적용</button>
            </div>
          </section>
        </PopSlide>
      }
    </>
  )
};

export default HistoryList