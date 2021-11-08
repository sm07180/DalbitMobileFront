import React, {useEffect} from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopupDetails} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupDetails()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'pupupDetails') {
      closePopup()
    }
  }

  return (
    <PopupWrap id="pupupDetails" onClick={wrapClick}>
      <div className="contentWrap">
        <div className="title">경품 소개</div>
        <ul>
          <li>황금열쇠 7돈(순금) : 216만원(변동 가능)</li>
          <li>갤럭시 제트플립 3 : 125만원</li>
          <li>방송장비세트 : 50만원</li>
          <li>에어팟 프로 : 33만원</li>
          <li>블루 예티 나노 : 14만원</li>
        </ul>
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
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
    padding: 25px 15px 30px;
    border-radius: 15px;
    background-color: #fff;
    .title {
      margin-bottom: 18px;
      font-size: 21px;
      font-weight: 900;
      text-align: center;
      font-family: 'NanumSquare', sans-serif;
      letter-space: -1px;
      color: #000000;
    }
    ul {
      font-size: 13px;
      padding-left: 12px;
      li {
        position: relative;
        margin-bottom: 12px;
        letter-spacing: -1.5px;
        &:before {
          position: absolute;
          left: -8px;
          content: '-';
        }
        &.red {
          color: #ff5151;
        }
        em {
          font-style: normal;
          color: #6820a8;
        }
        &:last-child {
          margin-bottom: 0;
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
