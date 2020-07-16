/**
 * @file terms/content/event_detail.js
 * @brief 이벤트 기간 및 상세소개
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

////---------------------------------------------------------------------
export default (props) => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h2>이벤트 기간 및 상세소개</h2>

      <h3 style={{fontWeight: 'bold'}}>{'<이벤트 기간 및 당첨자 발표>'}</h3>
      <div>
        <ul>
          <li>기간 : 7/16 ~ 7/22 , 당첨자 발표 : 7/24</li>
        </ul>
      </div>

      <h3 style={{fontWeight: 'bold'}}>{'< 청취자 집계 상세 설명 >'}</h3>

      <p style={{fontSize: '12px'}}>
        청취자는 1일 단위로 방문한 순 청취자수(비회원 제외)를 집계하고 이를 기간동안 합산합니다.
        <br />
        예)1일 100명, 2일 150명 일 경우 합계 250명으로 집계
        <br />
        ※1일 순청취자 : 하루동안 내가 3번 방을 만들고 A라는 사람이 3번다 입장(청취)했다 하더라도 순 청취자는 1명으로 계산
      </p>

      <h3 style={{fontWeight: 'bold'}}>{'< 좋아요 집계 >'}</h3>

      <p style={{fontSize: '12px'}}>부스터 좋아요를 제외한 순수 좋아요 수만 집계합니다.</p>

      <h3 style={{fontWeight: 'bold'}}>{'<이벤트 유의사항>'}</h3>
      <div>
        <ul>
          <li>동일 점수일 경우 라이징스타는 '총 방송 시간이 많은 회원' 라이징팬은 '총 청취시간이 많은 회원'이 높은 순위로 결정됩니다.</li>
          <li>부정한 방법으로 입상할 경우 이벤트 당첨을 취소합니다.</li>
          <li>
            <span className="red">라이징 스타, 팬은 중복 당첨을 제외합니다.</span>
          </li>
          <li>
            중복 당첨시 고가격 기준으로 1개만 인정됩니다.
            <br />
            ※동일한 가격일 경우 스타, 팬 순으로 인정됩니다.
            <br />※ 단, 아메리카노의 경우는 중복 지급합니다.
          </li>
          <li>
            회장님,부회장님,사장님 뱃지는 8월1일부터 1주일간 적용됩니다.
            <br />
            ※회장님 뱃지 디자인 수정
          </li>
          <li>
            <span className="red">경품 당첨시 22%의 제세공과금이 발생되니, 꼭 숙지하세요!</span> 당첨자에게는 제세공과금 관련
            사항이 별도 안내됩니다.{' '}
          </li>
          <li>
            당첨자는 <span className="red">help@dalbitlive.com</span>으로 신분증사본을 첨부해주시고, 내용에 이름, 휴대폰 번호,
            주민등록번호, 등본상 거주주소, 선물 받을 주소를 반드시 작성해주세요.
          </li>
          <li>달/별 당첨자는 당첨자 발표 후 순차 지급됩니다.</li>
          <li>
            <span className="blue">경품 대신 달로 받고 싶은 경우는 메일이나 1:1문의에 남겨주세요.</span>
          </li>
        </ul>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  h2 {
    font-size: 16px !important;
    text-align: center !important;
    font-weight: bold !important;
  }

  h3 {
    margin-bottom: 5px !important;
    font-size: 14px !important;
    color: #3a3a3a;
  }

  p {
    margin-top: 0 !important;
  }

  ul {
    li {
      position: relative;
      padding-left: 10px;
      font-size: 12px;
      line-height: 20px;

      &::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 2px;
        width: 2px;
        height: 2px;
        background: #000;
      }

      .red {
        color: #ec455f;
      }

      .blue {
        color: #02a0db;
      }
    }
  }

  ol {
    li {
      position: relative;
      padding-left: 17px;
      line-height: 22px;

      span {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  ol.depth1 {
    margin-top: 20px;
  }
  ol.depth2 {
    & > li {
      margin-top: 16px;
      padding-left: 20px;
      color: #616161;
    }
  }
  ol.depth3 {
    margin-top: 6px;
    li {
      color: #616161;
    }
  }
  ol.depth4 {
    margin-bottom: 5px;
    li {
      padding-left: 9px;
      color: #616161;
    }
  }

  table.content {
    margin: 30px 0 8px 0;
    padding: 0;
    border-top: 1px solid ${COLOR_MAIN};
    caption {
      display: none;
    }
    * {
      color: #424242;
      font-size: 14px;
      text-align: center;
    }

    th,
    td {
      padding: 15px 5px;
      border-bottom: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    }

    thead {
      th {
        background: #f5f5f5;
      }
      th:last-child {
        border-right: 0;
      }
    }

    tbody {
      td:last-child {
        border-right: 0;
      }
    }

    th.right-border,
    td.right-border {
      border-right: 1px solid #e0e0e0;
    }
  }

  span.table-txt {
    display: block;
    font-size: 14px;
    color: #9e9e9e;
    text-align: right;
  }
`
