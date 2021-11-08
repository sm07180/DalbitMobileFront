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
    if (target.id === 'pupupNotice') {
      closePopup()
    }
  }

  return (
    <PopupWrap id="pupupNotice" onClick={wrapClick}>
      <div className="contentWrap">
        <div className="title">
          <img src="https://image.dalbitlive.com/event/raffle/popTitle-1.png" alt="이벤트 유의사항" />
        </div>
        <div className="subTitle">
          <img src="https://image.dalbitlive.com/event/raffle/popupSubTitle-1.png" alt="# 이벤트1." />
        </div>
        <ul>
          <li>받은 선물수는 이벤트1의 5% 추가 적립 개수는 제외한 순수 선물수만으로 집계됩니다.</li>
          <li>방송 종료 시각 기준으로 이벤트 참여 날짜 적용 및 5% 추가 적립됩니다.</li>
          <li>
            추가 적립은 평일 최대 150개(휴일 300개)만 적립됩니다. <br />
            예로 3201개의 경우 5%인 160개가 아닌 150개만
            <br />
            지급됩니다. 휴일에는 300개까지 추가 지급됩니다.
          </li>
        </ul>
        <div className="subTitle">
          <img src="https://image.dalbitlive.com/event/raffle/popupSubTitle-3.png" alt="# 이벤트3." />
        </div>
        <ul>
          <li>조건(방송시간,선물수)을 충족하면 해당 선물을 드립니다.</li>
          <li>제세공과금(22%)은 당첨자 부담입니다.</li>
          <li className="red">
            최소 방송시간을 채우지 못하면 선물액의 50%만 제세
            <br />
            공과금 제외 후 현금 지급됩니다.
            <br />
            단, 하위 경품 당첨 조건에 부합하며 해당 경품의 선물액이 더 높을 경우, 하위 경품으로 당첨됩니다.
            <br />
            (※ 달100개 상품 제외)
          </li>
          <li>
            경품 대신 현금으로 받고 싶은 경우,
            <br />
            메일(<em>help@dalbitlive.com</em>) 로 당첨자 서류와 함께
            <br />
            [현금 입금 희망] 내용을 남겨주세요. 이벤트 서류 확인 후 <br />
            제세공과금(22%)을 제외한 금액이 입금됩니다.
          </li>
          <li>
            경품 대신 달로 받고 싶은 경우,1:1문의에 남겨주세요. 
            <br />이 경우에는 제세공과금이 발생하지 않습니다.
          </li>
          <li>당첨자 관련 서류는 문자를 통해 별도 안내 드립니다.</li>
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
      img {
        height: 24px;
      }
    }
    .subTitle {
      margin-top: 20px;
      margin-bottom: 7px;
      font-size: 13px;
      font-weight: 900;
      font-family: 'NanumSquare', 'NotoSans', sans-serif;
      &:first-child {
        margin-top: 0;
      }
      img {
        height: 14px;
      }
    }
    ul {
      font-size: 13px;
      padding-left: 12px;
      li {
        position: relative;
        margin-bottom: 8px;
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
