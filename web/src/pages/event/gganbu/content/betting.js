import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'
import Swiper from 'react-id-swiper'

import BettingPop from './bettingPop'

import {Context} from 'context'
import noResult from 'components/ui/noResult'

export default (props) => {
  const globalCtx = useContext(Context)
  const {tabContent, setTabContent} = props
  const [bettingPop, setBettingPop] = useState(false) //홀짝 베팅 팝업
  const [ifSuccess, setIfSuccess] = useState([]) 
  const [bettingVal, setBettingVal] = useState([]) // 베팅할 구슬
  const [myBead, setMyBead] = useState([10,4,5,2])  // 보유한 구슬
  const [successBead, setSuccessBead] = useState([])  // 성공 시 구슬
  const [winList, setWinList] = useState()

  let totalBetting = 1;
  let inputtotal = 0;

  const history = useHistory()
  const getRoundEventInfo = useCallback(async () => {
    const {message, data} = await Api.getRaffleEventTotalInfo()
    if (message === 'SUCCESS') {
      // setRaffleTotalSummaryInfo(data.summaryInfo)
      // setRaffleItemInfo(data.itemInfo)
    }
  }, [])


  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일`
    // return `${month}월 ${day}일 ${time}`
  }

  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    // resistanceRatio: 0,
    autoplay: {
      delay: 2500
    }
  }


  const bettingBeadCount = (e) => {
    let inputLength = document.getElementsByClassName('bettingCount').length

    for (let i = 0; i < inputLength; i++) {
      bettingVal[i] = Number(document.getElementsByName('beadBettingCount')[i].value)

      // 보유한 구슬보다 베팅할 구슬이 많을 경우 예외처리
      if(bettingVal[i] <= myBead[i]){
        successBead[i] = myBead[i] + bettingVal[i]
        setIfSuccess(successBead);
      } else {
        globalCtx.action.toast({msg: '구슬 개수를 확인해주세요.'})
        e.target.value = ""
        successBead[i] = myBead[i]
        bettingVal[i] = 0
        setIfSuccess(myBead);
      } 
      inputtotal = bettingVal.reduce((a, b) => a + b)
    }

    // 한 구슬을 10개 이상 입력했을 경우 예외처리
    if (e.target.value > 10) {
      globalCtx.action.toast({msg: '베팅 가능한 최대 개수는 10개 입니다.'})
      e.target.value = ""
      setIfSuccess(myBead);
    }

    // 베팅한 모든 구슬의 합이 10개 이상일 경우 예외처리
    if (inputtotal > 10) {
      globalCtx.action.toast({msg: '베팅 가능한 최대 개수는 10개 입니다.'})
      e.target.value = ""
      for (let i = 0; i < inputLength; i++) {
        bettingVal[i] = Number(document.getElementsByName('beadBettingCount')[i].value)        
        successBead[i] = myBead[i] + bettingVal[i]
      }
      setIfSuccess(successBead);
    }
    
    // 베팅하기 버튼 활성화
    const isBelowThreshold = (currentValue) => currentValue === 0;
    const btnEle = document.getElementById('bettingBtn');
    if(bettingVal.every(isBelowThreshold)) {      
      btnEle.classList.add('disable');
    } else {            
      btnEle.classList.remove('disable');
    }
  }

  const bettingStart = () => {
    if(totalBetting <= 2){
      setBettingPop(true);
    } else {
      globalCtx.action.toast({msg: `베팅 가능한 횟수는 하루에 두 번 입니다.`})
    }
  }

  useEffect(() => {
    if (tabContent === 'betting') {
      getRoundEventInfo()
    }
  }, [tabContent])

  useEffect(() => {
    setIfSuccess(myBead);
  }, [])

  return (
    <div id="betting" style={{display: `${tabContent === 'betting' ? 'block' : 'none'}`}}>
      <div className="participant">
        <div className="participantWrap">
          <div
            className="participantBox"
            onClick={() => {
              history.push('/event/participant')
            }}>
            <label>
              <img src="https://image.dalbitlive.com/event/gganbu/bettingLog_title.png" alt="베팅 참여자" />
            </label>

            {winList ? (
              <Swiper {...swiperParams}>
                {winList.length > 0 &&
                  winList.map((item, index) => {
                    const {winDt, nickNm} = item

                    return (
                      <div className="participantList" key={index}>
                        <p className="time">{dateFormatter(winDt)}</p>
                        <p className="user">{nickNm}</p>
                        <p className={`result ${result === '성공' ? 'success' : 'fail'}`}>{result}</p>
                      </div>
                    )
                  })}
              </Swiper>
            ) : (
              <div className="participantList">
                <p className="nodata">깐부 눈치 보지 말고 베팅해버려~</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="betting">
        <div className="bettingWrap">
          <form action="" method="get">
            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/gganbu/bead_title-status.png" alt="구슬 현황" />
              </div>
              <div className="sectionBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <span className="beadCount">{myBead[0]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <span className="beadCount">{myBead[1]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <span className="beadCount">{myBead[2]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <span className="beadCount">{myBead[3]}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/gganbu/bead_title-betting.png" alt="배팅할 구슬 개수" />
              </div>
              <div className="sectionBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" placeholder="0" onChange={bettingBeadCount} />
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" placeholder="0" onChange={bettingBeadCount} />
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" placeholder="0" onChange={bettingBeadCount} />
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" placeholder="0" onChange={bettingBeadCount} />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/gganbu/bead_title-result.png" alt="성공시 내 구슬 개수" />
              </div>
              <div className="sectionBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <span className="beadCount">{ifSuccess[0]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <span className="beadCount">{ifSuccess[1]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <span className="beadCount">{ifSuccess[2]}</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <span className="beadCount">{ifSuccess[3]}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <button id="bettingBtn" className="bettingBtn disable" onClick={bettingStart}></button>
      </div>

      <div className="beadLog">
        <div className="title">
          <img src="https://image.dalbitlive.com/event/gganbu/betting_myLog.png" alt="나의 베팅내역" />
        </div>
        <div className="logTable">
          <div className="logHead">
            <div className="logTitle">베팅한 구슬</div>
            <div className="logTitle">
              성공
              <br />
              여부
            </div>
            <div className="logTitle">참여자 / 일시</div>
          </div>
          <div className="logBody">
            <div className="logList">
              <div className="logBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <span className="beadCount">0</span>
                </div>
              </div>
              <div className="logResult">
                <p className="success">성공</p>
              </div>
              <div className="logData">
                <div className="logUser">띵 동 ◡̈♪</div>
                <div className="logTime">12/22 15:00</div>
              </div>
            </div>
            <div className="logList">
              <div className="logBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <span className="beadCount">0</span>
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <span className="beadCount">0</span>
                </div>
              </div>
              <div className="logResult">
                <p className="fail">실패</p>
              </div>
              <div className="logData">
                <div className="logUser">일이삼사오육칠팔구십일이삼사오육칠팔구십</div>
                <div className="logTime">12/22 15:00</div>
              </div>
            </div>
            <NoResult type="default" text="아직 베팅 내역이 없습니다." />
          </div>
        </div>
      </div>
      {bettingPop && <BettingPop setBettingPop={setBettingPop} bettingVal={bettingVal} myBead={myBead}/>}
    </div>
  )
}
