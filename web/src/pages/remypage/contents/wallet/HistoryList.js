import React, {useState, useEffect} from 'react'

import Api from 'context/api'

// global components
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import CheckList from '../../components/CheckList'

const HistoryList = (props) => {
  const [slidePop, setSlidePop] = useState(false)
  const [historyInfo, setHistoryInfo] = useState([])

  // 조회 API
  const fetchPopSlideInfo = () => {
    Api.getMypageWalletPop({walletType: 1}).then((res) => {
      if (res.result === 'success') {
        setHistoryInfo(res.data.list)
      }
    })
  }

  useEffect(() => {
    fetchPopSlideInfo()
  },[])

  const onClickPopSlide = () => {
    setSlidePop(true)
  }

  return (
    <>
      <section className="optionWrap">
        <div className="selectBox">
          <button onClick={onClickPopSlide}>전체<i className="arrowDownIcon" /></button>
        </div>
        <div className="sub">최근 6개월 이내</div>
      </section>
      <section className='listWrap'>
        <div className="listRow">
          <div className="listContent">
            <div className="historyText">굿스타트 이벤트 2위</div>
            <div className="historyDate">22.01.03</div>
          </div>
          <div className="quantity">+7,000</div>
        </div>
        <div className="listRow">
          <div className="listContent">
            <div className="listItem">
              <div className="historyText">환전신청</div>
              <button className="exCancelBtn">취소하기</button>
            </div>
            <div className="historyDate">22.01.03</div>
          </div>
          <div className="quantity minous">-7,000</div>
        </div>
        <div className="listRow">
          <div className="listContent">
            <div className="listItem">
              <div className="historyText">선물 "소라게"</div>
              <div className="otherUserNick">계란노른자</div>
              <span className="privateBdg">몰래</span>
            </div>
            <div className="historyDate">22.01.03</div>
          </div>
          <div className="quantity minous">-7,000</div>
        </div>
      </section>
      {slidePop &&
        <PopSlide setPopSlide={setSlidePop}>
          <section className='walletHistoryCheck'>
            <div className='title'>달 사용/획득</div>
            <div className="listWrap">
              <div className="listAll">
                <CheckList text="전체">
                  <input type="checkbox" className="blind" name="checkListAll" />&nbsp;
                  (29건)
                </CheckList>
              </div>
              <div className="historyScroll">
                {historyInfo.map((data,index) => {
                  return (
                    <CheckList text={data.text} key={index}>
                      <input type="checkbox" className="blind" name="checkListAll" />&nbsp;
                      ({data.cnt}건)
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