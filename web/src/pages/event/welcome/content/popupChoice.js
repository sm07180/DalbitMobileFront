import React, {useEffect} from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopupNotice} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupNotice()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWrap') {
      closePopup()
    }
  }

  return (
    <PopupWrap id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">참가 방법</h1>
        <ul>
          <li>
            <span>①</span> 총 4주간 4회차로 나눠 진행됩니다.
            <br />
            (1회차 = 7일)
          </li>
          <li>
            <span>②</span> 깐부게임은 두 명이 짝을 이뤄 구슬을 모아 점수가 가장 높은 서른 팀에게 상품을 드리는 게임입니다.
          </li>
          <li>
            <span>③</span> 회차별로 한번 맺은 깐부는 변경할 수 없으니 깐부를 결정하실 때 신중하시기 바랍니다.
          </li>
          <li>
            <span>④</span> 구슬을 얻는 법은 아래 안내에서 확인하실 수 있으며, 구슬 베팅소에서 구슬을 잃을 수도, 두 배로 불릴 수도
            있습니다.
          </li>
          <li>
            <span>⑤</span> 회차가 바뀔 때 깐부가 해체되며 모은 구슬 점수 또한 초기화되므로 새로운 깐부와 이벤트를 진행해 주세요.
          </li>
          <li>자, 그럼 즐거운 게임 되시기 바랍니다.</li>
        </ul>
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  .contentWrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 390px;
    border-radius: 15px;
    background-color: #fff;
    .title {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      letter-space: -1px;
      color: #000000;
      box-sizing: border-box;
    }
    ul {
      font-size: 16px;
      padding: 12px 20px 20px 40px;
      li {
        position: relative;
        margin-bottom: 12px;
        letter-spacing: -1px;
        &:last-child {
          margin-bottom: 0;
          margin-left: -20px;
        }
        span {
          position: absolute;
          top: -1px;
          left: -20px;
        }
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 53px;
      height: 53px;
      cursor: pointer;
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
`
