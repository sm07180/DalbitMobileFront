import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'
import Api from 'context/api'

import {IMG_SERVER} from 'context/config'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {
    setBettingPop,
    bettingVal,
    setBettingVal,
    setBettingAbled,
    myMarble,
    setMyMarble,
    setParticipantList,
    setMyBettingLogList,
    completePopup,
    gganbuNo,
    setSuccessVal
  } = props
  const [popResult, setPopResult] = useState(false)
  const [valueType, setValueType] = useState("")
  const [typeSelect, setTypeSelect] = useState("")
  const [marbleNum, setMarbleNum] = useState(0);
  const [resultVal, setResultVal] = useState({
    rResult: "",
    yResult: "",
    bResult: "",
    pResult: "",
  });
  const [participant, setParticipant] = useState({
    oddParticipant : "",
    evenParticipant : "",
  });
  const [winPercent, setWinPercent] = useState({
    oddWinPercent : "",
    evenWinPercent : "",
  });
  const [gapVal, setGapVal] = useState({
    rGap : "",
    yGap : "",
    bGap : "",
    pGap : "",
  });

  const [winOrLose, setWinOrLose] = useState('');

  const fetchGganbuData = async () => {
    const {data, message} = await Api.gganbuInfoSel({gganbuNo: gganbuNo})
    if (message === 'SUCCESS') {
      setMyMarble({
        rMarble: data.red_marble,
        yMarble: data.yellow_marble,
        bMarble: data.blue_marble,
        pMarble: data.violet_marble,
      })
    }
  }

  const fetchBettingPage = async () => {
    const {data, message} = await Api.getGganbuMarbleBettingPage({gganbuNo: gganbuNo});
    if (message === 'SUCCESS') {
      setParticipantList(data.bettingListInfo.list);
      setMyBettingLogList(data.myBettingListInfo.list);
      setBettingVal({rBetting: 0, yBetting: 0, bBetting: 0, pBetting: 0})
      setBettingAbled(data.bettingYn);
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
    }
  }

  const fetchBettingData = async () => {
    const {data, message} = await Api.getGganbuBettingData({gganbuNo: gganbuNo});

    if (message === 'SUCCESS') {
      setParticipant({
        oddParticipant : data.s_aBettingCnt,
        evenParticipant : data.s_bBettingCnt,
      })
      setWinPercent({
        oddWinPercent : data.oddWinProbability,
        evenWinPercent : data.evenWinProbability,
      })
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: "베팅을 할 수 없습니다."}))
      setBettingPop(false)
    }
  }

  async function fetchBettingComplete() {
    const param = {
      insSlct: "b",
      rMarbleCnt: gapVal.rGap < 0 ? gapVal.rGap * -1 : gapVal.rGap,
      yMarbleCnt: gapVal.yGap < 0 ? gapVal.yGap * -1 : gapVal.yGap,
      bMarbleCnt: gapVal.bGap < 0 ? gapVal.bGap * -1 : gapVal.bGap,
      vMarbleCnt: gapVal.pGap < 0 ? gapVal.pGap * -1 : gapVal.pGap,
      winSlct: winOrLose,
      bettingSlct: valueType,
    }
    const res = await Api.getGganbuObtainMarble(param);
    if (res.s_return === 1) {
    } else if (res.s_return === -4) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: "베팅할 구슬이 부족합니다."}))
      setBettingPop(false)
    } else if (res.s_return === -3) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: "이미 지급되었습니다."}))
      setBettingPop(false)
    } else if (res.s_return === -2) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: "깐부가 없습니다."}))
      setBettingPop(false)
    } else if (res.s_return === -1) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: "이벤트 기간이 아닙니다."}))
      setBettingPop(false)
    }
  }

  const closePopup = () => {
    setBettingPop(false)
  }

  // const wrapClick = (e) => {
  //   const target = e.target
  //   if (target.id === 'bettingPop') {
  //     closePopup()
  //   }
  // }

  const selectVal = (e) => {
    const selectValue = document.querySelector('input[name="bettingType"]:checked').value;
    setValueType(selectValue);
  }

  const betting = () => {
    const selectValue = document.querySelector('input[name="bettingType"]:checked').value;
    const marbleLength = Math.floor(Math.random() * 4) + 1;
    let resultType = "";

    setMarbleNum(marbleLength);
    setPopResult(true);

    if(marbleLength === 1 || marbleLength === 3){
      resultType = "a";
    } else {
      resultType = "b";
    }

    if(selectValue === "a") {
      setTypeSelect("홀수");
    } else {
      setTypeSelect("짝수");
    }

    if(selectValue === resultType) {
      setWinOrLose('w');
      resultVal.rResult = myMarble.rMarble + bettingVal.rBetting;
      resultVal.yResult = myMarble.yMarble + bettingVal.yBetting;
      resultVal.bResult = myMarble.bMarble + bettingVal.bBetting;
      resultVal.pResult = myMarble.pMarble + bettingVal.pBetting;
      setMyMarble({
        rMarble: resultVal.rResult,
        yMarble: resultVal.yResult,
        bMarble: resultVal.bResult,
        pMarble: resultVal.pResult,
      })
    } else {
      setWinOrLose('l');
      resultVal.rResult = myMarble.rMarble - bettingVal.rBetting;
      resultVal.yResult = myMarble.yMarble - bettingVal.yBetting;
      resultVal.bResult = myMarble.bMarble - bettingVal.bBetting;
      resultVal.pResult = myMarble.pMarble - bettingVal.pBetting;
      setMyMarble({
        rMarble: resultVal.rResult,
        yMarble: resultVal.yResult,
        bMarble: resultVal.bResult,
        pMarble: resultVal.pResult,
      })
    }

    gapVal.rGap = resultVal.rResult - myMarble.rMarble;
    gapVal.yGap = resultVal.yResult - myMarble.yMarble;
    gapVal.bGap = resultVal.bResult - myMarble.bMarble;
    gapVal.pGap = resultVal.pResult - myMarble.pMarble;
  }

  useEffect(() => {
    if(winOrLose !== '') {
      fetchBettingComplete();
    }
  }, [winOrLose]);

  useEffect(() => {
    fetchBettingData();
  }, [])


  return (
    <PopupWrap id="bettingPop">
      <div className="contentWrap">
        <div className="title">홀짝 게임</div>
        <div className="content">
          <div className="bettingAni">
            {popResult ?
              <div id="bettingAni">
                <Lottie
                  options={{
                    loop: false,
                    autoPlay: true,
                    path: `${IMG_SERVER}/event/gganbu/ani/odd_even_game_0${marbleNum}.json`
                  }}
                />
                {winOrLose === "w" ?
                  <div className="resultToast">
                    이겼다!
                  </div>
                  :
                  <div className="resultToast">
                    그만해~<br/>
                    이러다가 다 잃어!
                  </div>
                }
              </div>
              :
              <img src="https://image.dalbitlive.com/event/gganbu/betting_ani.png" alt="베팅 준비중" />
            }
          </div>
          {!popResult &&
            <div className="bettingInfo">
            <label className={`selectMenu ${valueType === "a" ? "active" : ""}`} onClick={selectVal}>
              <input type="radio" name="bettingType" value="a" className="bettingSelect"/>
              <div className="selectRow">
                <span className="selectType">홀수</span>
                <span className="selectRadio"></span>
              </div>
              <div className="selectRow">
                <span className="participantIcon"></span>
                <span className="participantTitle">총 투표자</span>
                <span className="participantTotal">{participant.oddParticipant}</span>
                <span className="participantUnit">명</span>
              </div>
              <div className="selectRow">
                <span className="percentIcon"></span>
                <span className="percentTitle">이긴확률</span>
                <span className="percentTotal">{winPercent.oddWinPercent}</span>
                <span className="percentUnit">%</span>
              </div>
            </label>
            <label className={`selectMenu ${valueType === "b" ? "active" : ""}`} onClick={selectVal}>
              <input type="radio" name="bettingType" value="b" className="bettingSelect"/>
              <div className="selectRow">
                <span className="selectType">짝수</span>
                <span className="selectRadio"></span>
              </div>
              <div className="selectRow">
                <span className="participantIcon"></span>
                <span className="participantTitle">총 투표자</span>
                <span className="participantTotal">{participant.evenParticipant}</span>
                <span className="participantUnit">명</span>
              </div>
              <div className="selectRow">
                <span className="percentIcon"></span>
                <span className="percentTitle">이긴확률</span>
                <span className="percentTotal">{winPercent.evenWinPercent}</span>
                <span className="percentUnit">%</span>
              </div>
            </label>
            </div>
          }
          <div className="bettingMyInfo">
            {popResult &&
            <div className="bettingType">
              <div className="bettingTitle">나의 베팅</div>
              <div className="bettingMy">{typeSelect}</div>
            </div>
            }
            <div className={`bettingMarble ${popResult ? "result" : ""}`}>
              <div className="bettingTitle">{popResult ? "구슬 현황" : "내가 베팅한 구슬"}</div>
              <div className="sectionMarble">
                <div className="marbleData">
                  <span className="marbleIcon red"></span>
                    {popResult ?
                      <span className="marbleCount">
                        {resultVal.rResult}
                        <span className={`marbleGap ${winOrLose === "w" ? "plus" : "minus"}`}>
                          {winOrLose === "w" ? `+${gapVal.rGap}` : `-${gapVal.rGap * -1}`}
                        </span>
                      </span>
                      :
                      <span className="marbleCount">{bettingVal.rBetting}</span>
                    }
                </div>
                <div className="marbleData">
                  <span className="marbleIcon yellow"></span>
                    {popResult ?
                      <span className="marbleCount">
                        {resultVal.yResult}
                        <span className={`marbleGap ${winOrLose === "w" ? "plus" : "minus"}`}>
                          {winOrLose === "w" ? `+${gapVal.yGap}` : `-${gapVal.yGap * -1}`}
                        </span>
                      </span>
                      :
                      <span className="marbleCount">{bettingVal.yBetting}</span>
                    }
                </div>
                <div className="marbleData">
                  <span className="marbleIcon blue"></span>
                    {popResult ?
                      <span className="marbleCount">
                        {resultVal.bResult}
                        <span className={`marbleGap ${winOrLose === "w" ? "plus" : "minus"}`}>
                          {winOrLose === "w" ? `+${gapVal.bGap}` : `-${gapVal.bGap * -1}`}
                        </span>
                      </span>
                      :
                      <span className="marbleCount">{bettingVal.bBetting}</span>
                    }
                </div>
                <div className="marbleData">
                  <span className="marbleIcon purple"></span>
                    {popResult ?
                      <span className="marbleCount">
                        {resultVal.pResult}
                        <span className={`marbleGap ${winOrLose === "w" ? "plus" : "minus"}`}>
                          {winOrLose === "w" ? `+${gapVal.pGap}` : `-${gapVal.pGap * -1}`}
                        </span>
                      </span>
                      :
                      <span className="marbleCount">{bettingVal.pBetting}</span>
                    }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          {popResult ?
            <button className="bettingBtn active" onClick={completePopup}>확인</button>
            :
            <button className={`bettingBtn ${valueType === "" ? "" : "active"}`} onClick={betting}>예측하기</button>
          }
        </div>
        {!popResult &&
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/gganbu/bettingPop_btn-close.png" alt="닫기"/>
        </button>
        }
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  &#bettingPop {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
    z-index: 60;

    .contentWrap {
      position: relative;
      width: calc(100% - 32px);
      max-width: 390px;
      padding: 16px;
      border-radius: 15px;
      background-color: #fff;
      .title {
        line-height: 52px;
        margin-top: -16px;
        font-size: 21px;
        font-weight: 900;
        text-align: center;
        border-bottom: 1px solid #E0E0E0;
        font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
        letter-space: -1px;
        color: #000000;
      }
      .content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 12px;
      }
      .bottom {
        display: flex;
        align-items: center;
        width: 100%;
      }
      .bettingBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%; height: 44px;
        border-radius: 12px;
        font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: #FFF;
        background-color: #BDBDBD;
        pointer-events : none;
        &.active {
          background-color: #FF3C7B;
          pointer-events : auto;
        }
      }
      .bettingMyInfo {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        padding: 15px;
        margin-top: 6px;
        border-radius: 10px;
        background-color: #F5F5F5;
        box-sizing: border-box;
        .bettingType {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          .bettingMy {
            font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: #FF3C7B;
          }
        }
        .bettingMarble {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%; height:24px;
          &.result {
            animation: resultMarble 3s linear forwards;
          }
        }
        .bettingTitle {
          font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          margin-right: 10px;
          letter-spacing: -1px;
        }
      }
      .bettingAni {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        pointer-events: none;
        #bettingAni {
          position: relative;
          width: 100%;
          .resultToast {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            padding: 15px;
            border-radius: 10px;
            font-size: 20px;
            font-weight: 700;
            color:#fff;
            text-align: center;
            background-color: rgba(0,0,0,0.7);
            animation: resultToast 3s linear forwards;
          }
        }
      }
      .bettingInfo {
        display: flex;
        align-items: center;
        width: 100%;

        .selectMenu {
          position: relative;
          width:50%;
          padding: 10px;
          border: 1px solid #E0E0E0;
          &:nth-child(1){border-radius:12px 0 0 12px;}
          &:nth-child(2){border-radius:0 12px 12px 0;}
          &.active {border: 1px solid #FF3C7B;}
          .bettingSelect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            outline: 0;
            border: 0;
            cursor: pointer;
            &:checked ~ .selectRow > .selectRadio {
              border: 5px solid #FF3C7B;
            }
            
          }
          .selectRow {
            display: flex;
            align-items: center;
            .selectType {
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 16px;
              font-weight: 500;
              color: #000000;
            }
            .selectRadio {
              display:inline-block;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 1px solid #BDBDBD;
              box-sizing: border-box;
              margin-left: auto;
            }
            .participantIcon {
              display: inline-block;
              width: 17px; height: 17px;
              margin-right: 4px;
              background-image: url(https://image.dalbitlive.com/event/gganbu/betting_icon-totalParticipant.png);
              background-position: center;
              background-repeat: no-repeat;
              background-size: contain;
            }
            .participantTitle {
              margin-right: 4px;
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 400;
              color: #424242;
            }
            .participantTotal {
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #424242;
            }
            .participantUnit {
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #424242;
            }
            .percentIcon {
              display: inline-block;
              width: 16px; height: 16px;
              margin-right: 4px;
              background-image: url(https://image.dalbitlive.com/event/gganbu/betting_icon-percentage.png);
              background-position: center;
              background-repeat: no-repeat;
              background-size: contain;              
            }
            .percentTitle {
              margin-right: 4px;
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #FF3C7B;
            }
            .percentTotal {
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #000000;
            }
            .percentUnit {
              font-family: 'Noto Sans CJK KR', 'NanumSquare', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #000000;
            }
          }
        }

      }
      .sectionMarble {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .marbleData {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }
      }
      .marbleIcon {
        display: inline-block;
        width: 12px; height: 12px;
        margin-right: 4px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        &.red {
          background-image: url(https://image.dalbitlive.com/event/gganbu/marble-red.png);
        }
        &.yellow {
          background-image: url(https://image.dalbitlive.com/event/gganbu/marble-yellow.png);
        }
        &.blue {
          background-image: url(https://image.dalbitlive.com/event/gganbu/marble-blue.png);
        }
        &.purple {
          background-image: url(https://image.dalbitlive.com/event/gganbu/marble-purple.png);
        }
      }
      .marbleCount {
        position: relative;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      .marbleGap {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        animation: gapValue 3s linear forwards;
        pointer-events: none;
        &.plus {
          color: #3F5BFF;
          text-shadow: 0px 0px 2px #fff;
        }
        &.minus {
          color: #E03463;
          text-shadow: 0px 0px 2px #fff;
        }
      }
      .close {
        position: absolute;
        top: -40px;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  @keyframes resultToast {
    0% {
      opacity: 0;
    }
    75% {
      opacity: 0;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes resultMarble {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes gapValue {
    0% {
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(1, 1);
      opacity: 0;
    }
    50% {
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(1, 1);
      opacity: 0;
    }
    70% {
      top: 200%; left: 50%;
      transform: translate(-50%, -50%) scale(1.2, 1.2);
      opacity: 1;
    }
    85% {
      top: 200%; left: 50%;
      transform: translate(-50%, -50%) scale(1.2, 1.2);
      opacity: 1;
    }
    100% {
      top: 200%; left: 50%;
      transform: translate(-50%, -50%) scale(1.5, 1.5);
      opacity: 0;
    }
  }
`
