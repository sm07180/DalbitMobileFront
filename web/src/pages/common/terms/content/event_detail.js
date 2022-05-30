/**
 * @file terms/content/event_detail.js
 * @brief 이벤트 기간 및 상세소개
 */
import React from 'react'
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'

////---------------------------------------------------------------------
export default props => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h2>이벤트 기간 및 상세소개</h2>

      <h3 style={{fontWeight: 'bold'}}>{'<이벤트 기간 및 당첨자 발표>'}</h3>
      <div>
        <ul>
          <li>1차 기간 : 6/8 ~ 6/14 , 당첨자 발표 : 6/16</li>
          <li>2차 기간 : 6/15 ~ 6/21 , 당첨자 발표 : 6/23</li>
          <li>3차 기간 : 6/22 ~ 6/28 , 당첨자 발표 : 6/30</li>
        </ul>
      </div>

      <h3 style={{fontWeight: 'bold'}}>{'<이벤트 유의사항>'}</h3>
      <div>
        <ul>
          <li>부정한 방법(대단위 부계 동원 등)으로 입상한 경우 이벤트 당첨을 취소합니다.</li>
          <li>
            매 회차별 당첨은 가능하나,{' '}
            <span className="red">같은 회차에서 분야별(경험치,좋아요,선물) 중복 당첨은 제외됩니다.</span> 중복 당첨시 고가격
            기준으로 인정되고, 후순위가 대체 선정됩니다.
            <br />※ 동일한 가격일 경우 경험치,좋아요,선물 순으로 인정됩니다.
          </li>
          <li>동일 순위(페이지상 순위표기와 별개)의 경우는 총 방송시간이 많은 분이 선정됩니다.</li>
          <li>
            <span className="red">경품 당첨시 22%의 제세공과금이 발생되니, 꼭 숙지하세요!</span> 당첨자에게는 제세공과금 관련
            사항이 별도 안내됩니다.{' '}
          </li>
          <li>
            당첨자는 <span className="red">help@dallalive.com</span>으로 신분증사본을 첨부해주시고, 내용에 이름, 휴대폰 번호,
            주민등록번호, 등본상 거주주소, 선물 받을 주소를 반드시 작성해주세요.
          </li>
          <li>달/별 당첨자는 신분증접수가 필요 없습니다.</li>
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
    font-size: 14px !important;
    color: #3a3a3a;
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
