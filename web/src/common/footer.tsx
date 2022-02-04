import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import styled from "styled-components";
export default function Footer() {
  const history = useHistory();

  return (
    <Content id="footerWrap">
      <ul className="infoList">
        <li
          className="infoItem"
          onClick={() => history.push("/configure/service")}
        >
          이용약관
        </li>
        <li
          className="infoItem"
          onClick={() => history.push("/configure/indivisual")}
        >
          개인정보
        </li>
        <li
          className="infoItem"
          onClick={() => history.push("/configure/youth")}
        >
          청소년보호
        </li>
        <li
          className="infoItem"
          onClick={() => history.push("/configure/operation")}
        >
          운영정책
        </li>
        <li
          className="infoItem"
          onClick={() => history.push("/customer/service")}
        >
          고객센터
        </li>
      </ul>
      <ul className="infoBox">
        <li>
          <span className="sbj">대표이사</span>
          <span>박진</span>
          <span className="sbj">사업자등록번호</span>
          <span>409-81-49209</span>
        </li>
        <li>
          <span className="sbj">통신판매업 신고번호</span>
          <span>제2004-30호</span>
        </li>
        <li>
          <span className="sbj">주소</span>
          <span>광주광역시 서구 상무대로 773 4층</span>
        </li>
        <li className="isBlock">
          <span className="sbj">연락처</span>
          <span className="emp">1522-0251</span>
        </li>
        <li className="isBlock">
          <span className="sbj">제휴/이벤트</span>
          <span className="emp">
            <a href="mailto:help@dalbitlive.com" className="emailLink">
              help@dalbitlive.com
            </a>
          </span>
        </li>
      </ul>
      <p className="copyright">
        Copyrightⓒ2021 by (주)여보야. All rights reserved.
      </p>
    </Content>
  );
}

const Content = styled.div`
  &#footerWrap {
    padding: 30px 0 50px;
    background-color: #f5f5f5;
    text-align: center;
    .infoList {
      > li {
        display: inline-block;
        position: relative;
        padding: 5px 6px;
        font-size: 12px;
        color: #632beb;
        cursor: pointer;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 1px;
          height: 8px;
          background-color: #bdbdbd;
        }
        &:first-child {
          &::before {
            display: none;
          }
        }
      }
    }
    .infoBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      flex-direction: column;
      width: 290px;
      margin: 20px auto 0;
      font-size: 12px;
      > li {
        display: inline-block;
        &.isBlock {
          display: block;
        }
        span {
          display: inline-block;
          padding: 2px 2px;
          color: #424242;
          letter-spacing: -0.4px;
          &.sbj {
            color: #9e9e9e;
          }
          &.emp {
            color: #632beb;
          }
        }
      }
    }
    .copyright {
      margin-top: 20px;
      font-size: 12px;
      color: #9e9e9e;
    }
  }
  // footer
  &#footerWrap {
    .menuWrap {
      margin-bottom: 0;
      padding: 21px 0px 18px 0px;
      border-top: 2px solid #632beb;
      border-bottom: 2px solid #e0e0e0;
      &__center {
        margin: auto;
      }
      button {
        display: inline-block;
        margin: 0px 18px;
        color: #632beb;
        font-size: 16px;
      }
    }
    .toggleWrap {
      margin: auto;
      .emailLink {
        color: #632beb;
      }
      &__buttonWrap {
        width: 204px;
        height: 36px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin: 37.4px auto 0 auto;
      }

      &__logo {
        width: 147px;
        height: 31px;
        background: url("https://image.dalbitlive.com/images/api/footerlogo.png")
          no-repeat center center / cover;
      }

      &__infoWrap {
        margin-top: 22px;
        &--info {
          font-size: 12px;
          li {
            display: inline-block;
            font-size: 14px;
            line-height: 28px;
            color: #9e9e9e;
            span {
              padding-right: 10px;
              color: #9e9e9e;
            }
          }
          li + li {
            margin-left: 20px;
          }
        }
      }
    }
    .copyrightWrap {
      margin-top: 40px;
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.14;
      letter-spacing: -0.35px;
      color: #9e9e9e;
      margin-right: 8px;
    }
  }
`;
