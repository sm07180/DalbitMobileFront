import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import Utility from 'components/lib/utility'

import Api from 'context/api'
import moment from "moment";

export default (props) => {
  const {setRewardPop, getMarble, content, androidClosePopup} = props

  const [gganbuEnd, setGganbuEnd] = useState(false);
  const [today, setToday] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  async function gganbuDate() {
    const {data, message} = await Api.gganbuEventDate();
    if (message === "SUCCESS") {
      let todayIs = new Date;
      setToday(moment(todayIs).format("YYYY-MM-DD"));
      setEventEnd(moment(data.endDate).format("YYYY-MM-DD"));
    }
  }

  // reference
  const gganbuGetMarble = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closeReward = () => {
    setRewardPop(false)

    if(typeof androidClosePopup === 'function') {
        androidClosePopup();
    }
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
    closeReward()
    }
  }

  useEffect(() => {
    gganbuDate();
    if(moment(today).isAfter(eventEnd)) {
      setGganbuEnd(true);
    } else {
      setGganbuEnd(false);
    }
  }, [today]);

  return (
      <>
        {!gganbuEnd && 
            <PopupWrap id="main-layer-popup" ref={gganbuGetMarble} onClick={wrapClick}>
                <div className="contentWrap">
                <h1 className="title">깐부게임 보상</h1>
                <div className="content">
                    <div className="reward">
                        <div className="rewardTitle">구슬지급</div>
                        <div className="rewardContent">
                            {content &&
                                content.split('\n').map((data, index) => {
                                    return <span key={index}>{data}<br/></span>
                                })
                            }
                        </div>
                        <div className="rewardWrap">
                            <div className="rewardItem">
                                <span className={`marble red`}></span>
                                <span className="itemCtn">{getMarble.rmarbleCnt}</span>
                            </div>
                            <div className="rewardItem">
                                <span className={`marble yellow`}></span>
                                <span className="itemCtn">{getMarble.ymarbleCnt}</span>
                            </div>
                            <div className="rewardItem">
                                <span className={`marble blue`}></span>
                                <span className="itemCtn">{getMarble.bmarbleCnt}</span>
                            </div>
                            <div className="rewardItem">
                                <span className={`marble purple`}></span>
                                <span className="itemCtn">{getMarble.vmarbleCnt}</span>
                            </div>
                        </div>
                    </div>            
                    <div className="btnWrap">
                        <button className="btn" onClick={() => closeReward()}>확인</button>
                    </div>
                </div>
                </div>
            </PopupWrap>
        }
    </>
    
    )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .contentWrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 390px;
    padding: 0;
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
    .title {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      letter-spacing: -1px;
      color: #000000;
      box-sizing: border-box;
    }
    .content {
        width: 100%;
        min-height: auto;
        padding: 30px 16px 16px;
        box-sizing: border-box;
        .reward {
            display:flex;
            align-items:center;
            justify-content: center;
            flex-direction: column;
            margin-bottom: 30px;
            .rewardTitle {                
                font-size: 16px;
                font-weight: 700;
                color: #FF3C7B;
                margin-bottom: 3px;
            }
            .rewardContent {                
                font-size: 16px;
                font-weight: 400;
                color: #000000;
                text-align: center;
                margin-bottom: 6px;
            }
            .rewardWrap {
                display:flex;
                align-items:center;
                justify-content: center;
                .rewardItem {
                    display:flex;
                    align-items:center;
                    margin: 0px 8px;
                    .marble {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 8px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: contain;
                        &.red {
                          background-image: url(https://image.dallalive.com/event/gganbu/marble-red.png);
                        }
                        &.yellow {
                          background-image: url(https://image.dallalive.com/event/gganbu/marble-yellow.png);
                        }
                        &.blue {
                          background-image: url(https://image.dallalive.com/event/gganbu/marble-blue.png);
                        }
                        &.purple {
                          background-image: url(https://image.dallalive.com/event/gganbu/marble-purple.png);
                        }
                    }
                    .pocket {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        margin-right: 8px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: contain;                        
                        background-image: url(https://image.dallalive.com/event/gganbu/pocketIcon.png);
                    }
                    .itemCtn {       
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                    }
                }
            }
        }
    }
    .btnWrap {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 0px;
        .btn {
            width: 100%;
            height: 44px;
            font-size: 18px;
            border-radius: 12px;
            color: #fff;
            font-weight: 500;
            text-align: center;
            background-color: #FF3C7B;
        }
    }
  }
  
`
