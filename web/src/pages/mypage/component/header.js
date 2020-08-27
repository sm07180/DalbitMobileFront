import React, {useContext} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {Context} from 'context'
import qs from 'qs'
// static
import closeBtn from './ic_back.svg'
import Write from './ic_write.svg'
import {getUrlAndRedirect} from 'components/lib/link_control.js'

export default (props) => {
  const context = useContext(Context)
  const _parse = qs.parse(window.location.href, {ignoreQueryPrefix: true})
  const goBack = () => {
    if (sessionStorage.getItem('push_type') === 'Y') {
      sessionStorage.removeItem('push_type')
      return (window.location.href = '/')
    }
    // if (_parse.push_type !== undefined && typeof _parse.push_type === 'string') {
    //
    // }
    const {webview} = qs.parse(location.search)
    let referrer = document.referrer
    if (webview && webview === 'new' && isHybrid()) {
      Hybrid('CloseLayerPopup')

      /*} else if (referrer.split('/')[4] === 'faq') {
      window.history.go(-2)*/
    } else {
      //window.history.go(-1)
      if (props.click == undefined) {
        getUrlAndRedirect()
        //팬관리 스테이트 초기화
        context.action.updateFanEdite(false)
      } else {
        props.click()
      }
    }
    /*if (props.click == undefined) {
      getUrlAndRedirect()
    } else {
      props.click()
    }*/
  }

  return (
    <div className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
    // <Header className="header-wrap">
    //   <div className="child-bundle">{props.children}</div>
    //   <div></div>
    //   <img className="close-btn" src={closeBtn} onClick={goBack} />
    // </Header>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
  /* padding: 14px 0; */
  box-sizing: border-box;
  /* margin-bottom: 10px; */
  /* width: calc(100% + 32px); */
  width: 100%;
  /* margin-left: -16px; */
  padding: 10px 16px 9px 16px;
  height: 40px;
  background-color: #fff;
  .write-btn {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 8px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    width: 72px;
    height: 32px;
    border-radius: 16px;
    background-color: ${COLOR_MAIN};
    :before {
      display: block;
      background: url(${Write}) no-repeat center center / cover;
      content: '';
      width: 24px;
      height: 24px;
      margin-right: 2px;
    }
  }
  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;

    .category-text {
      color: #000;
      font-size: 18px;
      letter-spacing: -0.45px;
      font-weight: 800;
      text-align: center;
    }
  }
  .on {
    display: flex;
  }

  .close-btn {
    display: block;
    width: 40px;
  }
`
