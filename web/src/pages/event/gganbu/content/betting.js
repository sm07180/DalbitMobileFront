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
  const MAX_MARBLE_BETTING_CNT = 10;
  const {tabContent, setTabContent} = props
  const [bettingPop, setBettingPop] = useState(false) //홀짝 베팅 팝업
  const [myMarble, setMyMarble] = useState({
    rMarble: 10,
    yMarble: 4,
    bMarble: 5,
    pMarble: 2,
  })  // 보유한 구슬
  
  const [bettingVal, setBettingVal] = useState({
    rBetting: 0,
    yBetting: 0,
    bBetting: 0,
    pBetting: 0,
  }) // 베팅할 구슬
  const [winList, setWinList] = useState()

  const rMarbleRef = useRef();
  const yMarbleRef = useRef();
  const bMarbleRef = useRef();
  const pMarbleRef = useRef();

  const successMarbleRef = useRef([]);

  let totalBetting = 1;
  let inputtotal = 0;

  const history = useHistory()

  const fetchBettingList = async () => {
    const param = {
      gganbuNo: 1,
      pageNo:1,
      pagePerCnt:5
    }
    const {data, message} = await Api.getGganbuBettingList(param);
    if (message === 'SUCCESS') {
      console.log(data);
    } else {
      globalCtx.action.alert({
        msg: message
      })
    }
  }
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

  const marbleValueIns = (color, cnt) => {
    const rMarbleInputVal = rMarbleRef.current.value ? parseInt(rMarbleRef.current.value) : 0;
    const yMarbleInputVal = yMarbleRef.current.value ? parseInt(yMarbleRef.current.value) : 0;
    const bMarbleInputVal = bMarbleRef.current.value ? parseInt(bMarbleRef.current.value) : 0;
    const pMarbleInputVal = pMarbleRef.current.value ? parseInt(pMarbleRef.current.value) : 0;
    let resetMarble = () => {};

    const toast1 = '구슬 개수를 확인해주세요'
    const toast2 = '베팅 가능한 최대 개수는 10개입니다';

    let betCnt = cnt;

    switch(color) {
      case 'r':
        resetMarble = (toast) => {
          globalCtx.action.toast({msg: toast});
          successMarbleRef.current[0].innerText = myMarble.rMarble;
          rMarbleRef.current.value = "";
          betCnt = 0;
        };
        if(myMarble.rMarble < cnt){
          // toast,
          resetMarble(toast1);
        } else if(cnt + yMarbleInputVal + bMarbleInputVal + pMarbleInputVal > MAX_MARBLE_BETTING_CNT) {
          // toast,
          resetMarble(toast2);
        }else {
          successMarbleRef.current[0].innerText = myMarble.rMarble + cnt;
        }                
        setBettingVal({
          ...bettingVal,
          rBetting : betCnt
        })
        break;

      case 'y':
        resetMarble = (toast) => {
          globalCtx.action.toast({msg: toast});
          successMarbleRef.current[1].innerText = myMarble.yMarble;
          yMarbleRef.current.value = "";
          betCnt = 0;
        };
        if(myMarble.yMarble < cnt){
          // toast,
          resetMarble(toast1);
        } else if(cnt + rMarbleInputVal + bMarbleInputVal + pMarbleInputVal > MAX_MARBLE_BETTING_CNT) {
          // toast,
          resetMarble(toast2);
        }else {
          successMarbleRef.current[1].innerText = myMarble.yMarble + cnt;
        }        
        setBettingVal({
          ...bettingVal,
          yBetting : betCnt
        })
        break;

      case 'b':
        resetMarble = (toast) => {
          globalCtx.action.toast({msg: toast});
          successMarbleRef.current[2].innerText = myMarble.bMarble;
          bMarbleRef.current.value = "";
          betCnt = 0;
        };
        if(myMarble.bMarble < cnt){
          // toast,
          resetMarble(toast1);
        } else if(cnt + rMarbleInputVal + yMarbleInputVal + pMarbleInputVal > MAX_MARBLE_BETTING_CNT) {
          // toast,
          resetMarble(toast2);
        }else {
          successMarbleRef.current[2].innerText = myMarble.bMarble + cnt;
        }        
        setBettingVal({
          ...bettingVal,
          bBetting : betCnt
        })
        break;

      case 'p':
        resetMarble = (toast) => {
          globalCtx.action.toast({msg: toast});
          successMarbleRef.current[3].innerText = myMarble.pMarble;
          pMarbleRef.current.value = "";
          betCnt = 0;
        };
        if(myMarble.pMarble < cnt){
          resetMarble(toast1);
        } else if(cnt + rMarbleInputVal + yMarbleInputVal + bMarbleInputVal > MAX_MARBLE_BETTING_CNT) {
          resetMarble(toast2);
        }else {
          successMarbleRef.current[3].innerText = myMarble.pMarble + cnt;
        }      
        setBettingVal({
          ...bettingVal,
          pBetting : betCnt
        })  
        break;
      
      default:
    }
  }
  

  const marbleOnchange = (inputRef, marbleColor) => {
    const marbleCnt = Number(inputRef.current.value);   

    if(typeof marbleCnt === 'number') {
      if(!isNaN(marbleCnt)) {
        marbleValueIns(marbleColor, marbleCnt)
      }else {
        marbleValueIns(marbleColor, 0)
      }
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
      fetchBettingList()
    }
  }, [tabContent])

  useEffect(() => {
    const btnEle = document.getElementById('bettingBtn');

    if(bettingVal.rBetting !== 0 || bettingVal.yBetting !== 0 || bettingVal.bBetting !== 0 || bettingVal.pBetting !== 0) {      
      btnEle.classList.remove('disable');
    } else {            
      btnEle.classList.add('disable');
    }
  }, [bettingVal])


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
                <img src="https://image.dalbitlive.com/event/gganbu/marble_title-status.png" alt="구슬 현황" />
              </div>
              <div className="sectionMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                  <span className="marbleCount">{myMarble.rMarble}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <span className="marbleCount">{myMarble.yMarble}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <span className="marbleCount">{myMarble.bMarble}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <span className="marbleCount">{myMarble.pMarble}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/gganbu/marble_title-betting.png" alt="배팅할 구슬 개수" />
              </div>
              <div className="sectionMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                  <input type="number" ref={rMarbleRef} name="marbleBettingCount"
                   className="bettingCount" placeholder="0"
                    onChange={() => marbleOnchange(rMarbleRef, 'r')}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <input type="number" ref={yMarbleRef} name="marbleBettingCount"
                   className="bettingCount" placeholder="0"
                   onChange={() => marbleOnchange(yMarbleRef, 'y')}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <input type="number" ref={bMarbleRef} name="marbleBettingCount"
                   className="bettingCount" placeholder="0"
                   onChange={() => marbleOnchange(bMarbleRef, 'b')}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <input type="number" ref={pMarbleRef} name="marbleBettingCount"
                   className="bettingCount" placeholder="0"
                   onChange={() => marbleOnchange(pMarbleRef, 'p')}
                  />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="sectionTitle">
                <img src="https://image.dalbitlive.com/event/gganbu/marble_title-result.png" alt="성공시 내 구슬 개수" />
              </div>
              <div className="sectionMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                  <span ref={(el) => successMarbleRef.current[0] = el} className="marbleCount">
                    {myMarble.rMarble}
                  </span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <span ref={(el) => successMarbleRef.current[1] = el} className="marbleCount">
                    {myMarble.yMarble}
                  </span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <span ref={(el) => successMarbleRef.current[2] = el} className="marbleCount">
                    {myMarble.bMarble}
                  </span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <span ref={(el) => successMarbleRef.current[3] = el}className="marbleCount">
                    {myMarble.pMarble}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <button id="bettingBtn" className="bettingBtn disable" onClick={bettingStart}></button>
      </div>

      <div className="marbleLog">
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
              <div className="logMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <span className="marbleCount">0</span>
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
              <div className="logMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <span className="marbleCount">0</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <span className="marbleCount">0</span>
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
      {bettingPop && <BettingPop setBettingPop={setBettingPop} bettingVal={bettingVal} myMarble={myMarble}/>}
    </div>
  )
}
