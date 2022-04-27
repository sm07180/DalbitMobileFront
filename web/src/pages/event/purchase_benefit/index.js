import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import styled from 'styled-components'
import {storeButtonEvent} from "components/ui/header/TitleButton";
import {useDispatch, useSelector} from "react-redux";
// 이벤트 적용후 모바일에서 테스트! (방송방,클립 플레이어 적용 꼭확인)
export default () => {
  let history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const customHeader = JSON.parse(Api.customHeader)

  const linkMove = () => {
    if (!globalState.token.isLogin) {
      history.push('/login?redirect=/event/purchaseBenefit')
    } else {
      storeButtonEvent({history, memberRdx, payStoreRdx});

      // if (customHeader['os'] === OS_TYPE['IOS']) {
      //   StoreLink(context, history)
      // } else {
      //   history.push(`/store`)
      // }
    }
  }

  return (
    <Content id="purchaseBenefit">
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
      </button>
      <img src="https://image.dalbitlive.com/event/purchase_benefit/210226/radio_view_open.png" alt="별, 달 추가 이벤트" />
      <button className="buy_btn" onClick={() => linkMove()}>
        <img src="https://image.dalbitlive.com/event/purchase_benefit/210226/buy_button.png" alt="스토어 가기" />
      </button>
      <div className="notice">
        <img src="https://image.dalbitlive.com/event/purchase_benefit/210226/radio_view_notice.png" alt="이벤트 유의사항" />
        <ul className="text">
          <li>
            본 이벤트는 예고 없이 종료될 수 있으니
            <br />
            지금 바로 혜택을 누리세요!
          </li>
          <li>추가로 드리는 달과 별은 내 지갑에서 확인할 수 있습니다.</li>
          <li>
            부정한 방법으로 이벤트 참여 시 지급한 달/별의 회수 및<br />
            경고/정지 등의 제제가 있을 수 있습니다.
          </li>
          <li>
            별 추가 지급의 경우 방송 종료 시각 기준, 달 추가 지급의 경우
            <br />
            결제 완료 시각 기준으로 이벤트가 적용됩니다.
          </li>
        </ul>
      </div>
    </Content>
  )
}

const Content = styled.div`
  &#purchaseBenefit {
    position: relative;
    max-width: 460px;
    min-height: 100vh;
    margin: auto;
    padding-bottom: 70px;
    background: #ec455f;
    img {
      width: 100%;
    }
    .notice {
      .text {
        display: none;
      }
    }

    .player_show {
    }
    .btnBack {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 40px;
      height: 40px;
    }
    .buy_btn {
      width: 100%;
      padding: 5% 10%;
    }
  }
`
