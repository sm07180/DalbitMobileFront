import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import {Context} from 'context'

export default () => {
  const history = useHistory()
  const context = useContext(Context)
  return (
    <Content>
      <div id="package">
        <button className="btnBack" onClick={() => history.goBack()}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
        </button>
        <img src="https://image.dalbitlive.com/event/package/20210127/visual.jpg" alt="보이는 라디오 웹캠 지원 이벤트" />
        <img
          src="https://image.dalbitlive.com/event/package/20210127/content.jpg"
          alt="진행일정: 1월 27일 ~ 2월 1일 / 결과 발표 : 2월 2일 목요일"
        />
        <button
          onClick={() => {
            context.action.alert({
              msg:
                '이벤트 신청 정보<br/>(연락처, 배송지 주소, 방송 소개등)는<br/> 1:1문의를 통해 신청해주세요.<br/><br/>예시) 웹캠 이벤트 신청합니다.',
              callback: () => {
                history.push('/customer/personal')
              }
            })
          }}>
          <img src="https://image.dalbitlive.com/event/package/20210127/button_on.jpg" alt="지원신청" />
        </button>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  #package {
    position: relative;
    background: #fff0d2;
  }
  img {
    width: 100%;
  }
  .btnBack {
    position: absolute;
    top: 10px;
    right: 2%;
    width: 32px;
    height: 32px;
  }
`
