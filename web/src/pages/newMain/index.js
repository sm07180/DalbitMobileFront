/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

// components
import Gnb from '../common/newGnb'

// static
import Mic from './static/ic_mike.svg'

export default props => {
  useEffect(() => {}, [])

  return (
    <MainWrap>
      <Gnb />
      <SubMain>
        <div className="gnb">
          <div className="left-side">
            <div className="tab">
              <Link to={'/mlive'}>라이브</Link>
            </div>
            <div className="tab">
              <Link to={'/ranking'}>랭킹</Link>
            </div>
            <div className="tab">
              <Link to={'/store'}>스토어</Link>
            </div>
          </div>
          <div className="right-side">
            <div className="btn">방송하기</div>
          </div>
        </div>
      </SubMain>
    </MainWrap>
  )
}

const SubMain = styled.div`
  height: 310px;
  background-color: #8556f6;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;

  .gnb {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
    box-sizing: border-box;

    .left-side {
      display: flex;
      flex-direction: row;

      .tab {
        height: 36px;
        color: #fff;
        font-size: 16px;
        letter-spacing: -0.4px;
        padding: 0 8px;

        a {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .right-side {
      .btn {
        display: flex;
        align-items: center;
        position: relative;
        width: 106px;
        height: 36px;
        margin-right: 8px;
        padding-left: 34px;
        text-align: right;
        border-radius: 18px;
        background-color: #fff;
        color: #8556f6;
        font-size: 16px;
        box-sizing: border-box;

        &::before {
          position: absolute;
          content: '';
          width: 36px;
          height: 36px;
          left: 0;
          top: 0;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url(${Mic});
        }
      }
    }
  }
`

const MainWrap = styled.div`
  margin-top: 48px;
`
