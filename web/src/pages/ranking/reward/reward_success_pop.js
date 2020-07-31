import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

import styled from 'styled-components'
import CloseBtn from '../static/ic_close.svg'

import RandomBoxPop from './reward_randombox_pop'

export default (props) => {
  const {setPopup, rewardPop} = props
  const [randomPopup, setRandomPopup] = useState(false)

  const closePopup = () => {
    setPopup(false)
  }

  const openRandomPopup = () => {
    setRandomPopup(true)
  }

  const popStateEvent = (e) => {
    if (e.state === null) {
      setRandomPopup(false)
    } else if (e.state === 'layer') {
      setRandomPopup(true)
    }
  }

  useEffect(() => {
    if (randomPopup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/rank/#layer')
      }
    } else if (!randomPopup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [randomPopup])

  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)

    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  return (
    <PopupWrap>
      <div className="content-wrap">
        <button onClick={() => closePopup()} className="btn-close">
          <img src={CloseBtn} />
        </button>
        <div className="title-box">
          <p className="title">{rewardPop.text}가 되셨습니다.</p>
          <p className="sub-title">축하합니다</p>
        </div>

        <div className="reward-content">
          <p className="title">{rewardPop.text} 보상</p>

          <div>
            <div className="top-badge-box">
              <span className="top-badge-title">TOP 뱃지</span>{' '}
              <label
                className="badge-label right"
                style={{
                  background: `linear-gradient(to right, ${rewardPop.startColor}, ${rewardPop.endColor}`
                }}>
                <img src={rewardPop.icon} width={42} height={26} />
                <span>{rewardPop.text}</span>
              </label>
            </div>
            <div className="bottom-badge-box">
              <label className="badge-label">
                {' '}
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 {rewardPop.rewardDal}
              </label>{' '}
              <label className="badge-label right">경험치 랜덤 박스</label>
            </div>
          </div>
        </div>
        <button onClick={() => openRandomPopup()} className="btn-random-box">
          경험치 랜덤 박스 열기
        </button>

        <ul className="notice-box">
          <li>* 뱃지는 마이페이지, 프로필, 방송 채팅창에 표현됩니다. </li>
          <li>* 경험치 랜덤 박스 보상은 차주 랭킹이 업데이트 되기전 까지 받아야합니다.</li>
        </ul>
      </div>
      {randomPopup && <RandomBoxPop setRandomPopup={setRandomPopup} setPopup={setPopup} rewardPop={rewardPop} />}
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
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 50px 16px;
    border-radius: 16px;
    background-color: #fff;

    .btn-close {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .title-box {
      margin-bottom: 20px;
      text-align: center;
      font-weight: 700;

      .title {
        font-size: 14px;
        line-height: 22px;
      }

      .sub-title {
        font-size: 24px;
        line-height: 27px;
      }
    }

    .reward-content {
      position: relative;
      margin-bottom: 25px;
      padding: 18px 25px 12px 25px;
      border-radius: 20px;
      border: 1px solid #632beb;

      .title {
        display: inline-block;
        position: absolute;
        width: fit-content;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 11px;
        color: #632beb;
        text-align: center;
        font-size: 14px;
        background-color: #fff;
      }

      .top-badge-box {
        display: flex;
        justify-content: space-between;
        padding: 3px;
        height: 34px;
        border-radius: 20px;
        border: 1px dotted #e8e8e8;

        .top-badge-title {
          width: 38%;
          font-size: 12px;
          line-height: 28px;
          letter-spacing: -0.3px;
          color: #424242;
          text-align: center;
        }

        .badge-label {
          display: inline-block;
          width: 60%;
          border-radius: 18px;
          color: #fff;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 26px;
          text-align: center;
          font-weight: 700;
        }
      }

      .bottom-badge-box {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;

        .badge-label {
          display: inline-block;
          width: 38%;
          height: 34px;
          border-radius: 18px;
          background-color: #efefef;
          color: #424242;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 34px;
          text-align: center;
          font-weight: 700;

          &.right {
            width: 60%;
          }
        }
      }
    }

    .btn-random-box {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      background-color: #632beb;
      letter-spacing: -0.4px;
      color: #ffffff;
      font-weight: 700;
    }

    .notice-box {
      margin-top: 12px;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: -0.18px;
      color: #757575;
    }
  }
`
