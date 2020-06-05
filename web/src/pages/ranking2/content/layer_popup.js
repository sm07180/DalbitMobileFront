import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../static/ic_close.svg'
import {COLOR_MAIN} from 'context/color'



export default (props) => {
  const {setPopup} = props

  const [tabButton, settabButton] = useState(1);

  const typePop = props.dateType
  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup(false)
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'rank-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const applyClick = () => {
    setPopup(false)
  }

  return (
    <PopupWrap id="rank-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">일간 랭킹 산정 방식</div>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>

        <div className="tab-button-box">
         <a href="#" onClick={() => settabButton(1)} 
         className={tabButton === 1 && 'active'}>오늘<i></i></a>
         <a href="#" onClick={() => settabButton(2)} 
         className={tabButton === 2 && 'active'}>일간<i></i></a>
         <a href="#" onClick={() => settabButton(3)} 
         className={tabButton === 3 && 'active'}>주간<i></i></a>                  
        </div>

        <div className="popup_margin">
          <h5>DJ</h5>
          <p>

          {tabButton === 1 && (
            <strong>
            오늘 받은 별(30%) + 오늘 받은 좋아요(20%)<br/>
            오늘 누적 청취자(20%) + 오늘 방송시간(30%)
          </strong>
          )}
          {tabButton === 2 && (
            <strong>
            전일 받은 별(30%) + 전일 받은 좋아요(20%)<br/>
            전일 누적 청취자(20%) + 전일 방송시간(30%)
          </strong>
          )}
          {tabButton === 3 && (
            <strong>
            지난 주 받은 별(30%) + 지난 주 받은 좋아요(20%) <br/>
            지난 주 누적 청취자(20%) + 지난 주 방송시간(30%)
          </strong>
          )}                    


            <br />
          </p>
          <h5>FAN</h5>
          <p>
          {tabButton === 1 && (
          <strong>보낸 달(60%) + 청취시간(40%)</strong>
          )}
          {tabButton === 2 && (
          <strong>전일 보낸 달(60%) + 전일 청취시간(40%)</strong>
          )}
          {tabButton === 3 && (
          <strong>지난 주 보낸 달(60%) + 지난 주  청취시간(40%) </strong>
          )}                    


            <br />
          </p>
          <br />
          <div className="text_box">
          {tabButton === 1 && (
            <p>오늘의 랭킹은 종료된 방송방 기준 
            매일 00:00부터 23:59:59까지의 데이터로 집계되며 
            매일 정시마다 오늘의 랭킹이 갱신됩니다.<br/><br/>
            
            ※부스터로 상승한 좋아요는 집계에서 제외됩니다
            </p>
          )}
          {tabButton === 2 && (
            <p>
            일간 랭킹은 종료된 방송방 기준 
            매일 00:00부터 23:59:59까지의 데이터로 집계되며 
            매일 00:00에 일간 랭킹이 갱신됩니다.<br/><br/>

            ※부스터로 상승한 좋아요는 집계에서 제외됩니다.
            </p>
          )}
          {tabButton === 3 && (
            <p>주간 랭킹은 종료된 방송방 기준 
            매주 월요일부터 일요일까지의 
            데이터로 집계되며 매주 월요일 05:00에
            지난주 랭킹이 갱신됩니다.<br/><br/>
            
            ※부스터로 상승한 좋아요는 집계에서 제외됩니다.
            </p>
          )}
          </div>
      </div>
      </div>
    </PopupWrap>
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

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 328px;
    border-radius: 12px;
    background-color: #fff;

    strong{font-size:13px;
    letter-spacing:-0.5;}
    
    h5 {
      margin: 16px 0 12px 0;
      color: ${COLOR_MAIN};
      font-size: 16px;
      font-weight: 900;
      text-align: center;
    }

    p {
      color: #000;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }

    .title-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 44px;

      .text {
        width: 100%;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
      }

      .close-btn {
        position: absolute;
        top: 2px;
        right: 0;
        left: inherit;
      }
    }

    .btn-wrap {
      margin-top: 20px;

      .apply-btn {
        display: block;
        width: 100%;
        border-radius: 12px;
        background-color: #632beb;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        padding: 12px 0;
      }
    }
  }

.text_box{
  p{
    color:#757575;
  line-height:22px;
  }
}

  .popup_margin{padding:0px 20px;
  padding-bottom:30px;
  box-sizing:border-box;}
  

  .tab-button-box{
    display:flex;
    align-content:center;
    justify-content:center;
    background:#f5f5f5;
    height:36px;

    a{
      height:36px;
      line-height:36px;
      font-size:14px;
      color:#000;
      margin:0px 8px;
      position:relative;
      font-weight:900;

      &.active{
        color:#632beb;
        

        ::before{
          position:absolute;
          width:100%;
          height:1px;
          background:#632beb;
          bottom:0px;
        }
      }
    }
  }
`
