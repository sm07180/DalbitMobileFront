import React, {useEffect} from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopupNotice, whoIs} = props

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
        <div className="title">이벤트 유의사항</div>
        <ul>
          <li>
            경품 숫자별로 가장 많이 응모한 상위 회원들에 지급 <br />※ 응모횟수가 같은 경우 총 응모횟수가 많은 순, 레벨 순 선정
          </li>
          <li>공지사항을 통해 발표 (※경품별 응모횟수는 공개 안 함)</li>
          <li>중복당첨 불가, 1계정에 1개의 경품만 당첨</li>
          <li>가장 많이 응모한 분께는 개별 연락 드리겠습니다. </li>
          <li className="red">
            청취시간은 1개의 방에서만 인정, 동시자리는 인정 안함.
            <br />
            (※ 리포트와는 다르게 집계될 수 있습니다)
          </li>
          <li>제세공과금(22%)은 당첨자 부담입니다.</li>
          <li>
            경품 대신 현금으로 받고 싶은 경우, <br />
            메일(<em>help@dalbitlive.com</em>) 로 당첨자 서류와 함께
            <br />
            [현금 입금 희망] 내용을 남겨주세요. 이벤트 서류 확인 후<br />
            제세공과금(22%)을 제외한 금액이 입금됩니다.
          </li>
          <li>
            경품 대신 달로 받고 싶은 경우,1:1문의에 남겨주세요. 
            <br />이 경우에는 제세공과금이 발생하지 않습니다.{' '}
          </li>
          <li>당첨자 관련 서류는 문자를 통해 별도 안내 드립니다.</li>
        </ul>
        <button className="close" onClick={closePopup}>
          <img src="" alt="닫기" />
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
