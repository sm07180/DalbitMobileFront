import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'
import Swiper from 'react-id-swiper'

import BettingPop from './bettingPop'

import {Context} from 'context'

export default (props) => {
  const globalCtx = useContext(Context)
  const MAX_MARBLE_BETTING_CNT = 10
  const {tabContent, setTabContent, gganbuInfo} = props

  const [bettingPop, setBettingPop] = useState(false) //홀짝 베팅 팝업
  const [myMarble, setMyMarble] = useState({
    rMarble: 0,
    yMarble: 0,
    bMarble: 0,
    pMarble: 0
  }) // 보유한 구슬
  const [bettingVal, setBettingVal] = useState({
    rBetting: 0,
    yBetting: 0,
    bBetting: 0,
    pBetting: 0
  }) // 베팅할 구슬
  const [successVal, setSuccessVal] = useState({
    rSuccess: 0,
    ySuccess: 0,
    bSuccess: 0,
    pSuccess: 0
  }) // 베팅할 구슬
  const [participantList, setParticipantList] = useState([]) // 베팅 참여자
  const [myBettingLogList, setMyBettingLogList] = useState([]) // 베팅 참여자
  const [bettingAbled, setBettingAbled] = useState('y') // 베팅 참여자

  const rMarbleRef = useRef()
  const yMarbleRef = useRef()
  const bMarbleRef = useRef()
  const pMarbleRef = useRef()

  const successMarbleRef = useRef([])

  const history = useHistory()

  const fetchGganbuData = async () => {
    const {data, message} = await Api.gganbuInfoSel({gganbuNo: 1})
    if (message === 'SUCCESS') {
      setMyMarble({
        rMarble: data.red_marble,
        yMarble: data.yellow_marble,
        bMarble: data.blue_marble,
        pMarble: data.violet_marble
      })
      setSuccessVal({
        rSuccess: data.red_marble,
        ySuccess: data.yellow_marble,
        bSuccess: data.blue_marble,
        pSuccess: data.violet_marble
      })
    }
  }
  const fetchBettingPage = async () => {
    const {data, message} = await Api.getGganbuMarbleBettingPage({gganbuNo: 1})
    if (message === 'SUCCESS') {
      setParticipantList(data.bettingListInfo.list)
      setMyBettingLogList(data.myBettingListInfo.list)
      setBettingAbled(data.bettingYn)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const dateFormatterMMDD = (date) => {
    if (!date) return null
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    return `${month}월 ${day}일`
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // /2021-12-07T01:54:47.000+0000
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    let time = `${date.substring(11, 13)}:${date.substring(14, 16)}`
    return `${month}월 ${day}일 ${time}`
  }

  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    autoplay: {
      delay: 2500
    }
  }

  const marbleOnchange = (inputRef, marbleColor) => {
    const targetVal = Number(inputRef.current.value)
    const toast1 = '구슬 개수를 확인해주세요'
    const toast2 = '베팅 가능한 최대 개수는 10개입니다'
    const rMyMarble = myMarble.rMarble
    const yMyMarble = myMarble.yMarble
    const bMyMarble = myMarble.bMarble
    const pMyMarble = myMarble.pMarble
    const rMarbleInputVal = Number(rMarbleRef.current.value)
    const yMarbleInputVal = Number(yMarbleRef.current.value)
    const bMarbleInputVal = Number(bMarbleRef.current.value)
    const pMarbleInputVal = Number(pMarbleRef.current.value)
    let comparisonMarble

    if ((marbleColor = 'r')) {
      comparisonMarble = rMyMarble
    } else if ((marbleColor = 'y')) {
      comparisonMarble = yMyMarble
    } else if ((marbleColor = 'b')) {
      comparisonMarble = bMyMarble
    } else if ((marbleColor = 'p')) {
      comparisonMarble = pMyMarble
    }

    if (typeof targetVal === 'number') {
      if (targetVal <= 0) {
        inputRef.current.value = ''
      }
      if (targetVal > 10) {
        inputRef.current.value = ''
        globalCtx.action.toast({msg: toast2})
      }
      if (targetVal > comparisonMarble) {
        inputRef.current.value = ''
        globalCtx.action.toast({msg: toast1})
      }
      if (rMarbleInputVal + yMarbleInputVal + bMarbleInputVal + pMarbleInputVal > 10) {
        inputRef.current.value = ''
        globalCtx.action.toast({msg: toast2})
      }
    }

    setSuccessVal({
      rSuccess: rMyMarble + rMarbleInputVal,
      ySuccess: yMyMarble + yMarbleInputVal,
      bSuccess: bMyMarble + bMarbleInputVal,
      pSuccess: pMyMarble + pMarbleInputVal
    })
  }

  const marbleOnfocus = (inputRef) => {
    console.log('focusIn')
    let val = Number(inputRef.current.value)
    if (val === 0) {
      inputRef.current.value = ''
    }
  }
  const marbleOnfocusout = () => {
    const rMyMarble = myMarble.rMarble
    const yMyMarble = myMarble.yMarble
    const bMyMarble = myMarble.bMarble
    const pMyMarble = myMarble.pMarble
    const rMarbleInputVal = Number(rMarbleRef.current.value)
    const yMarbleInputVal = Number(yMarbleRef.current.value)
    const bMarbleInputVal = Number(bMarbleRef.current.value)
    const pMarbleInputVal = Number(pMarbleRef.current.value)
    if (rMarbleRef.current.value === '') {
      rMarbleRef.current.value = 0
    }
    if (yMarbleRef.current.value === '') {
      yMarbleRef.current.value = 0
    }
    if (bMarbleRef.current.value === '') {
      bMarbleRef.current.value = 0
    }
    if (pMarbleRef.current.value === '') {
      pMarbleRef.current.value = 0
    }
    setBettingVal({
      rBetting: Number(rMarbleRef.current.value),
      yBetting: Number(yMarbleRef.current.value),
      bBetting: Number(bMarbleRef.current.value),
      pBetting: Number(pMarbleRef.current.value)
    })

    setSuccessVal({
      rSuccess: rMyMarble + rMarbleInputVal,
      ySuccess: yMyMarble + yMarbleInputVal,
      bSuccess: bMyMarble + bMarbleInputVal,
      pSuccess: pMyMarble + pMarbleInputVal
    })
  }

  const bettingStart = () => {
    if (bettingAbled === 'y') {
      setBettingPop(true)
    } else {
      globalCtx.action.toast({msg: `베팅 가능한 횟수는 하루에 두 번 입니다.`})
    }
  }

  const completePopup = () => {
    setBettingPop(false)
    setBettingVal({
      rBetting: 0,
      yBetting: 0,
      bBetting: 0,
      pBetting: 0
    })
    rMarbleRef.current.value = 0
    yMarbleRef.current.value = 0
    bMarbleRef.current.value = 0
    pMarbleRef.current.value = 0

    fetchGganbuData()
  }

  const btnAbled = () => {
    const btnEle = document.getElementById('bettingBtn')

    if (bettingVal.rBetting !== 0 || bettingVal.yBetting !== 0 || bettingVal.bBetting !== 0 || bettingVal.pBetting !== 0) {
      btnEle.classList.remove('disable')
    } else {
      btnEle.classList.add('disable')
    }
  }

  useEffect(() => {
    fetchGganbuData()
    fetchBettingPage()
  }, [])

  useEffect(() => {
    btnAbled()
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
            {participantList.length > 0 ? (
              <Swiper {...swiperParams}>
                {participantList.map((item, index) => {
                  const {ins_date, mem_nick, win_slct} = item
                  return (
                    <div className="participantList" key={index}>
                      <p className="time">{dateFormatterMMDD(ins_date)}</p>
                      <p className="user">{mem_nick}</p>
                      <p className={`result ${win_slct === 'w' ? 'success' : 'fail'}`}>{win_slct === 'w' ? '성공' : '실패'}</p>
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
                  <input
                    type="number"
                    ref={rMarbleRef}
                    name="marbleBettingCount"
                    className="bettingCount"
                    defaultValue="0"
                    onChange={() => marbleOnchange(rMarbleRef, 'r')}
                    onFocus={() => marbleOnfocus(rMarbleRef)}
                    onBlur={() => marbleOnfocusout()}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <input
                    type="number"
                    ref={yMarbleRef}
                    name="marbleBettingCount"
                    className="bettingCount"
                    defaultValue="0"
                    onChange={() => marbleOnchange(yMarbleRef, 'y')}
                    onFocus={() => marbleOnfocus(yMarbleRef)}
                    onBlur={() => marbleOnfocusout()}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <input
                    type="number"
                    ref={bMarbleRef}
                    name="marbleBettingCount"
                    className="bettingCount"
                    defaultValue="0"
                    onChange={() => marbleOnchange(bMarbleRef, 'b')}
                    onFocus={() => marbleOnfocus(bMarbleRef)}
                    onBlur={() => marbleOnfocusout()}
                  />
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <input
                    type="number"
                    ref={pMarbleRef}
                    name="marbleBettingCount"
                    className="bettingCount"
                    defaultValue="0"
                    onChange={() => marbleOnchange(pMarbleRef, 'p')}
                    onFocus={() => marbleOnfocus(pMarbleRef)}
                    onBlur={() => marbleOnfocusout()}
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
                  <span className="marbleCount">{successVal.rSuccess}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                  <span className="marbleCount">{successVal.ySuccess}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                  <span className="marbleCount">{successVal.bSuccess}</span>
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                  <span className="marbleCount">{successVal.pSuccess}</span>
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
            {myBettingLogList.length > 0 ? (
              myBettingLogList.map((item, index) => {
                const {red_marble, yellow_marble, blue_marble, violet_marble, win_slct, mem_nick, ins_date} = item
                return (
                  <div className="logList" key={index}>
                    <div className="logMarble">
                      <div className="marbleData">
                        <span className="marbleIcon red"></span>
                        <span className="marbleCount">{red_marble}</span>
                      </div>
                      <div className="marbleData">
                        <span className="marbleIcon yellow"></span>
                        <span className="marbleCount">{yellow_marble}</span>
                      </div>
                      <div className="marbleData">
                        <span className="marbleIcon blue"></span>
                        <span className="marbleCount">{blue_marble}</span>
                      </div>
                      <div className="marbleData">
                        <span className="marbleIcon purple"></span>
                        <span className="marbleCount">{violet_marble}</span>
                      </div>
                    </div>
                    <div className="logResult">
                      <p className={`${win_slct === 'w' ? 'success' : 'fail'}`}>{win_slct === 'w' ? '성공' : '실패'}</p>
                    </div>
                    <div className="logData">
                      <div className="logUser">{mem_nick}</div>
                      <div className="logTime">{dateFormatter(ins_date)}</div>
                    </div>
                  </div>
                )
              })
            ) : (
              <NoResult type="default" text="아직 베팅 내역이 없습니다." />
            )}
          </div>
        </div>
      </div>
      {bettingPop && (
        <BettingPop
          setBettingPop={setBettingPop}
          bettingVal={bettingVal}
          setBettingVal={setBettingVal}
          myMarble={myMarble}
          setMyMarble={setMyMarble}
          setParticipantList={setParticipantList}
          setMyBettingLogList={setMyBettingLogList}
          setBettingAbled={setBettingAbled}
          completePopup={completePopup}
        />
      )}
    </div>
  )
}
