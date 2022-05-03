import React from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopupState} = props

  const closePopup = () => {
    setPopupState(false)
  }
  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  // --------------------------------------------------
  return (
    <PopupWrap onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>이벤트 유의사항</h3>
        <div className="layerContent">
          <ul className="scoreGuideWrap">
            <li>
              방송방에서 보름달을 띄우면 리스트에서 횟수와 시간이 함께 표기됩니다.
              <div className="aboutMoons">
                <div className="moonsItem">
                  <strong className="strongPurple block">문법사(DJ)</strong>
                  <span className="innerTxt">
                    - 보름달을 띄운 횟수 <br />- 최근 띄운 시간
                  </span>
                </div>
                <div className="moonsItem">
                  <strong className="strongPurple block">문집사(청취자)</strong>
                  <span className="innerTxt">
                    - 보름달 띄우기(완료)에 공헌한 횟수 <br />- 최근 띄운 시간
                    <br />- 이벤트 기간 내 청취시간
                  </span>
                </div>
              </div>
            </li>
            <li>
              횟수가 높은 순대로 순위가 산정되며, 만약 횟수가 동일한 경우 최근 띄운 시간이 더 빠른 사람의 순위가 높게 표현됩니다.
              <p className="strongRed">
                ※ 문집사(청취자)의 경우 띄운 시간까지 같다면 이벤트 진행 기간 내 청취 시간이 더 많은 사람의 순위가 더 높게
                표현됩니다.
              </p>
            </li>
            <li>
              <span>
                <strong className="strongPurple">문법사와 문집사 TOP3</strong>는 이벤트 종료 다음날 00시 자동으로 혜택을 받게
                됩니다.
              </span>
            </li>
            <li>
              <span>
                보름달을 띄울 수 있는 조건(방송 시간, 받은 별, 누적 청취자, 받은 좋아요)과 공헌 조건(보낸 달)은 사전 고지 없이
                변경될 수 있습니다.
              </span>
            </li>
          </ul>
          <button className="agreeBtn" onClick={closePopup}>
            확인
          </button>
        </div>

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
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

  .btnClose {
    position: absolute;
    top: -40px;
    right: 0px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    background: url(https://image.dallalive.com/svg/close_w_l.svg) no-repeat 0 0;
  }

  .layerContainer {
    position: relative;
    width: calc(100% - 36px);
    min-width: 320px;

    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: 800;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .layerContent {
      padding: 16px 0 32px;
      background: #fff;
      border-radius: 16px;
    }
  }
`
