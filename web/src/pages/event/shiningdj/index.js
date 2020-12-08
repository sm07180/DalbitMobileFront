import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import {OS_TYPE} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header.js'

import {StoreLink} from 'context/link'

export default () => {
  let history = useHistory()
  const context = useContext(Context)
  const [osCheck, setOsCheck] = useState(-1)
  return (
    <Content>
      <Layout status="no_gnb">
        <div id="shiningDJ">
          <div className="content">
            <button className="btnBack" onClick={() => history.goBack()}>
              <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
            </button>
            <img src="https://image.dalbitlive.com/event/shiningdj/shining_visual.jpg" alt="또 하나의 별 샤이닝DJ" />
            <img src="https://image.dalbitlive.com/event/shiningdj/shining_cont01.png" alt="선발방식" />
            <div className="notice">
              <img src="https://image.dalbitlive.com/event/shiningdj/shining_cont04.png" alt="기억해주세요" />
              <ul className="text">
                <li>샤이닝 DJ는 매월 15일 00시(자정) 공개됩니다. </li>
                <li>샤이닝 DJ 자격은 1개월 (당월 15일 ~ 익월 14일) 동안 유지됩니다. </li>
                <li>샤이닝 DJ 선발 인원은 정해져 있지 않습니다.</li>
                <li>현재 스페셜 DJ는 샤이닝 DJ 선발 시 제외됩니다. </li>
                <li>현재 샤이닝 DJ는 스페셜 DJ 접수 기간에 신청할 수 있습니다.</li>
                <li>
                  샤이닝 DJ가 스페셜 DJ에 선발될 시, 해당자는 스페셜 DJ 대상자로 전환됩니다. (샤이닝 DJ 대신 스페셜 DJ 배지 노출)
                </li>
                <li>샤이닝 DJ 선발 후 운영원칙을 상습/의도적으로 위반하는 경우 자격이 박탈될 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  #shiningDJ {
    position: relative;
    min-height: calc(100vh - 50px);
    .content {
      position: relative;
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      .link_button {
        position: absolute;
        left: 0;
        top: 65.2%;
        width: 100%;
        height: 10%;
        text-indent: -9999px;
      }
      .notice {
        position: relative;
        padding-bottom: 30px;
        background-color: #4b418e;
      }
      .text {
        display: none;
        position: absolute;
        top: 15%;
        left: 0;
        width: 100%;
        padding: 0 4% 0 6%;
        letter-spacing: -0.8px;
        font-size: 14px;
        color: #757575;
        > li {
          position: relative;
          padding-left: 14px;
          line-height: 1.6;
          &::before {
            display: block;
            content: '';
            width: 6px;
            height: 1px;
            background-color: #757575;
            position: absolute;
            left: 0;
            top: 10px;
          }
        }
      }
    }
    .btnBack {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 40px;
      height: 40px;
    }
  }
  @media (max-width: 460px) {
    #shiningDJ {
      .content {
        .text {
          line-height: 1.2;
          font-size: 0.8em;
        }
      }
    }
  }
  @media (max-width: 400px) {
    #shiningDJ {
      .content {
        .text {
          line-height: 1.2;
          font-size: 0.4em;
          > li {
            padding-left: 10px;
            &::before {
              top: 8px;
            }
          }
        }
      }
    }
  }
`
