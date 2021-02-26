import React from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

export default function bestdjIntro() {
  const history = useHistory()
  return (
    <Content>
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
      </button>

      <div className="bestdj_intro">
        <div className="text">최대 150만원 현금을 받을 수 있는 기회!</div>
        <img src="http://image.dalbitlive.com//event/best_dj/210224/visual.png" alt="우리모두 달빛하여 베스트스페셜DJ되세" />

        <div className="text">스페셜DJ 누적 6회 달성시 베스트 스페셜 DJ로 승급됩니다!</div>
        <img src="http://image.dalbitlive.com//event/best_dj/210224/content_img1.png" alt="베스트 스페셜 DJ" />

        <div className="text">베스트 스페셜 DJ의 경우 최대 150만원의 활동지원비를 지급해드립니다!</div>
        <img src="http://image.dalbitlive.com//event/best_dj/210224/content_img2.png" alt="베스트 스페셜Dj 혜택" />

        <div className="text">매월 말 스페셜Dj 선발 사전 공지에서 데이터 검토 기간을 확인합니다.</div>
        <img src="http://image.dalbitlive.com//event/best_dj/210224/content_img3.png" alt="베스디를 유지하려면?" />
        <img src="http://image.dalbitlive.com//event/best_dj/210224/content_img4.png" alt="기억해주세요" />
      </div>
    </Content>
  )
}

const Content = styled.div`
  position: relative;
  img {
    width: 100%;
  }
  .text {
    text-indent: -9999px;
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
  .btnBack {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 40px;
    height: 40px;
  }
`
