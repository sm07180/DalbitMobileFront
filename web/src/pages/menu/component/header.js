import React from 'react'
import styled from 'styled-components'
// static
import BackBtnIcon from '../static/ic_back_g.svg'
import {Hybrid, isHybrid} from "context/hybrid";

export default (props) => {
  const goBack = () => {
      if (isHybrid()) {
          Hybrid('CloseLayerPopup')
          context.action.updatenoticeIndexNum('')
          console.log(context.noticeIndexNum)
      }else{
          window.history.go(-1)
      }
      //window.location.href = '/'
  }
  //--------------------------------------------------------------------
  return (
    <Header className="header-wrap">
      <img className="close-btn" src={BackBtnIcon} onClick={goBack} />
      <div className="child-bundle">{props.children}</div>
    </Header>
  )
}
// styled
const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  height: 40px;
  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;
    .category-text {
      color: #000;
      font-size: 18px;
      font-weight: 800;
    }
  }
  .close-btn {
    position: absolute;
    left: 6px;
    display: block;
    width: 36px;
  }
`
