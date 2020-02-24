/**
 * @file logo.js
 * @brief Header영역의 좌측 로고
 * @todo 반응형으로 처리되어야함
 */

import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
//
export default props => {
  //const
  const urlPc = `${IMG_SERVER}/images/api/ic_logo_normal.png`
  const urlMobile = `${IMG_SERVER}/images/api/ic_logo_normal_w.png`
  const urlMobileSub = `${IMG_SERVER}/images/api/ic_logo_mobile_w.png`
  //---------------------------------------------------------------------
  return (
    <Content className={['logo', ...props.type]}>
      <Link to="/">
        <img src={urlPc} className="pc" />
        <img src={urlMobile} className="mobile" />
        <img src={urlMobileSub} className="mobilesub" />
      </Link>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  position: fixed;
  top: 16px;
  left: 24px;
  width: 20%;
  z-index: 1;
  a {
    display: inline-block;
    max-width: 184px;
    min-width: 128px;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
    img.mobile,
    img.mobilesub {
      display: none;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    top: 7px;
    left: 14px;
    width: 38%;
    a {
      max-width: 148px;
      min-width: 100px;
      img.mobile {
        display: block;
      }
      img.pc {
        display: none;
      }
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    &.scroll,
    &.sub {
      a {
        img.mobile {
          display: none;
        }
        img.mobilesub {
          display: block;
          width: 38px;
        }
      }
    }
  }

  /* @media (max-width: ${WIDTH_MOBILE_S}) {
    &.scroll,
    &.sub {
      a {
        img.mobilesub {
          width: 32px;
        }
      }
    }
  } */
`
