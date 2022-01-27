// 사용안함 20.08.25
import React, {useContext} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
// component //
import Layout from 'pages/common/layout'
import Api from 'context/api'
import GoldIcon from '../static/gold.svg'
import SilverIcon from '../static/silver.svg'
import BronzeIcon from '../static/bronze.svg'
import BlueHoleIcon from '../static/bluehole.svg'
import StarIcon from '../static/star.svg'
import HeartIcon from '../static/heart.svg'
import DashIcon from '../static/dash.svg'
import ArrowIcon from '../static/arrow.svg'
//
import ProfileIcon from '../static/menu_profile.svg'
import AppSettingIcon from '../static/menu_appsetting.svg'
import BroadNoticeIcon from '../static/menu_broadnotice.svg'
import BroadFanboardIcon from '../static/menu_fanboard.svg'
import BroadSettingIcon from '../static/menu_broadsetting.svg'
import DalIcon from '../static/menu_dal.svg'
import ExchangeIcon from '../static/menu_exchange.svg'
import WalletIcon from '../static/menu_wallet.svg'
import ReportIcon from '../static/menu_report.svg'
import NoticeIcon from '../static/menu_notice.svg'
import EventIcon from '../static/menu_event.svg'
import FaqIcon from '../static/menu_faq.svg'
import InquireIcon from '../static/menu_1on1.svg'
import ServiceIcon from '../static/menu_guide.svg'
import AppIcon from '../static/menu_appinfo.svg'

export default (props) => {
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx

  return (
    <FalseLoginWrapper>
      <div className="loginWrapper">
        <div className="defalutImg"></div>
        <button className="loginBtn">로그인</button>
        <p className="loginPlz">로그인 해주세요</p>
        <div className="defalutRank">
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* categoryCntWrap */}
        <div className="categoryCntWrap">
          <div>
            <span className="catebox">
              <em className="CategoryIcon "></em>
              <em className="CategoryName">팬</em>
            </span>
            <em className="dash"></em>
          </div>
          <div>
            <span className="catebox">
              <em className="CategoryIcon star"></em>
              <em className="CategoryName">스타</em>
            </span>
            <em className="dash"></em>
          </div>
          <div>
            <span className="catebox">
              <em className="CategoryIcon like"></em>
              <em className="CategoryName">좋아요</em>
            </span>
            <em className="dash"></em>
          </div>
        </div>
      </div>
      {/* categoryCntWrap */}
      {/* navWrap */}
      <div className="navWrap">
        <div>
          <span className="img type1"></span>
          <span className="title">프로필 설정</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div className="mb12">
          <span className="img type2"></span>
          <span className="title">앱 설정</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type3"></span>
          <span className="title">방송공지</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type4"></span>
          <span className="title">팬보드</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div className="mb12">
          <span className="img type5"></span>
          <span className="title">방송설정</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type6"></span>
          <span className="title">달 충전</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type7"></span>
          <span className="title">환전</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type8"></span>
          <span className="title">내지갑</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div className="mb12">
          <span className="img type9"></span>
          <span className="title">리포트</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type10"></span>
          <span className="title">공지사항</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type11"></span>
          <span className="title">이벤트</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type12"></span>
          <span className="title">FAQ</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type13"></span>
          <span className="title">1:1문의</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type14"></span>
          <span className="title">서비스 가이드</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
        <div>
          <span className="img type15"></span>
          <span className="title">앱 정보</span>
          <span className="icon">
            <em></em>
          </span>
        </div>
      </div>

      {/* navWrap */}
      {/* <div className="footerBtn">
        <button>Back</button>
        <button>Re</button>
      </div> */}
    </FalseLoginWrapper>
  )
}

//---로그인 대기 style

const FalseLoginWrapper = styled.div`
  width: 100%;
  min-height: 372px;
  padding: 79px 0px 8px 0px;
  background-color: #eeeeee;

  .loginWrapper {
    display: flex;
    margin: 0 8px;
    align-items: center;
    flex-direction: column;
    position: relative;
    height: 285px;
    border-radius: 20px;
    background-color: #ffffff;
    /* //////////////// */
    .defalutImg {
      position: absolute;
      top: -57px;
      left: 50%;
      transform: translateX(-50%);
      width: 96px;
      height: 96px;
      background: url('https://image.dalbitlive.com/main/mandefalut.png') no-repeat center center / cover;
    }
    /* //////////////// */
    .loginBtn {
      width: 200px;
      height: 56px;
      margin-top: 59px;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.17;
      border-radius: 28px;
      color: #ffffff;
      background-color: #632beb;
    }
    /* //////////////// */
    .loginPlz {
      margin: 8px 0 14px 0;
      font-size: 18px;
      line-height: 0.89;
      letter-spacing: normal;
      text-align: center;
      color: #616161;
    }
    /* //////////////// */
    .defalutRank {
      display: flex;
      div {
        position: relative;
        width: 28px;
        height: 28px;
        background-color: aliceblue;
        margin-right: 6px;
        border-radius: 50%;
        background: url('https://image.dalbitlive.com/main/man.png') no-repeat center center / cover;

        :after {
          content: '';
          position: absolute;
          right: 0;
          bottom: 0;
          width: 12px;
          height: 12px;
          background: url(${IMG_SERVER}/images/api/ic_gold.png) no-repeat;
        }
      }
      div:nth-child(2) {
        background: url('https://image.dalbitlive.com/main/nogender.jpg') no-repeat center center / cover;
        :after {
          background: url(${IMG_SERVER}/images/api/ic_silver.png) no-repeat;
        }
      }
      div:last-child {
        margin-right: 0;
        background: url('https://image.dalbitlive.com/main/male.jpg') no-repeat center center / cover;
        :after {
          background: url(${IMG_SERVER}/images/api/ic_bronze.png) no-repeat;
        }
      }
    }

    /* //////////////// */
    .categoryCntWrap {
      margin: 12px 0 13px 0;
      display: flex;
      .dash {
        display: block;
        width: 12px;
        height: 12px;
        margin-top: 7px;
        background: url(${DashIcon}) no-repeat center center / cover;
      }

      .catebox {
        display: flex;
        align-items: center;
        justify-content: center;
        .CategoryName {
          margin-left: 2px;
          font-style: normal;
          font-size: 12px;
          line-height: 1.08;
          letter-spacing: normal;
          text-align: center;
          color: #424242;
        }

        .CategoryIcon {
          display: block;
          width: 24px;
          height: 24px;
          background: url(${BlueHoleIcon}) no-repeat center center / cover;

          &.star {
            background: url(${StarIcon}) no-repeat center center / cover;
          }

          &.like {
            background: url(${HeartIcon}) no-repeat center center / cover;
          }
        }
      }

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;
        width: 88px;
        height: 50px;
        :after {
          content: '';
          position: absolute;
          right: 0;
          height: 40px;
          width: 1px;
          background-color: #eeeeee;
        }
      }
      div:last-child {
        :after {
          height: 0;
          width: 0;
        }
      }
    }
    /* //////////////// */
  }
  .navWrap {
    display: flex;

    flex-direction: column;
    margin-top: 12px;
    margin-bottom: 53px;
    background-color: #eeeeee;
    & .mb12 {
      margin-bottom: 12px;
    }
    div {
      display: flex;
      background: #fff;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      padding: 0 16px;
      height: 44px;
      line-height: 44px;
      border-bottom: 1px solid #eeeeee;

      & .img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        background: url(${ProfileIcon}) no-repeat center center / cover;
        &.type1 {
          background: url(${ProfileIcon}) no-repeat center center / cover;
        }
        &.type2 {
          background: url(${AppSettingIcon}) no-repeat center center / cover;
        }
        &.type3 {
          background: url(${BroadNoticeIcon}) no-repeat center center / cover;
        }
        &.type4 {
          background: url(${BroadFanboardIcon}) no-repeat center center / cover;
        }
        &.type5 {
          background: url(${BroadSettingIcon}) no-repeat center center / cover;
        }
        &.type6 {
          background: url(${DalIcon}) no-repeat center center / cover;
        }
        &.type7 {
          background: url(${ExchangeIcon}) no-repeat center center / cover;
        }
        &.type8 {
          background: url(${WalletIcon}) no-repeat center center / cover;
        }
        &.type9 {
          background: url(${ReportIcon}) no-repeat center center / cover;
        }
        &.type10 {
          background: url(${NoticeIcon}) no-repeat center center / cover;
        }
        &.type11 {
          background: url(${EventIcon}) no-repeat center center / cover;
        }
        &.type12 {
          background: url(${FaqIcon}) no-repeat center center / cover;
        }
        &.type13 {
          background: url(${InquireIcon}) no-repeat center center / cover;
        }
        &.type14 {
          background: url(${ServiceIcon}) no-repeat center center / cover;
        }
        &.type15 {
          background: url(${AppIcon}) no-repeat center center / cover;
        }
      }
      & .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;

        > em {
          width: 24px;
          height: 24px;
          background: url(${ArrowIcon}) no-repeat center center / cover;
        }
      }
      & .title {
        font-size: 14px;
        font-weight: 800;

        letter-spacing: -0.35px;

        color: #000000;
      }
    }
  }
  /* //////////////// */
  .footerBtn {
    display: flex;
    margin: 0 10px;
    justify-content: space-between;
    button {
      width: 36px;
      height: 36px;
      background-color: darkcyan;
      border-radius: 50%;
    }
  }
`
