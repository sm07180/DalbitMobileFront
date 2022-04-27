/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React from 'react'
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'

////---------------------------------------------------------------------
export default props => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h2>경품 상세 소개</h2>

      <h3>{'<경품 상세 소개>'}</h3>
      <p>
        1) LG 그램 노트북 - 14Z90N-VR30K 144만원
        <br />
        2) 갤럭시북 플렉스 - NT930QCT-A38A 150만원
        <br />
        3) 아이패드 프로 11 4세대 - WiFi 128GB 103만원
        <br />
        4) LG 울트라 PC - 15U490-GR36K 64만원
        <br />
        5) 아이폰 SE2 – 55만원
        <br />
        6) 갤럭시탭S6 - Lite LTE SM-P615 54만원
        <br />
        7) 에어팟 프로 - 33만원
        <br />
        8) 갤럭시 버즈 플러스 - 18만원
        <br />
        9) 헤이카카오 (블루투스 미니스피커) - 6만원 + 핀마이크 2만원
      </p>

      <h3>{'<이벤트 유의사항>'}</h3>

      <ul>
        <li>
          가격은 오픈마켓 개인사업자들이나 쿠폰등을 적용한 가격이 아닌 애플몰,삼성몰,CJ몰,GS홈쇼핑, 신세계몰등에 판매하는 정품
          가격을 기준으로 반영된 것입니다. 관련법상 기업은 경품 구입시 쿠폰적용 또는 카드할인을 적용되지 않습니다.
        </li>
        <li>당첨자 발표 후 경품이 조기 소진되었을 경우 타 상품으로 대체될 수 있습니다.</li>
        <li>당첨자 발표 후 경품 구매가격의 변동으로 제세공과금의 변동이 발생될 수 있습니다.</li>
          {/*<li>위 가격에서 현저한 가격변동이 있는 경우 제세공과금을 제외하고 현금으로 지급됩니다. </li>*/}
        <li>경품대신 ‘달’로 받으시면 위 가격을 기준으로 지급됩니다. </li>
      </ul>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  p {
    font-size: 12px !important;
  }

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
