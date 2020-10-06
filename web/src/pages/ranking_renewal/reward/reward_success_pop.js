import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

import {RankContext} from 'context/rank_ctx'

import {IMG_SERVER} from 'context/config'

//components
import RandomBoxPop from './reward_randombox_pop'

//static
import CloseBtn from '../static/ic_close.svg'

export default (props) => {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState, myInfo} = rankState

  const setMyInfo = rankAction.setMyInfo

  const {setPopup, rewardPop, setRewardPop} = props
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
          <p className="sub-title">
            <img src={`${IMG_SERVER}/ranking/reward_pop_character3@2x.png`} width={41} height={26} /> 축하합니다
          </p>
        </div>

        <div className="reward-content">
          <p className="title">{rewardPop.text} 보상</p>

          <div>
            <div className="top-badge-box">
              <span className="top-badge-title">TOP 배지</span>{' '}
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
              <label className="badge-label right">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={28} height={28} /> 경험치 랜덤 박스
              </label>
              {myInfo.rewardPoint !== '' ? (
                <label className="badge-label center">차기 스페셜DJ 선정 시 가산점 {myInfo.rewardPoint}점 지급</label>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <button onClick={() => openRandomPopup()} className="btn-random-box">
          경험치 랜덤 박스 열기
        </button>

        <ul className="notice-box">
          <li>* Top 배지는 마이페이지, 프로필, 방송 채팅창에 표현됩니다.</li>
          <li>* 경험치 랜덤 박스 보상은 데이터 업데이트 전까지 받아야합니다.</li>
          <li>* 경험치 랜덤 박스는 최하 50 EXP ~ 최대 500 EXP까지 보상을  받을 수 있습니다.</li>
        </ul>
      </div>
      {randomPopup && <RandomBoxPop setRandomPopup={setRandomPopup} setPopup={setPopup} />}
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

  img {
    vertical-align: middle;
  }

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
        width: 58%;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 11px;
        color: #632beb;
        text-align: center;
        font-size: 14px;
        background-color: #fff;
        text-align: center;
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
          line-height: 27px;
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
          line-height: 27px;
          text-align: center;
          font-weight: 700;
        }
      }

      .bottom-badge-box {
        display: flex;
        flex-wrap: wrap;
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

          &.center {
            margin-top: 6px;
            width: 100%;
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
