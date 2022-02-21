import React from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import styled from 'styled-components'

export default function bestdjIntro() {
  const history = useHistory()
  return (
    <Content>
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
      </button>

      <div className="bestdj_intro">
        <img src={`${IMG_SERVER}/event/best_dj/211005/content_img-1.png`} alt="베스디" />
        <div className="notice_wrap">
          <div className="notice_title">
            <img src={`${IMG_SERVER}/event/best_dj/210618/notice_title.png`} alt="기억해 주세요" />
          </div>
          <ul className="notice_list">
            <li>베스트 스페셜 DJ의 경우도 [프로필 &gt; 스페셜 DJ 약력]과 [랭킹 &gt; 명예의 전당]은 스페셜 DJ로 표시됩니다.</li>
            <li>베스트 스페셜 DJ 활동지원비는 매월 1일 스페셜 DJ 선발 발표 후 (영업일 기준) 오전 중 지급해드립니다.</li>
            <li>현금은 별로 환산(환전수수료 혜택 5% 반영)해서 지급됩니다.</li>
            <li>베스트 스페셜 DJ 혜택은 추후 조정될 수 있습니다.</li>
            <li>베스트 스페셜 DJ 아이디 양도(공동 사용)는 불가하며 제재 대상이 됩니다.</li>
            <li>푸시 알림은 1:1문의를 통해<br/>방송(이벤트/기념일/콘텐츠 방송 한정) 예정 시간, 제목 및 내용(각 20글자 이내)을 보내주시면 검수 후 발송됩니다.</li>
          </ul>
        </div>
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
  .notice_wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    padding: 0 14px 36px 14px;
    background: #f7eecd;
  }
  .notice_title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35%;
    height: auto;
  }
  .notice_list {
    padding: 30px 12px 22px 12px;
    text-align: left;
    font-weight: bold;
    font-size: 14px;
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 20px;
  }
  .notice_list > li {
    padding-left: 12px;
    text-indent: -12px;
    color: #646464;
    letter-spacing: -0.8px;
    margin-top: 8px;
  }
  .notice_list > li:first-child {
    margin-top: 0;
  }
  .notice_list > li::before {
    position: relative;
    top: -4px;
    display: inline-block;
    content: '';
    width: 6px;
    height: 6px;
    margin-right: 6px;
    background: #4aacc4;
    border-radius: 100%;
  }
`
