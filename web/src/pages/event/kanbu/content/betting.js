import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import Swiper from 'react-id-swiper'

import BettingPop from './bettingPop'

import {Context} from 'context'

const RAFFLE_INPUT_VALUE_MAX_SIZE = 5 // 응모권 입력 자리수

export default (props) => {
  const globalCtx = useContext(Context)
  const {tabContent, setTabContent} = props
  const [bettingPop, setBettingPop] = useState(true)

  const history = useHistory()
  const itemListRef = useRef([])
  const numberReg = /^[0-9]*$/
  const numberValidation = useCallback((val) => numberReg.test(val) && !isNaN(val), [])

  const getRoundEventInfo = useCallback(async () => {
    const {message, data} = await Api.getRaffleEventTotalInfo()
    if (message === 'SUCCESS') {
      // setRaffleTotalSummaryInfo(data.summaryInfo)
      // setRaffleItemInfo(data.itemInfo)
    }
  }, [])

  const [winList, setWinList] = useState()
  
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
    let inputVal = new Array;
    let inputLength = document.getElementsByClassName('bettingCount').length;
    let inputtotal = 0;

    for(let i = 0; i < inputLength; i++){
      inputVal[i] = Number(document.getElementsByName("beadBettingCount")[i].value);
      inputtotal = inputVal.reduce((a,b) => (a+b));
    }
    if (e.target.value > 10) {
      e.target.value = ""
    }
    if (inputtotal > 10) {
      globalCtx.action.toast({msg: "베팅 가능한 최대 개수는 10개 입니다."})   
      e.target.value = ""
    }
  }

  useEffect(() => {
    if (tabContent === 'betting') {
      getRoundEventInfo()
    }
  }, [tabContent])

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
              <img src="https://image.dalbitlive.com/event/kanbu/bettingLog_title.png" alt="베팅 참여자" />
            </label>

            {winList ? 
              <Swiper {...swiperParams}>
                {winList.length > 0 &&
                  winList.map((item, index) => {
                    const {winDt, nickNm} = item

                    return (
                      <div className="participantList" key={index}>
                        <p className="time">{dateFormatter(winDt)}</p>
                        <p className="user">{nickNm}</p>
                        <p className={`result ${result === "성공" ? "success" : "fail"}`}>{result}</p>
                      </div>
                    )
                  })}
              </Swiper>
             : 
              <div className="participantList">
                <p className="nodata">깐부 눈치 보지 말고 베팅해버려~</p>
              </div>
            }
          </div>
        </div>
      </div>
      
      <div className="betting">
        <div className="bettingWrap">
          <form action="" method="get">
            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/kanbu/bead_title-status.png" alt="구슬 현황" />
              </div>
              <div className="sectionBead">
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
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/kanbu/bead_title-betting.png" alt="배팅할 구슬 개수" />
              </div>
              <div className="sectionBead">
                <div className="beadData">
                  <span className="beadIcon red"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" onChange={bettingBeadCount}/>
                </div>
                <div className="beadData">
                  <span className="beadIcon yellow"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" onChange={bettingBeadCount}/>
                </div>
                <div className="beadData">
                  <span className="beadIcon blue"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" onChange={bettingBeadCount}/>
                </div>
                <div className="beadData">
                  <span className="beadIcon purple"></span>
                  <input type="number" name="beadBettingCount" className="bettingCount" onChange={bettingBeadCount}/>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/kanbu/bead_title-result.png" alt="성공시 내 구슬 개수" />
              </div>
              <div className="sectionBead">
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
            </div>
          </form>          
        </div>
        <button className="bettingBtn disable" onClick={() => setBettingPop(true)}></button>
      </div>

      <div className="beadLog">
        <div className="title">
          <img src="https://image.dalbitlive.com/event/kanbu/betting_myLog.png" alt="나의 베팅내역" />
        </div>
        <div className="logTable">
          <div className="logHead">
              <div className="logTitle">베팅한 구슬</div>
              <div className="logTitle">성공<br/>여부</div>
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
                <div className="logUser">띵 동   ◡̈♪</div>
                <div className="logTime">12/22  15:00</div>
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
                <div className="logTime">12/22  15:00</div>
              </div>        
            </div>
          </div>
        </div>
      </div>
      {bettingPop === true ?
       <BettingPop setBettingPop={setBettingPop}/>
       :
        <></>
      }
    </div>
  )
}
