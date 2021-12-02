import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'

import {IMG_SERVER} from 'context/config'

export default (props) => {
  const {setBettingPop} = props
  const [popResult, setPopResult] = useState(false)
  const [valueType, setValueType] = useState("")
  const [typeSelect, setTypeSelect] = useState("")
  const [bettingResult, setBettingResult] = useState("")
  const [beadNum, setBeadNum] = useState(0);


  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setBettingPop(false)
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'bettingPop') {
      closePopup()
    }
  }

  const selectVal = (e) => {
    const selectValue = document.querySelector('input[name="bettingType"]:checked').value;
    setValueType(selectValue);
  }

  const betting = () => {
    const selectValue = document.querySelector('input[name="bettingType"]:checked').value;
    const beadLength = Math.floor(Math.random() * 4) + 1;
    let resultType = "";
    
    setBeadNum(beadLength);

    if(beadLength === 1 || beadLength === 3){
      resultType = "odd";
    } else {
      resultType = "even";
    }

    if(selectValue === "odd") {
      setTypeSelect("홀수");
    } else {
      setTypeSelect("짝수");
    }

    if(selectValue === resultType) {
      setBettingResult("success");
    } else {
      setBettingResult("fail");
    }
    setPopResult(true);
  }

  return (
    <PopupWrap id="bettingPop" onClick={wrapClick}>
      <div className="contentWrap">
        <div className="title">홀짝 게임</div>
        <div className="content">
          <div className="bettingMyInfo">                  
            {popResult &&
              <div className="bettingType"> 
                  <div className="bettingTitle">나의 베팅</div>
                  <div className="bettingMy">{typeSelect}</div>
              </div>
            }
            <div className="bettingBead">
              <div className="bettingTitle">{popResult ? "구슬 현황" : "내가 베팅한 구슬"}</div>
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
          </div>
          <div className="bettingAni">           
            {popResult ?
              <div id="bettingAni">                
                <Lottie
                  options={{
                    loop: false,
                    autoPlay: true,
                    path: `${IMG_SERVER}/event/gganbu/ani/odd_even_game_0${beadNum}.json`
                  }}
                />
                {bettingResult === "success" ? 
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
            <label className={`selectMenu ${valueType === "odd" ? "active" : ""}`} onClick={selectVal}>
              <input type="radio" name="bettingType" value="odd" className="bettingSelect" />
              <div className="selectRow">
                <span className="selectType">홀수</span>
                <span className="selectRadio"></span>
              </div>   
              <div className="selectRow">
                <span className="participantIcon"></span>
                <span className="participantTitle">총 투표자</span>
                <span className="participantTotal">23</span>
                <span className="participantUnit">명</span>
              </div> 
              <div className="selectRow">
                <span className="percentIcon"></span>
                <span className="percentTitle">이긴확률</span>
                <span className="percentTotal">53</span>
                <span className="percentUnit">%</span>
              </div>
            </label>
            <label className={`selectMenu ${valueType === "even" ? "active" : ""}`} onClick={selectVal}>
              <input type="radio" name="bettingType" value="even" className="bettingSelect"/>
              <div className="selectRow">
                <span className="selectType">짝수</span>
                <span className="selectRadio"></span>
              </div>   
              <div className="selectRow">
                <span className="participantIcon"></span>
                <span className="participantTitle">총 투표자</span>
                <span className="participantTotal">23</span>
                <span className="participantUnit">명</span>
              </div> 
              <div className="selectRow">
                <span className="percentIcon"></span>
                <span className="percentTitle">이긴확률</span>
                <span className="percentTotal">53</span>
                <span className="percentUnit">%</span>
              </div>
            </label>
          </div>
          }          
        </div>
        <div className="bottom">        
            {popResult ?
              <button className="bettingBtn active" onClick={closePopup}>확인</button>
              :
              <button className={`bettingBtn ${valueType === "" ? "" : "active"}`} onClick={betting}>예측하기</button>
            }
        </div>
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/gganbu/bettingPop_btn-close.png" alt="닫기" />
        </button>
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
          background-color: #632BEB;
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
        margin-bottom: 6px;
        border-top: 1px solid #E0E0E0;
        border-radius: 0 0 10px 10px;
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
            color: #632BEB;
          }
        }
        .bettingBead {
          display: flex;
          align-items: center;
          justify-content: center;

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
          &.active {border: 1px solid #632BEB;}
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
              border: 5px solid #632BEB;
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
              color: #632BEB;
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
      .sectionBead {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .beadData {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }
      }
      .beadIcon {
        display: inline-block;
        width: 12px; height: 12px;
        margin-right: 4px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        &.red {
          background-image: url(https://image.dalbitlive.com/event/gganbu/bead-red.png);
        }
        &.yellow {
          background-image: url(https://image.dalbitlive.com/event/gganbu/bead-yellow.png);
        }
        &.blue {
          background-image: url(https://image.dalbitlive.com/event/gganbu/bead-blue.png);
        }
        &.purple {
          background-image: url(https://image.dalbitlive.com/event/gganbu/bead-purple.png);
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
`
